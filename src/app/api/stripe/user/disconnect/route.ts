import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
      const stripe = getStripeInstance({
        accountId: userStripeCredentials.accountId || "",
      });

      await stripe.oauth.deauthorize({
        client_id: process.env.STRIPE_CLIENT_ID as string,
        stripe_user_id: userStripeCredentials.accountId as string,
      });
    } else {
      const stripe = getStripeInstance({
        apiKey: userStripeCredentials.apiKey as string,
      });
      // Validate webhook exists. This function throws an error if the webhook does not exist
      const webhook = await stripe.webhookEndpoints.retrieve(
        userStripeCredentials.webhookId as string,
      );

      await stripe.webhookEndpoints.del(webhook.id);
    }

    await prisma.userStripeCredentials.delete({
      where: {
        userId: session.user.userId,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error disconnecting Stripe",
      session?.user?.userId || "Unknown user",
      error,
    );
    return NextResponse.json(
      { error: "Error disconnecting Stripe" },
      { status: 500 },
    );
  }
}
