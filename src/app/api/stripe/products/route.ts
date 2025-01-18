import { getStripeInstance } from "@/app/api/_payment/stripe";
import { getCoupon } from "@/app/api/stripe/utils";
import loggerServer from "@/loggerServer";
import { PriceStructure, Pricing, Product } from "@/models/payment";
import { NextRequest, NextResponse } from "next/server";

// revalidate always
export const revalidate = 0;

const appName = process.env.NEXT_PUBLIC_APP_NAME as string;

export async function GET(req: NextRequest) {
  try {
    const shouldGetLaunch = req.nextUrl.searchParams.get("shouldGetLaunch");
    const stripe = getStripeInstance();
    const { data: stripeProducts } = await stripe.products.list();

    const products: Product[] = [];

    const appProducts = stripeProducts
      .filter(stripeProduct => stripeProduct.active)
      .filter(stripeProduct =>
        stripeProduct.metadata.app
          ?.toLowerCase()
          .includes(appName.toLowerCase()),
      );

    for (const stripeProduct of appProducts) {
      const { data: priceData } = await stripe.prices.list({
        product: stripeProduct.id,
      });
      const stripePrices = priceData.filter(
        stripePrice => stripePrice.active && stripePrice.unit_amount,
      );

      const priceMonthly = stripePrices.find(
        price => price.recurring?.interval === "month",
      );
      const priceYearly = stripePrices.find(
        price => price.recurring?.interval === "year",
      );

      if (!priceMonthly || !priceYearly) {
        return;
      }

      const priceStructure: Pricing = {
        monthly: {
          id: priceMonthly.id,
          currency: priceMonthly.currency,
          price: priceMonthly.unit_amount! / 100,
          tokens: parseInt(stripeProduct.metadata.tokens),
        },
        yearly: {
          id: priceYearly.id,
          currency: priceYearly.currency,
          price: priceYearly.unit_amount! / 100,
          tokens: parseInt(stripeProduct.metadata.tokens),
        },
      };

      const product: Product = {
        id: stripeProduct.id,
        name: stripeProduct.name,
        description: stripeProduct.description || stripeProduct.name,
        priceStructure,
        noCreditCard: stripeProduct.metadata.noCreditCard === "true",
        features: stripeProduct.marketing_features.map(
          feature => feature.name || "",
        ),
        recommended: stripeProduct.metadata.recommended === "true",
      };
      products.push(product);
    }

    const productsSortedByPrice = products.sort(
      (a, b) => a.priceStructure.monthly.price - b.priceStructure.monthly.price,
    );

    const coupon = await getCoupon(stripe, shouldGetLaunch === "true");

    return NextResponse.json(
      { products: productsSortedByPrice, coupon },
      { status: 200 },
    );
  } catch (error: any) {
    loggerServer.error("Error getting products", "system", error);
    return NextResponse.json(
      { error: "Error getting products" },
      { status: 500 },
    );
  }
}
