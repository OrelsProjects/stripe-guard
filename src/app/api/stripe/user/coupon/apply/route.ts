import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { getTimesRedeemed, isCouponValid } from "@/app/api/stripe/utils";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { couponId } = await req.json();
    const stripe = getStripeInstance();
    const coupon = await stripe.coupons.retrieve(couponId);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    if (!isCouponValid(coupon)) {
      return NextResponse.json({ error: "Coupon not valid" }, { status: 400 });
    }

    const freeTokens = coupon.metadata?.freeTokens
      ? parseInt(coupon.metadata.freeTokens)
      : 0;

    const userTokens = await prisma.userTokens.findUnique({
      where: { userId: session.user.userId },
    });

    if (userTokens?.couponsUsed.includes(couponId)) {
      return NextResponse.json(
        { error: "Coupon already used" },
        { status: 400 },
      );
    }

    await prisma.userTokens.upsert({
      where: { userId: session.user.userId },
      update: {
        tokensLeft: { increment: freeTokens },
        couponsUsed: { push: couponId },
      },
      create: {
        userId: session.user.userId,
        tokensLeft: freeTokens,
        couponsUsed: [couponId],
      },
    });
    await prisma.payment.create({
      data: {
        userId: session.user.userId,
        amountReceived: 0,
        currency: "usd",
        status: "completed",
        priceId: couponId,
        sessionId: "coupon",
        productId: couponId,
        tokensAdded: freeTokens,
        productName: coupon.name || coupon.metadata?.title || "Coupon",
      },
    });

    const timesRedeemed = getTimesRedeemed(coupon);

    await stripe.coupons.update(couponId, {
      metadata: {
        manual_times_redeemed: timesRedeemed + 1,
      },
    });

    return NextResponse.json({ message: "Coupon applied" });
  } catch (error: any) {
    loggerServer.error("Error applying coupon", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
