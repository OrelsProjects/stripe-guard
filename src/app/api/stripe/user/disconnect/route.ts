import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const userStripeCredentials = await prisma.userStripeCredentials.findUnique(
      {
        where: {
          userId: session.user.userId,
        },
      },
    );

    if (!userStripeCredentials) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    // if isConnected, use process.env.STRIPE_SECRET_KEY and accountId to create Stripe
    if (userStripeCredentials.connected) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        stripeAccount: userStripeCredentials.accountId as string,
      });

      await stripe.oauth.deauthorize({
        client_id: process.env.STRIPE_CLIENT_ID as string,
        stripe_user_id: userStripeCredentials.accountId as string,
      });
    } else {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      stripe.webhookEndpoints.del(userStripeCredentials.webhookId as string);
    }

    await prisma.userStripeCredentials.delete({
      where: {
        userId: session.user.userId,
      },
    });
  } catch (error: any) {
    loggerServer.error(
      "Error disconnecting Stripe",
      session?.user?.userId || "Unknown user",
      error,
    );
  }
}
