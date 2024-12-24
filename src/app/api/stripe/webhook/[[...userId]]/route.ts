import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { sendMail } from "@/app/api/_utils/mail/mail";
import { generateWebhookFailureEmail } from "@/app/api/_utils/mail/templates";
import {
  REGISTERED_CONNECTED_HOOKS,
  INITIAL_RETRY_DELAY,
  MAX_RETRY_DELAY,
  MAX_RETRIES,
} from "@/app/api/stripe/webhook/[[...userId]]/_utils";

import loggerServer from "@/loggerServer";
import { EnabledEvent, Event, sendAlertToUserEvents } from "@/models/payment";
import { User, UserStripeCredentials, UserWebhookEvent } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// TODO: Send the user an email when a webhook fails and add a button to contact support.

export const maxDuration = 60; // 1 minute

type LeanUser = {
  id: string;
  email?: string | null;
};

type UserStripeCredentialsWithUser = UserStripeCredentials & {
  user: LeanUser;
};

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

function initializeStripe(
  userStripeCredentials: UserStripeCredentials,
): Stripe | null {
  if (!userStripeCredentials.apiKey && userStripeCredentials.accountId) {
    return getStripeInstance({
      accountId: userStripeCredentials.accountId as string,
    });
  } else if (userStripeCredentials.apiKey) {
    return getStripeInstance({
      apiKey: (userStripeCredentials.apiKey as string) || "",
    });
  }

  return null;
}

// function verifyWebhook(
//   body: Event,
//   signature: string,
// ): Stripe.Event {
//   const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET as string;
//   const stripe = initializeStripe(body.account);
//   return stripe.webhooks.constructEvent(
//     JSON.stringify(body),
//     signature,
//     webhookSecret,
//   );
// }

async function getUserStripeCredentials(
  userDetails:
    | {
        accountId?: string;
        userId: string;
      }
    | {
        accountId: string;
        userId?: string;
      },
): Promise<UserStripeCredentialsWithUser | null> {
  const where = userDetails.accountId
    ? { accountId: userDetails.accountId }
    : { userId: userDetails.userId };

  const stripeCredentials = await prisma.userStripeCredentials.findUnique({
    where,
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return stripeCredentials;
}

function areTherePendingWebhooks(pendingHooks: number): boolean {
  return pendingHooks > REGISTERED_CONNECTED_HOOKS;
}

async function retryPendingWebhooks(
  stripe: Stripe,
  eventId: string,
): Promise<boolean> {
  let delay = INITIAL_RETRY_DELAY;

  for (let i = 0; i < MAX_RETRIES; i++) {
    await new Promise(resolve => setTimeout(resolve, delay));
    delay = Math.min(delay * 2, MAX_RETRY_DELAY); // Exponential backoff with cap
    const updatedEvent = await stripe.events.retrieve(eventId);
    if (!areTherePendingWebhooks(updatedEvent.pending_webhooks)) {
      return true; // Webhook succeeded
    }
  }

  return false; // Webhooks are still pending
}

/**
 * If the webhook event is of interest to the user, and it's the first time it fails, send an email.
 */
async function shouldSendEmailToCustomer(
  event: Event,
  existingWebhookEvents: UserWebhookEvent[],
) {
  const isRightEvent = sendAlertToUserEvents.includes(event.type);
  const hasFailedBefore = existingWebhookEvents.some(event => !event.succeeded);

  return isRightEvent && !hasFailedBefore;
}

/**
 * Logic to avoid taking tokens for the same webhook event with the same outcome (failure retries)
 * Also to avoid sending multiple emails for the same webhook event.
 */
async function shouldTakeToken(
  existingWebhookEvents: UserWebhookEvent[],
  succeeded: boolean,
) {
  const hasSameOutcome = existingWebhookEvents.some(
    existingEvent => existingEvent.succeeded === succeeded,
  );

  return !hasSameOutcome;
}

async function didSucceed(existingWebhookEvents: UserWebhookEvent[]) {
  return existingWebhookEvents.some(event => event.succeeded);
}

async function handleWebhookResolution(
  event: Event,
  userStripeCredentials: UserStripeCredentialsWithUser,
  succeeded: boolean,
) {
  const webhooksPending = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;

  const { id: userId, email } = userStripeCredentials.user;

  const existingWebhookEvents = await prisma.userWebhookEvent.findMany({
    where: {
      requestIdempotencyKey: event.request?.idempotency_key,
      eventId: event.id,
    },
  });

  const didSucceedBefore = await didSucceed(existingWebhookEvents);
  const takeToken = await shouldTakeToken(existingWebhookEvents, succeeded);
  const sendEmailToCustomer = await shouldSendEmailToCustomer(
    event,
    existingWebhookEvents,
  );

  await prisma.userWebhookEvent.create({
    data: {
      userId: userId,
      eventId: event.id,
      livemode: event.livemode,
      type: event.type,
      created: event.created,
      pendingWebhooks: webhooksPending,
      requestId: event.request?.id,
      requestIdempotencyKey: event.request?.idempotency_key,
      succeeded,
      connected: userStripeCredentials?.connected,
    },
  });

  if (!takeToken || didSucceedBefore) {
    // No need to update tokens or client about webhook resolution. Webhook already handled for that case.
    return;
  }

  try {
    await prisma.userTokens.update({
      where: {
        userId,
      },
      data: {
        tokensLeft: {
          decrement: 1,
        },
      },
    });
  } catch (error) {
    loggerServer.error("Error decrementing tokens", userId, error);
  }

  const customerEmail = sendEmailToCustomer
    ? (event.data.object as any).billing_details?.email
    : undefined;

  if (succeeded) {
    await handleWebhookSuccess(event, email || "");
  } else {
    await handleWebhookFailure(event, email || "", customerEmail);
  }
}

async function handleWebhookSuccess(event: Event, userEmail: string) {}

async function handleWebhookFailure(
  event: Event,
  userEmail: string,
  customerEmail?: string,
) {
  const failedWebhooks = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;
  await sendMail(
    userEmail,
    process.env.NEXT_PUBLIC_APP_NAME as string,
    "Webhook Failed",
    generateWebhookFailureEmail(event, new Date(), failedWebhooks),
  );

  // Possible feature. Send email to customer if webhook failed.
  // if (customerEmail) {
  //   sendMail(
  //     customerEmail,
  //     process.env.NEXT_PUBLIC_APP_NAME as string,
  //     "Problem processing your payment",
  //     generatePaymentProcessingIssueEmail(),
  //   );
  // }
}

async function processStripeEvent(
  userStripeCredentials: UserStripeCredentialsWithUser,
  event: Event,
) {
  const stripe = initializeStripe(userStripeCredentials);
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  let pendingHooks = event.pending_webhooks;

  const webhookSucceeded = !areTherePendingWebhooks(pendingHooks)
    ? true
    : await retryPendingWebhooks(stripe, event.id);

  await handleWebhookResolution(event, userStripeCredentials, webhookSucceeded);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId?: string[] } },
) {
  const signature = req.headers.get("stripe-signature");
  let event = (await req.json()) as Event;
  const stripe = getStripeInstance();

  const userId = params.userId?.[0];
  const accountId = event.account; // If accountId is null, it's a non-connected account

  try {
    if (!accountId && !userId) {
      loggerServer.error("No account or user id in webhook", "Unknown", event);
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const userStripeCredentials = await getUserStripeCredentials(
      accountId ? { accountId } : { userId: userId! },
    );

    if (!userStripeCredentials) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    processStripeEvent(userStripeCredentials, event);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error in Stripe webhook connect",
      accountId || userId || "Unknown",
      error,
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
