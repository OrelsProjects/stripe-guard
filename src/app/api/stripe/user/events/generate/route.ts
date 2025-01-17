import { NextRequest } from "next/server";
import prisma from "@/app/api/_db/db";
import { NextResponse } from "next/server";
import { EmailSent, UserWebhookEvent } from "@prisma/client";
import { randomInt } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authOptions";
import cuid from "cuid";
type Events =
  | "charge.succeeded"
  | "charge.updated"
  | "payment_intent.created"
  | "payment_intent.succeeded"
  | "checkout.session.completed"
  | "payment_link.created"
  | "customer.discount.created";

const events: Record<Events, string> = {
  "charge.succeeded": "evt_3Qh7iORxhYQDfRYG1XccA7tv",
  "charge.updated": "evt_3Qh7hQRxhYQDfRYG0y3RGnM4",
  "payment_intent.created": "evt_3Qh7iORxhYQDfRYG1x7OR6ar",
  "payment_intent.succeeded": "evt_3Qh7iORxhYQDfRYG1wjVK4AT",
  "checkout.session.completed": "evt_1Qh7iPRxhYQDfRYGZck8yBWk",
  "payment_link.created": "evt_1Qh6tURxhYQDfRYGJCB1DHf1",
  "customer.discount.created": "evt_1Qh6KkRxhYQDfRYGSQqg6mSr",
};

function generateRandomTimestamp(): string {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
  const randomTime = new Date(
    startOfDay.getTime() +
      Math.random() * (endOfDay.getTime() - startOfDay.getTime()),
  );
  return randomTime.toISOString();
}

function generateStripeEvent(): Omit<UserWebhookEvent, "id"> {
  const eventIndex = randomInt(0, Object.keys(events).length);
  const userId = "cm5w9kkaf0002pcze708ps22y";
  const eventId = events[Object.keys(events)[eventIndex] as Events];
  const livemode = false;
  const eventTypeOptions = [
    "payment_intent",
    "charge",
    "invoice",
    "customer",
    "subscription",
  ];
  const type = Object.keys(events)[eventIndex];
  const created = generateRandomTimestamp();
  const succeeded = Math.random() < 0.995; // 99.5% success rate
  const pendingWebhooks = succeeded ? 0 : randomInt(1, 11);
  const requestId = `req_${cuid()}`;
  const requestIdempotencyKey = `key_${cuid()}`;
  const connected = false;
  const timeToComplete = randomInt(500, 750);

  return {
    userId,
    eventId,
    livemode,
    type,
    timeToComplete,
    succeeded,
    pendingWebhooks,
    requestId,
    requestIdempotencyKey,
    connected,
    created: new Date(created).getTime() / 1000,
    userNotifiedAt: null,
    createdAt: new Date(created),
    updatedAt: new Date(created),
    resolvedAt: null,
  };
}

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const FortyEvents = Array.from({ length: 300 }, () =>
      generateStripeEvent(),
    );

    await prisma.userWebhookEvent.deleteMany({
      where: {
        userId: session.user.userId,
      },
    });

    await prisma.userWebhookEvent.createMany({
      data: FortyEvents,
    });

    const failedWebhooks = FortyEvents.filter(event => !event.succeeded);
    const emailsSent: Omit<EmailSent, "id" | "createdAt" | "updatedAt">[] =
      failedWebhooks
        .map(event => ({
          email: "test@test.com",
          sentToCustomer: false,
          webhookEventId: event.eventId,
        }))
        .filter((event, index, self) => {
          return (
            self.findIndex(e => e.webhookEventId === event.webhookEventId) ===
            index
          );
        });

    await prisma.emailSent.deleteMany();

    await prisma.emailSent.createMany({
      data: emailsSent,
    });

    return NextResponse.json({ message: "Events generated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
