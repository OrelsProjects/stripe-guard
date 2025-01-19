import prisma from "@/app/api/_db/db";
import Stripe from "stripe";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { sendMail } from "@/app/api/_utils/mail/mail";
import { generateWebhookFailureEmail } from "@/app/api/_utils/mail/templates";
import {
  REGISTERED_CONNECTED_HOOKS,
  INITIAL_RETRY_DELAY,
  MAX_RETRIES,
} from "@/app/api/stripe/webhook/[[...userId]]/_utils";

import loggerServer from "@/loggerServer";
import { EnabledEvent, Event, criticalEvents } from "@/models/payment";
import { UserStripeCredentials, UserWebhookEvent } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment";
import { verifyUserTokensAndRefill } from "@/lib/tokens";

// TODO: Send the user an email when a webhook fails and add a button to contact support.

export const maxDuration = 10; // 1 minute

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
  return pendingHooks > 0;
}

async function retryPendingWebhooks(
  stripe: Stripe,
  eventId: string,
): Promise<boolean> {
  const delay = INITIAL_RETRY_DELAY;

  for (let i = 0; i < MAX_RETRIES; i++) {
    await new Promise(resolve => setTimeout(resolve, delay));
    // delay = Math.min(delay * 2, MAX_RETRY_DELAY); // Exponential backoff with cap
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
  userId: string,
  existingWebhookEvents: UserWebhookEvent[],
) {
  const userCriticalEvents = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
    select: {
      userCriticalEvents: true,
    },
  });

  const allCriticalEvents = criticalEvents.concat(
    (userCriticalEvents?.userCriticalEvents || []) as EnabledEvent[],
  );

  const isRightEvent = allCriticalEvents.includes(event.type);
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
  userId: string,
  userStripeCredentials: UserStripeCredentialsWithUser,
  event: Event,
  succeeded: boolean,
  timeToComplete: number,
) {
  const webhooksPending = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;

  const { email } = userStripeCredentials.user;

  const existingWebhookEvents = await prisma.userWebhookEvent.findMany({
    where: {
      requestIdempotencyKey: event.request?.idempotency_key,
      eventId: event.id,
    },
  });

  // const didSucceedBefore = await didSucceed(existingWebhookEvents);
  // const takeToken = await shouldTakeToken(existingWebhookEvents, succeeded);
  const sendEmailToCustomer = await shouldSendEmailToCustomer(
    event,
    userStripeCredentials.userId,
    existingWebhookEvents,
  );

  const userWebhookEventId = await prisma.userWebhookEvent.create({
    data: {
      userId: userId,
      eventId: event.id,
      livemode: event.livemode,
      type: event.type,
      created: event.created,
      pendingWebhooks: webhooksPending,
      timeToComplete,
      requestId: event.request?.id,
      requestIdempotencyKey: event.request?.idempotency_key,
      succeeded,
      connected: userStripeCredentials?.connected,
    },
    select: {
      id: true,
    },
  });

  await prisma.tokensPool.update({
    where: {
      userId: userId,
    },
    data: {
      tokensRemaining: {
        decrement: 1,
      },
    },
  });

  // if (!takeToken || didSucceedBefore) {
  //   // No need to update tokens or client about webhook resolution. Webhook already handled for that case.
  //   return;
  // }

  const customerEmail = sendEmailToCustomer
    ? (event.data.object as any).billing_details?.email
    : undefined;

  if (succeeded) {
    await handleWebhookSuccess(event, email || "");
  } else {
    await handleWebhookFailure(
      event,
      email || "",
      userWebhookEventId.id,
      customerEmail,
    );
  }
}

async function handleWebhookSuccess(event: Event, userEmail: string) {}

async function handleWebhookFailure(
  event: Event,
  userEmail: string,
  userWebhookEventId: string,
  customerEmail?: string,
) {
  const failedWebhooks = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;
  const eventType = event.type;

  const fourHoursAgo = moment().subtract(4, "hours").toDate();

  const emailsSentForEvent = await prisma.emailSent.findMany({
    where: {
      AND: [
        {
          webhookEvent: {
            eventId: event.id,
            succeeded: false,
          },
        },
        {
          createdAt: {
            gte: fourHoursAgo,
          },
        },
      ],
    },
    select: {
      sentToCustomer: true,
    },
  });

  const emailsNotSentToCustomer = emailsSentForEvent.filter(
    email => !email.sentToCustomer,
  );
  const emailsSentToCustomer = emailsSentForEvent.filter(
    email => email.sentToCustomer,
  );

  await sendMail(
    userEmail,
    process.env.NEXT_PUBLIC_APP_NAME as string,
    "Webhook Failed",
    generateWebhookFailureEmail(event, new Date(), failedWebhooks),
  );
  await prisma.emailSent.create({
    data: {
      email: userEmail,
      webhookEventId: userWebhookEventId,
      sentToCustomer: false,
    },
  });

  if (!criticalEvents.includes(eventType)) {
    return;
  }

  // Possible feature. Send email to customer if webhook failed.
  // if (customerEmail && emailsSentToUser.length === 0) {
  //   const emailContent = generateUserAlertEmail(eventType);
  //   if (!emailContent) {
  //     return;
  //   }
  //   sendMail(
  //     customerEmail,
  //     process.env.NEXT_PUBLIC_APP_NAME as string,
  //     "Problem processing your payment",
  //     emailContent,
  //   );
  //   await prisma.emailSent.create({
  //     data: {
  //       email: customerEmail,
  //       webhookEventId: userWebhookEventId,
  //       sentToCustomer: true,
  //     },
  //   });
  // }
}

async function processStripeEvent(
  userId: string,
  userStripeCredentials: UserStripeCredentialsWithUser,
  event: Event,
) {
  const stripe = initializeStripe(userStripeCredentials);
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  const newEvent = await stripe.events.retrieve(event.id);
  let pendingHooks = newEvent.pending_webhooks;
  const now = new Date().getTime();
  const webhookSucceeded = !areTherePendingWebhooks(pendingHooks)
    ? true
    : await retryPendingWebhooks(stripe, newEvent.id);

  const timeToComplete = new Date().getTime() - now;

  await handleWebhookResolution(
    userId,
    userStripeCredentials,
    newEvent,
    webhookSucceeded,
    timeToComplete,
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId?: string[] } },
) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Event | null = null;

  // validate webhook
  const userStripeCredentials = await prisma.userStripeCredentials.findUnique({
    where: { userId: params.userId?.[0] },
  });

  if (!userStripeCredentials) {
    return NextResponse.json(
      { error: "Unauthorized access, no user" },
      { status: 401 },
    );
  }

  const webhookSecret = userStripeCredentials.webhookSecret;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Unauthorized access, no webhook secret" },
      { status: 401 },
    );
  }

  const stripe = getStripeInstance({
    apiKey: userStripeCredentials.apiKey as string,
  });

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (error: any) {
    loggerServer.error("Error validating webhook", "Unknown", error);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

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
        { error: "Unauthorized access, no user stripe credentials" },
        { status: 401 },
      );
    }

    const userIdNonNull = userId || userStripeCredentials.userId;

    const canProcessEvent = await verifyUserTokensAndRefill(userIdNonNull);

    if (!canProcessEvent) {
      return NextResponse.json(
        { error: "You don't have enough tokens to process this event" },
        { status: 429 },
      );
    }

    processStripeEvent(userIdNonNull, userStripeCredentials, event);

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
