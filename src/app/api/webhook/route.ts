import { StripeSuccessWebhook } from "@/models/stripe/successWebhook";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body: StripeSuccessWebhook = await req.json();
    const apiKey = process.env.STRIPE_API_KEY as string;
    const stripe = new Stripe(apiKey);
    // add stripe radar rule to block payment from iran
    const valueList = await stripe.radar.valueLists.create({
      alias: "blocked_countries",
      name: "Blocked Countries",
      item_type: "country",
    });

    const iran = await stripe.radar.valueListItems.create({
      value: "IR",
      value_list: valueList.id,
    });
    // Delet IR from blocked countries
    stripe.radar.valueListItems.del(iran.id);

    // const response: Stripe.Response<Stripe.WebhookEndpoint> =
    //   await stripe.webhookEndpoints.create({
    //     url: "h",
    //     enabled_events: ["charge.succeeded", "charge.failed"],
    //   });

    return NextResponse.json({ message: "Webhook endpoint created" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
