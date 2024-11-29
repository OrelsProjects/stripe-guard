import { authOptions } from "@/auth/authOptions";
import forge from "node-forge";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/_db/db";
import Stripe from "stripe";
import { decrypt } from "@/lib/utils/encryption";

type WebookCreationResponse = Stripe.Response<Stripe.WebhookEndpoint>;
type EnabledEvent = Stripe.WebhookEndpointCreateParams.EnabledEvent;

const paymentIntentEvents: EnabledEvent[] = [
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.created",
  "payment_intent.canceled",
  "payment_intent.amount_capturable_updated",
  "payment_intent.processing",
  "payment_intent.requires_action",
  "payment_intent.partially_funded",
];

const paymentMethodEvents: EnabledEvent[] = [
  "payment_method.attached",
  "payment_method.detached",
  "payment_method.updated",
  "payment_method.automatically_updated",
];

const setupIntentEvents: EnabledEvent[] = [
  "setup_intent.created",
  "setup_intent.succeeded",
  "setup_intent.canceled",
  "setup_intent.requires_action",
  "setup_intent.setup_failed",
];

const chargeEvents: EnabledEvent[] = [
  "charge.succeeded",
  "charge.failed",
  "charge.refunded",
  "charge.expired",
  "charge.captured",
  "charge.updated",
];

const subscriptionEvents: EnabledEvent[] = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
];

const invoiceEvents: EnabledEvent[] = [
  "invoice.created",
  "invoice.deleted",
  "invoice.finalization_failed",
  "invoice.finalized",
  "invoice.marked_uncollectible",
  "invoice.overdue",
  "invoice.paid",
  "invoice.payment_action_required",
  "invoice.payment_failed",
  "invoice.payment_succeeded",
  "invoice.sent",
  "invoice.upcoming",
  "invoice.updated",
  "invoice.voided",
  "invoice.will_be_due",
];

const allEvents: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
  ...paymentIntentEvents,
  ...paymentMethodEvents,
  ...setupIntentEvents,
  ...chargeEvents,
  ...subscriptionEvents,
  ...invoiceEvents,
];

const createWebhook = async (
  key: string,
  userId: string,
): Promise<WebookCreationResponse | undefined> => {
  const webhookEndpoint =
    (process.env.STRIPE_WEBHOOK_ENDPOINT as string) + "/" + userId;
  const stripe = new Stripe(key);
  try {
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookEndpoint,
      enabled_events: allEvents,
      description: "StripeGuard",
    });
    return webhook;
  } catch (error: any) {
    debugger;
  }
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { apiKey } = await req.json();
    const decryptedApiKey = decrypt(apiKey);

    const webhook = await createWebhook(decryptedApiKey, session.user.userId);
    if (!webhook) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 400 });
    }

    await prisma.userStripeCredentials.create({
      data: {
        userId: session.user.userId,
        apiKey: decryptedApiKey,
        webhookId: webhook.id,
        webhookUrl: webhook.url,
        webhookSecret: webhook.secret,
        connected: false,
      },
    });
    return NextResponse.json({ message: "API key saved" }, { status: 201 });
  } catch (error: any) {
    loggerServer.error(
      "Error saving webhook details",
      session?.user?.userId || "Unknown user",
      error,
    );
  }
}
