import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { webhookId } = body;
    const userWebhook = await prisma.userWebhookEvent.findUnique({
      where: {
        id: webhookId,
        userId: session.user.userId,
      },
    });

    if (!userWebhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    let allRelatedWebhooks = [userWebhook];
    if (userWebhook.requestIdempotencyKey) {
      allRelatedWebhooks = await prisma.userWebhookEvent.findMany({
        where: {
          requestIdempotencyKey: userWebhook.requestIdempotencyKey,
        },
      });
    }

    const now = new Date();

    await prisma.userWebhookEvent.updateMany({
      where: {
        id: {
          in: allRelatedWebhooks.map(webhook => webhook.id),
        },
      },
      data: {
        resolvedAt: now,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    loggerServer.error(
      "Error resolving webhook",
      session?.user?.userId || "Unknown user",
      error,
    );
    return NextResponse.json(
      { error: "Error resolving webhook" },
      { status: 500 },
    );
  }
}
