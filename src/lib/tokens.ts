import prisma from "@/app/api/_db/db";
import moment from "moment";

export async function verifyUserTokens(userId: string) {
  const userTokens = await prisma.tokensPool.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!userTokens) {
    return false;
  }

  // Check if a month has passed since the last token purchase
  const lastTokenPurchase = moment(userTokens?.lastRefillAt);
  const currentDate = moment();
  // if lastTokenPurhcase day is the same or after current date of a higher month, refill tokens
  if (
    lastTokenPurchase.date() >= currentDate.date() &&
    lastTokenPurchase.month() >= currentDate.month()
  ) {
    await prisma.tokensPool.update({
      where: {
        userId: userId,
      },
      data: {
        tokensRemaining: userTokens.tokens,
        tokensUsed: 0,
        lastRefillAt: new Date(),
      },
    });
  }

  return true;
}
