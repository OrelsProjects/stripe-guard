import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import { encrypt } from "@/lib/utils/encryption";
import loggerServer from "@/loggerServer";
import { BillingHistory, UserSettings } from "@/models/user";
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
        payments: true,
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
      isOnboarded: false,
    };

    if (userData.payments && userData.payments.length > 0) {
      const tokens = await prisma.userTokens.findUnique({
        where: {
          userId: session.user.userId,
        },
        select: {
          tokensLeft: true,
        },
      });

      const userPayments = await prisma.payment.findMany({
        where: {
          userId: session.user.userId,
        },
        select: {
          amountReceived: true,
          currency: true,
          status: true,
          productName: true,
          createdAt: true,
          tokensAdded: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const billingHistory: BillingHistory[] = userPayments.map(payment => ({
        amount: payment.amountReceived,
        date: payment.createdAt,
        planName: payment.productName,
        tokensPurchased: payment.tokensAdded || 0,
      }));

      userSettings.plan = {
        tokensLeft: tokens?.tokensLeft || 0,
        billingHistory,
      };
    }

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
