import prisma from "@/app/api/_db/db";
import { sendMail } from "@/app/api/_utils/mail/mail";
import { generateWebhookFailureEmail } from "@/app/api/_utils/mail/templates";
import {
  EventAccountNotNull,
  REGISTERED_CONNECTED_HOOKS,
  RETRIES,
} from "@/app/api/stripe/webhook/connect/_utils";
import loggerServer from "@/loggerServer";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface StripeWebhookConnectBody {
  account: string;
  api_version: string;
  created: number;
  data: {
    object: {
      id: string;
      object: string;
      name: string;
    };
  };
  id: string;
  livemode: boolean;
  object: string;
  pending_webhooks: number;
  request: { id: string | null; idempotency_key: string | null };
  type: string;
}

function initializeStripe(stripeAccountId: string): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    stripeAccount: stripeAccountId,
  });
}

function verifyWebhook(
  body: EventAccountNotNull,
  signature: string,
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string;
  const stripe = initializeStripe(body.account);
  return stripe.webhooks.constructEvent(
    JSON.stringify(body),
    signature,
    webhookSecret,
  );
}

async function verifyUser(accountId: string): Promise<boolean> {
  // Implement user verification logic
  return true;
}

function areTherePendingWebhooks(pendingHooks: number): boolean {
  return pendingHooks > REGISTERED_CONNECTED_HOOKS;
}

async function retryPendingWebhooks(
  stripe: Stripe,
  eventId: string,
  initialPendingHooks: number,
): Promise<boolean> {
  let pendingHooks = initialPendingHooks;

  for (const waitTime of RETRIES) {
    await new Promise(resolve => setTimeout(resolve, waitTime));
    const updatedEvent = await stripe.events.retrieve(eventId);
    pendingHooks = updatedEvent.pending_webhooks;

    if (!areTherePendingWebhooks(pendingHooks)) {
      return true; // Webhook succeeded
    }
  }

  return false; // Webhook still pending
}

async function handleWebhookResolution(
  event: EventAccountNotNull,
  succeeded: boolean,
) {
  const webhooksPending = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;

  const userStripeCredentials = await prisma.userStripeCredentials.findUnique({
    where: { accountId: event.account },
    select: {
      user: true,
    },
  });

  const { user } = userStripeCredentials || {};

  if (!user) {
    // Log it
    return;
  }

  await prisma.userWebhookEvent.create({
    data: {
      userId: user.id,
      eventId: event.id,
      livemode: event.livemode,
      type: event.type,
      created: event.created,
      pendingWebHooks: webhooksPending,
      requestId: event.request?.id,
      requestIdempotencyKey: event.request?.idempotency_key,
      succeeded: webhooksPending === 0,
      connected: true,
    },
  });

  if (succeeded) {
    await handleWebhookSuccess(event);
  } else {
    await handleWebhookFailure(event);
  }
}

async function handleWebhookSuccess(event: EventAccountNotNull) {
  await sendMail(
    "orelsmail@gmail.com",
    "StripeGuard",
    "Webhook Failed",
    generateWebhookFailureEmail(
      event,
      new Date(),
      event.pending_webhooks - REGISTERED_CONNECTED_HOOKS,
    ),
  );
}

async function handleWebhookFailure(event: EventAccountNotNull) {
  const failedWebhooks = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;
}

async function processStripeEvent(
  event: EventAccountNotNull,
  stripeAccountId: string,
) {
  const stripe = initializeStripe(stripeAccountId);
  let pendingHooks = event.pending_webhooks;

  const webhookSucceeded = !areTherePendingWebhooks(pendingHooks)
    ? true
    : await retryPendingWebhooks(stripe, event.id, pendingHooks);

  await handleWebhookResolution(event, webhookSucceeded);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  let event = (await req.json()) as EventAccountNotNull;

  try {
    if (!event.account) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }
    const stripeAccountId = event.account || "";

    if (!stripeAccountId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const isVerified = await verifyUser(stripeAccountId);
    if (!isVerified) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    await processStripeEvent(event, stripeAccountId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    loggerServer.error("Error in Stripe webhook connect", event.account, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
