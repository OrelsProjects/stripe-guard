import { getStripeInstance } from "@/app/api/_payment/stripe";
import loggerServer from "@/loggerServer";
import { Interval, Product } from "@/models/payment";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  try {
    const stripe = getStripeInstance();
    const { data: stripeProducts } = await stripe.products.list();

    const products: Product[] = [];

    for (const stripeProduct of stripeProducts) {
      const { data: stripePrices } = await stripe.prices.list({
        product: stripeProduct.id,
      });
      stripePrices
        .filter(stripePrice => stripePrice.active && stripePrice.unit_amount)
        .map(stripePrice => {
          const product: Product = {
            id: stripeProduct.id,
            name: stripeProduct.description || stripeProduct.name,
            priceStructure: {
              id: stripePrice.id,
              currency: stripePrice.currency,
              price: stripePrice.unit_amount! / 100,
              interval: stripePrice.recurring?.interval as Interval,
            },
            noCreditCard: stripeProduct.metadata.noCreditCard === "true",
            features: stripeProduct.marketing_features.map(
              feature => feature.name || "",
            ),
            recommended: stripeProduct.metadata.recommended === "true",
          };
          products.push(product);
        });
    }

    const productsSortedByPrice = products.sort(
      (a, b) => a.priceStructure.price - b.priceStructure.price,
    );

    return NextResponse.json(productsSortedByPrice, { status: 200 });
  } catch (error: any) {
    loggerServer.error("Error getting webhook details", "system", error);
  }
}
