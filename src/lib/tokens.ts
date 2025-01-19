import prisma from "@/app/api/_db/db";
import loggerServer from "@/loggerServer";
import { MIN_TOKENS } from "@/models/payment";
import { IntervalType } from "@/models/payment";
import { TokensPool } from "@prisma/client";
import moment from "moment";

export function getNextRefillAt(
  refillInterval: IntervalType | null,
  lastRefillAt: Date,
) {
  let interval = "month";
  if (refillInterval) {
    interval = refillInterval === "monthly" ? "month" : "year";
  }
  const nextRefillAt = moment(lastRefillAt).add(1, interval as any).toDate();
  return nextRefillAt;
}

export async function verifyUserTokensAndRefill(userId: string) {
  try {
    const userTokens = await prisma.tokensPool.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userTokens) {
      return false;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        AND: [{ userId: userId }, { isActive: true }],
      },
    });

    const refillInterval = subscription
      ? (subscription.refillInterval as IntervalType)
      : "monthly";

    const tokensAmountToRefill = subscription?.tokens || MIN_TOKENS;

    // Check if a month has passed since the last token purchase
    const lastTokenPurchase = moment(userTokens?.lastRefillAt).toDate();
    const nextRefillAt = getNextRefillAt(refillInterval, userTokens.lastRefillAt);
    // if lastTokenPurhcase day is the same or after current date of a higher month, refill tokens
    if (lastTokenPurchase >= nextRefillAt) {
      await prisma.tokensPool.update({
        where: {
          userId: userId,
        },
        data: {
          tokensRemaining: tokensAmountToRefill,
          tokensUsed: 0,
          lastRefillAt: new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    loggerServer.error(error as string);
    return true; // Return true as to not block the user from processing events due to an error on our side.
  }
}
