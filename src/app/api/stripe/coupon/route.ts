import { getStripeInstance } from "@/app/api/_payment/stripe";
import loggerServer from "@/loggerServer";
import { NextRequest } from "next/server";

import { NextResponse } from "next/server";

// get coupon by id
export async function GET(req: NextRequest) {
  try {
    const couponId = req.nextUrl.searchParams.get("couponId");
    if (!couponId) {
      return NextResponse.json(
        { error: "Coupon ID is required" },
        { status: 400 },
      );
    }

    const stripe = getStripeInstance();
    const coupon = await stripe?.coupons.retrieve(couponId);
    return NextResponse.json({ coupon });
  } catch (error: any) {
    loggerServer.error("Error getting coupon", error);
    return NextResponse.json(
      { error: "Error getting coupon" },
      { status: 500 },
    );
  }
}
