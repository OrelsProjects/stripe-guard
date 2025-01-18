import { getStripeInstance } from "@/app/api/_payment/stripe";
import { getCoupon } from "@/app/api/stripe/utils";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { eventsForSubscriptionWebhook } from "@/models/payment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

async function validateWebhookExists(stripe: Stripe) {
  const webhooks = await stripe.webhookEndpoints.list();
  const appWebhook = webhooks.data.find(
    webhook => webhook.metadata.app === appName,
  );
  if (!appWebhook) {
    // create
    const webhookUrl = `${process.env.NEXT_PUBLIC_WEBHOOK_BASE}/api/stripe/webhook/subscription`;
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: eventsForSubscriptionWebhook,
      metadata: { app: appName || "" },
    });
    console.log("webhook", webhook);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const nextUrl = req.nextUrl;
    const { priceId, productId } = await req.json();
    const stripe = getStripeInstance();
    await validateWebhookExists(stripe);

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${nextUrl.origin}/api/stripe/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${nextUrl.origin}/cancel`,
      client_reference_id: session.user.userId,
      customer_email: session.user.email || "",
      metadata: {
        clientName: session.user.name || "",
        productId,
        priceId,
        userId: session.user.userId,
      },
    });
    return NextResponse.json({ sessionId: stripeSession.id }, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error creating a checkout session",
      session?.user?.userId || "Unknown user",
      error,
    );
    return NextResponse.json(
      { error: "Error creating a checkout session" },
      { status: 500 },
    );
  }
}
