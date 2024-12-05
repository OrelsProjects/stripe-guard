import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { sendMail } from "@/app/api/_utils/mail/mail";
import {
  generateInvoicePaymentFailedEmail,
  generateSubscriptionCanceledEmail,
  generateSubscriptionTrialEndingEmail,
} from "@/app/api/_utils/mail/templates";
import { Stripe } from "stripe";

const stripe = getStripeInstance();

async function getUserIdFromCustomerId(customerId: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { stripeCredentials: { accountId: customerId } },
    select: { id: true },
  });
  return user ? user.id : null;
}

export async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  if (invoice.billing_reason === "subscription_create") {
    const subscriptionId = invoice.subscription as string;
    const paymentIntentId = invoice.payment_intent as string;
    const customerId = invoice.customer as string;

    try {
      const userId = await getUserIdFromCustomerId(customerId);
      if (!userId) {
        throw new Error(`User not found for customer ${customerId}`);
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      await stripe.subscriptions.update(subscriptionId, {
        default_payment_method: paymentIntent.payment_method as string,
      });

      // Update the subscription in the database
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status: "active" },
      });

      // Create a new payment record
      await prisma.payment.create({
        data: {
          userId: userId,
          priceId: invoice.lines.data[0].price?.id || "",
          amountReceived: invoice.amount_paid,
          currency: invoice.currency,
          status: "succeeded",
          paymentMethodId: paymentIntent.payment_method as string,
          sessionId: "", // Add appropriate value
          productId: "", // Add appropriate value
          tokensAdded: 0, // Add appropriate value
          productName: "", // Add appropriate value
        },
      });
    } catch (err) {
      console.error(`Failed to update subscription ${subscriptionId}:`, err);
      throw err;
    }
  }
}

export async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;
  const userId = await getUserIdFromCustomerId(customerId);

  if (!userId) {
    console.error(`User not found for customer ${customerId}`);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  if (user && user.settings?.emailWebhookNotifications) {
    const emailTemplate = generateInvoicePaymentFailedEmail(
      invoice.id,
      invoice.amount_due,
      invoice.currency,
    );
    await sendMail(
      user.settings.emailToNotify || user.email!,
      "Stripe Guard",
      "Failed Payment",
      emailTemplate,
    );
  }

  // Update the subscription status in the database
  await prisma.subscription.updateMany({
    where: { customerId: customerId },
    data: { status: "past_due" },
  });
}

export async function handleInvoiceFinalized(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  // Store the invoice locally or perform any necessary actions
  console.log(`Invoice finalized: ${invoice.id}`);
}

export async function handleCustomerSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;
  const userId = await getUserIdFromCustomerId(customerId);

  if (!userId) {
    console.error(`User not found for customer ${customerId}`);
    return;
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "canceled",
      canceledAt: new Date(),
    },
  });

  // Update user metadata if necessary
  await prisma.userMetadata.updateMany({
    where: { userId: userId },
    data: { paidStatus: "free" },
  });

  // Send cancellation email
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  if (user && user.settings?.emailWebhookNotifications) {
    const emailTemplate = generateSubscriptionCanceledEmail(subscription.id);
    await sendMail(
      user.settings.emailToNotify || user.email!,
      "Stripe Guard",
      "Subscription Canceled",
      emailTemplate,
    );
  }
}

export async function handleCustomerSubscriptionTrialWillEnd(
  event: Stripe.Event,
) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;
  const userId = await getUserIdFromCustomerId(customerId);

  if (!userId) {
    console.error(`User not found for customer ${customerId}`);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  if (user && user.settings?.emailWebhookNotifications) {
    const emailTemplate = generateSubscriptionTrialEndingEmail(
      subscription.id,
      new Date(subscription.trial_end! * 1000),
    );
    await sendMail(
      user.settings.emailToNotify || user.email!,
      "Stripe Guard",
      "Trial Ending Soon",
      emailTemplate,
    );
  }
}

export async function handleUnexpectedEvent(event: Stripe.Event) {
  console.warn(`Unhandled event type: ${event.type}`);
}

