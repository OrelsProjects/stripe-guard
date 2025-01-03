import { authOptions } from "@/auth/authOptions";
import forge from "node-forge";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/api/_db/db";
import Stripe from "stripe";
import { decrypt } from "@/lib/utils/encryption";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import {
  StripePermissionError,
  StripePermissionErrorName,
} from "@/models/errors/StripePermissionError";
import { WebhookCreationResponse, allEvents } from "@/models/payment";

const createWebhook = async (
  key: string,
  userId: string,
): Promise<WebhookCreationResponse | undefined> => {
  const webhookEndpoint =
    (process.env.STRIPE_WEBHOOK_ENDPOINT as string) + "/" + userId;
  const stripe = getStripeInstance({ apiKey: key });
  try {
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookEndpoint,
      enabled_events: allEvents,
      description: process.env.NEXT_PUBLIC_APP_NAME as string,
    });
    return webhook;
  } catch (error: any) {
    if (error.type === "StripePermissionError") {
      throw new StripePermissionError();
    }
    throw error;
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
    const returnError =
      error.name === StripePermissionErrorName
        ? error
        : "Internal Server Error";
    return NextResponse.json({ error: returnError }, { status: 500 });
  }
}
