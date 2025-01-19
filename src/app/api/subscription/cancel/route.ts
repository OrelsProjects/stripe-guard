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
            isActive: true,
          },
        },
      },
    });

    const subscription = user?.subscriptions[user.subscriptions.length - 1];

    if (!subscription?.subscriptionId) {
      return new NextResponse("No active subscription found", { status: 400 });
    }

    const stripe = getStripeInstance();

    // Cancel the subscription at period end
    await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user's subscription status in database
    await prisma.subscription.update({
      where: { subscriptionId: subscription.subscriptionId },
      data: { isActive: false },
    });

    Logger.info("Subscription cancelled successfully", {
      email: session.user.email,
    });
    return new NextResponse("Subscription cancelled successfully", {
      status: 200,
    });
  } catch (error) {
    Logger.error("Error cancelling subscription", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
