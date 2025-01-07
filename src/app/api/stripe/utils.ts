import { Coupon } from "@/models/payment";
import Stripe from "stripe";

const LAUNCH_COUPON_NAME = "LAUNCH";
const LAUNCH_EMOJI = "🚀";

async function findCoupon(stripe: Stripe, month: string) {
  const coupons = await stripe.coupons.list();
  const coupon = coupons.data.find(coupon => coupon.name === month);
  return coupon;
}

async function getOrCreateMonthlyCoupon(stripe: Stripe) {
  const thisMonthName = new Date()
    .toLocaleString("default", {
      month: "long",
    })
    .toUpperCase();

  const existingCoupon = await findCoupon(stripe, thisMonthName);
  if (existingCoupon) {
    return existingCoupon;
  }

  // if between December and February, it's winter, if between March and May, it's spring, if between June and August, it's summer, if between September and November, it's fall
  const season =
    new Date().getMonth() >= 12 || new Date().getMonth() <= 2
      ? "WINTER"
      : new Date().getMonth() >= 3 && new Date().getMonth() <= 5
        ? "SPRING"
        : new Date().getMonth() >= 6 && new Date().getMonth() <= 8
          ? "SUMMER"
          : "FALL";
  const seasonEmoji =
    season === "WINTER"
      ? "🥶"
      : season === "SPRING"
        ? "🌸"
        : season === "SUMMER"
          ? "🌞"
          : "🍂";
  // Find coupon that's called DECEMBER, for example, if it's December
  const coupons = await stripe.coupons.list();
  let coupon = coupons.data.find(coupon => coupon.name === thisMonthName);
  if (!coupon) {
    coupon = await stripe.coupons.create({
      name: thisMonthName,
      duration: "repeating",
      duration_in_months: 1,
      metadata: {
        month: thisMonthName,
        season,
        seasonEmoji,
      },
      percent_off: 30,
    });
  }

  return coupon;
}

export async function getCoupon(stripe: Stripe): Promise<Coupon | null> {
  const coupons = await stripe.coupons.list();
  const coupon = coupons.data.find(
    coupon => coupon.name === LAUNCH_COUPON_NAME,
  );
  let value = coupon || (await getOrCreateMonthlyCoupon(stripe));
  const redeemBy = (coupon?.redeem_by || 0) * 1000;
  if (redeemBy) {
    const redeemByDate = new Date(redeemBy);
    if (redeemByDate < new Date()) {
      value = await getOrCreateMonthlyCoupon(stripe);
    }
  }
  return {
    id: value.id,
    name: value.name || "",
    percentOff: value.percent_off || 0,
    timesRedeemed: value.times_redeemed,
    maxRedemptions: value.max_redemptions,
    redeemBy,
    emoji: value.metadata?.seasonEmoji || LAUNCH_EMOJI,
  };
}
