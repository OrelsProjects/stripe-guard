import Stripe from "stripe";

export async function getCoupon(stripe: Stripe, month: string) {
  const coupons = await stripe.coupons.list();
  const coupon = coupons.data.find(coupon => coupon.name === month);
  return coupon;
}

export async function getOrCreateMonthlyCoupon(stripe: Stripe) {
  const thisMonthName = new Date()
    .toLocaleString("default", {
      month: "long",
    })
    .toUpperCase();

  const existingCoupon = await getCoupon(stripe, thisMonthName);
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
