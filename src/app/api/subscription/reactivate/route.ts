import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Logger } from "@/logger";
import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import { getStripeInstance } from "@/app/api/_payment/stripe";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user's subscription from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.userId },
      select: {
        subscriptions: {
          select: {
            subscriptionId: true,
          },
          where: {
            isActive: false,
          },
        },
      },
    });

    const subscription = user?.subscriptions[user.subscriptions.length - 1];

    if (!subscription?.subscriptionId) {
      return new NextResponse("No inActive subscription found", { status: 400 });
    }

    const stripe = getStripeInstance();

    // Reactivate the subscription
    await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: false,
    });

    // Update user's subscription status in database
    await prisma.subscription.update({
      where: { subscriptionId: subscription.subscriptionId },
      data: { isActive: true },
    });

    Logger.info("Subscription reactivated successfully", {
      email: session.user.email,
    });
    return new NextResponse("Subscription reactivated successfully", {
      status: 200,
    });
  } catch (error) {
    Logger.error("Error reactivating subscription", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
