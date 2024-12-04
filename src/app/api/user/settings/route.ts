import prisma from "@/app/api/_db/db";
import { getStripeInstance } from "@/app/api/_payment/stripe";
import { authOptions } from "@/auth/authOptions";
import { encrypt } from "@/lib/utils/encryption";
import loggerServer from "@/loggerServer";
import { UserSettings } from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const userData = await prisma.user.findUnique({
      where: {
        id: session.user.userId,
      },
      select: {
        subscription: true,
        settings: {
          select: {
            emailWebhookNotifications: true,
          },
        },
        stripeCredentials: {
          select: {
            apiKey: true,
            connected: true,
            webhookUrl: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSettings: UserSettings = {
      stripeApiKey: "",
      webhookUrl: userData.stripeCredentials?.webhookUrl || "",
      connected: userData.stripeCredentials?.connected || false,
      notificationChannels: {
        email: {
          enabled: userData.settings?.emailWebhookNotifications || false,
          value: session.user.email || "",
        },
      },
    };

    if (userData.subscription && userData.subscription.length > 0) {
      const stripe = getStripeInstance();
      const product = await stripe.products.retrieve(
        userData.subscription[0].productId,
      );
      const price = await stripe.prices.retrieve(
        userData.subscription[0].priceId,
      );
      const stripeSession = await stripe.checkout.sessions.retrieve(
        userData.subscription[0].sessionId,
      );
      const subscription = await stripe.subscriptions.retrieve(
        stripeSession.subscription as string,
      );

      const productName = product.name;
      const planPrice = (price.unit_amount || 0) / 100;

      const tokens = await prisma.userTokens.findUnique({
        where: {
          userId: session.user.userId,
        },
        select: {
          tokensLeft: true,
        },
      });

      userSettings.plan = {
        name: productName,
        price: planPrice,
        tokens: tokens?.tokensLeft || 0,
      };
    }

    if (userData.stripeCredentials && !userData.stripeCredentials?.connected) {
      const encryptedApiKey = encrypt(userData.stripeCredentials.apiKey!);
      userSettings.stripeApiKey = encryptedApiKey;
    }

    return NextResponse.json(userSettings, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error getting user settings",
      session?.user?.userId || "Unknown user",
      error,
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const settings = (await req.json()) as UserSettings;

    await prisma.userSettings.upsert({
      where: {
        userId: session.user.userId,
      },
      create: {
        emailWebhookNotifications: settings.notificationChannels.email.enabled,
        emailToNotify: settings.notificationChannels.email.value,
        appUser: {
          connect: { id: session.user.userId }, // Assuming `session.user.userId` matches the related User ID
        },
      },
      update: {
        emailWebhookNotifications: settings.notificationChannels.email.enabled,
        emailToNotify: settings.notificationChannels.email.value,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error updating webhook details",
      session?.user?.userId || "Unknown user",
      error,
    );
  }
}
