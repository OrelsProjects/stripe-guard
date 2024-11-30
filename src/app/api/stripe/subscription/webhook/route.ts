import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import {
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleInvoiceFinalized,
  handleCustomerSubscriptionDeleted,
  handleCustomerSubscriptionTrialWillEnd,
  handleUnexpectedEvent,
} from "@/app/api/stripe/subscription/webhook/_handlers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = getStripeInstance();

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  try {
    await resolveEvent(event);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 },
    );
  }
}

async function resolveEvent(event: Stripe.Event) {
  switch (event.type) {
    case "invoice.payment_succeeded":
    //   await handleInvoicePaymentSucceeded(event);
      break;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event);
      break;
    case "invoice.finalized":
      await handleInvoiceFinalized(event);
      break;
    case "customer.subscription.deleted":
      await handleCustomerSubscriptionDeleted(event);
      break;
    case "customer.subscription.trial_will_end":
      await handleCustomerSubscriptionTrialWillEnd(event);
      break;
    default:
      await handleUnexpectedEvent(event);
  }
}
