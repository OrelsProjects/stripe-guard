import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import { getNextRefillAt } from "@/lib/tokens";
import { encrypt } from "@/lib/utils/encryption";
import loggerServer from "@/loggerServer";
import { criticalEvents, IntervalType } from "@/models/payment";
import { freePlan, UserSettings } from "@/models/user";
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
        subscriptions: true,
        settings: {
          select: {
            emailWebhookNotifications: true,
            userCriticalEvents: true,
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

    let plan = freePlan;

    const tokensPool = await prisma.tokensPool.findUniqueOrThrow({
      where: {
        userId: session.user.userId,
      },
    });

    const subscription =
      userData.subscriptions[userData.subscriptions.length - 1];

    const interval = subscription
      ? (subscription.refillInterval as IntervalType)
      : null;

    const nextRefillAt = getNextRefillAt(interval, tokensPool.lastRefillAt);

    plan.nextRefillAt = nextRefillAt;
    if (subscription) {
      plan = {
        name: subscription.name,
        price: subscription.price,
        interval: subscription.paymentInterval as IntervalType,
        tokensLeft: tokensPool?.tokensRemaining || 0,
        tokensUsed: tokensPool?.tokensUsed || 0,
        totalTokens: subscription.tokens,
        isActive: subscription.isActive,
        nextRefillAt,
      };
    }

    const userSettings: UserSettings = {
      userCriticalEvents:
        userData.settings?.userCriticalEvents || criticalEvents,
      stripeApiKey: "",
      webhookUrl: userData.stripeCredentials?.webhookUrl || "",
      connected: userData.stripeCredentials?.connected || false,
      notificationChannels: {
        email: {
          enabled: userData.settings?.emailWebhookNotifications || false,
          value: session.user.email || "",
        },
      },
      isOnboarded: false,
      plan,
    };

    if (userData.stripeCredentials && !userData.stripeCredentials?.connected) {
      const encryptedApiKey = encrypt(userData.stripeCredentials.apiKey!);
      userSettings.stripeApiKey = encryptedApiKey;
    }

    userSettings.isOnboarded =
      !!userData.stripeCredentials?.connected ||
      userSettings.stripeApiKey !== "";

    return NextResponse.json(userSettings, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error getting user settings",
      session?.user?.userId || "Unknown user",
      error,
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
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
        userCriticalEvents: settings.userCriticalEvents,
        emailToNotify: settings.notificationChannels.email.value,
        appUser: {
          connect: { id: session.user.userId }, // Assuming `session.user.userId` matches the related User ID
        },
      },
      update: {
        emailWebhookNotifications: settings.notificationChannels.email.enabled,
        userCriticalEvents: settings.userCriticalEvents,
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
