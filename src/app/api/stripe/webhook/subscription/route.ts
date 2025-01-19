import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import loggerServer from "@/loggerServer";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { IntervalType, MIN_TOKENS } from "@/models/payment";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function getUserBySubscription(subscription: Stripe.Subscription) {
  const customer = await getStripeInstance().customers.retrieve(
    subscription.customer as string,
  );
  const email = (customer as Stripe.Customer).email;
  if (!email) {
    loggerServer.error(
      "No email found for customer",
      `${JSON.stringify(subscription)}`,
    );
    return null;
  }
  return await prisma.user.findUnique({
    where: { email: email },
  });
}

async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  // TODO: this event is called when the user has successfully paid for their subscription, for example, if the user has a monthly subscription, this event is called when the user has successfully paid for their monthly subscription
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  // Handle successful payment
  // Update user's subscription status
  // Send confirmation email
  console.log("Payment succeeded:", paymentIntent.id);

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  // Handle failed payment
  // Notify user about the failure
  // Update subscription status
  console.log("Payment failed:", paymentIntent.id);

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentRequiresAction(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  // Handle payment requiring additional action
  // Send email to user with link to complete payment
  console.log("Payment requires action:", paymentIntent.id);

  return NextResponse.json({ received: true });
}

async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  // Handle new subscription
  // Set up user's subscription in database
  const existingSubscription = await prisma.subscription.findUnique({
    where: {
      subscriptionId: subscription.id,
    },
  });

  if (existingSubscription) {
    return NextResponse.json({ received: true }, { status: 200 });
  }
  const product = await getStripeInstance().products.retrieve(
    subscription.items.data[0].plan.product as string,
  );
  if (!product) {
    loggerServer.error(
      "No product found for subscription",
      `${JSON.stringify(subscription)}`,
    );
    return NextResponse.json({ received: true }, { status: 400 });
  }
  const price = subscription.items.data[0].price;

  const user = await getUserBySubscription(subscription);
  if (!user) {
    loggerServer.error(
      "No user found for email",
      `${JSON.stringify(subscription)}`,
    );
    return NextResponse.json({ received: true }, { status: 400 });
  }
  let tokens = parseInt(product.metadata.tokens);
  if (isNaN(tokens)) {
    tokens = MIN_TOKENS;
  }
  await prisma.subscription.create({
    data: {
      userId: user.id,
      subscriptionId: subscription.id,
      productId: subscription.items.data[0].plan.product as string,
      status: subscription.status,
      tokens,
      price: (price.unit_amount || 0) / 1000,
      paymentInterval: price.recurring?.interval as IntervalType,
      refillInterval: "monthly",
    },
  });

  // Send welcome email
  console.log("Subscription created:", subscription.id);

  return NextResponse.json({ received: true });
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const user = await getUserBySubscription(subscription);
  if (!user) {
    loggerServer.error(
      "No user found for email",
      `${JSON.stringify(subscription)}`,
    );
    return NextResponse.json({ received: true }, { status: 400 });
  }

  const product = await getStripeInstance().products.retrieve(
    subscription.items.data[0].plan.product as string,
  );
  if (!product) {
    loggerServer.error(
      "No product found for subscription",
      `${JSON.stringify(subscription)}`,
    );
    return NextResponse.json({ received: true }, { status: 400 });
  }
  const price = subscription.items.data[0].price;
  let tokens = parseInt(product.metadata.tokens);
  if (isNaN(tokens)) {
    tokens = MIN_TOKENS;
  }

  // Update subscription status in database
  await prisma.subscription.upsert({
    where: {
      subscriptionId: subscription.id,
    },
    update: {
      status: subscription.status,
    },
    create: {
      userId: user.id,
      subscriptionId: subscription.id,
      productId: subscription.items.data[0].plan.product as string,
      status: subscription.status,
      tokens,
      price: (price.unit_amount || 0) / 1000,
      paymentInterval: price.recurring?.interval as IntervalType,
      refillInterval: "monthly",
    },
  });

  if (subscription.status === "active") {
    await prisma.tokensPool.update({
      where: {
        userId: user.id,
      },
      data: {
        tokens: tokens,
        tokensRemaining: tokens,
        lastRefillAt: new Date(),
      },
    });
  }
  // Send notification if needed

  return NextResponse.json({ received: true });
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  // Handle subscription cancellation
  // Update user's access
  // Send cancellation confirmation
  console.log("Subscription deleted:", subscription.id);

  return NextResponse.json({ received: true });
}

async function handleCustomerSubscriptionTrialEnding(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  // Handle trial ending soon
  // Send reminder email
  // Prepare for conversion
  console.log("Trial ending soon:", subscription.id);

  return NextResponse.json({ received: true });
}

async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  // Handle failed invoice payment
  // Notify user
  // Update subscription status
  console.log("Invoice payment failed:", invoice.id);

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionExpired(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;

  // Handle abandoned checkout
  // Send recovery email
  // Track abandonment analytics
  console.log("Checkout session expired:", session.id);

  return NextResponse.json({ received: true });
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    );

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        return handlePaymentIntentSucceeded(event);

      case "payment_intent.payment_failed":
        return handlePaymentIntentFailed(event);

      case "payment_intent.requires_action":
        return handlePaymentIntentRequiresAction(event);

      case "customer.subscription.created":
        return handleSubscriptionCreated(event);

      case "customer.subscription.updated":
        return handleSubscriptionUpdated(event);

      case "customer.subscription.deleted":
        return handleSubscriptionDeleted(event);

      case "customer.subscription.trial_will_end":
        return handleCustomerSubscriptionTrialEnding(event);

      case "invoice.payment_failed":
        return handleInvoicePaymentFailed(event);

      case "checkout.session.expired":
        return handleCheckoutSessionExpired(event);

      default:
        console.log(`Unhandled event type: ${event.type}`);
        return NextResponse.json({ received: true });
    }
  } catch (err) {
    loggerServer.error("Webhook error", `${JSON.stringify(err)}`);
    console.error("Webhook error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
