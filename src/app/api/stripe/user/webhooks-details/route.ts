// File: /app/api/webhooks/route.ts

import prisma from "@/app/api/_db/db";
import { authOptions } from "@/auth/authOptions";
import loggerServer from "@/loggerServer";
import moment from "moment-timezone";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {
  FailureReason,
  GraphData,
  EventVolumeData,
  WebhookError,
  WebhookCardStats,
  StatisticsServer,
} from "@/models/webhook";
import { UserWebhookEvent } from "@prisma/client";

/**
 * GET /api/webhooks
 *
 * Retrieves webhook events for the authenticated user for the current day
 * and computes statistics to be returned to the frontend.
 *
 * The logic includes:
 * - Grouping events by `requestIdempotencyKey` to handle duplicates.
 * - Determining the success of a webhook based on `pendingWebhooks` count.
 * - Selecting the most relevant event per `requestIdempotencyKey`:
 *   - If any event has `pendingWebhooks === 0`, it's considered successful.
 *   - If none have `pendingWebhooks === 0`, select the event with the least `pendingWebhooks`.
 * - Excluding duplicate or less relevant events from statistics.
 */
export async function GET(req: NextRequest) {
  // Get the user session
  const session = await getServerSession(authOptions);

  // If no session, return unauthorized response
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the Unix timestamps for the start and end of the current day
    const today = moment().startOf("day").unix();
    const endOfDay = moment().endOf("day").unix();

    // Fetch all webhook events for the user for the current day
    const userWebhookEvents = await prisma.userWebhookEvent.findMany({
      where: {
        userId: session.user.userId,
        created: {
          gte: today,
          lte: endOfDay,
        },
      },
    });

    // Group events by `requestIdempotencyKey` to handle duplicates
    const eventsByKey = userWebhookEvents.reduce(
      (acc, event) => {
        const key = event.requestIdempotencyKey || event.id;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(event);
        return acc;
      },
      {} as Record<string, UserWebhookEvent[]>,
    );

    // Handle duplicates and select the most relevant event per key
    const processedEvents: UserWebhookEvent[] = [];

    for (const key in eventsByKey) {
      const events = eventsByKey[key];
      const successfulEvent = events.find(event => event.pendingWebhooks === 0);

      if (successfulEvent) {
        processedEvents.push(successfulEvent);
      } else {
        const eventWithLeastPending = events.reduce((prev, curr) => {
          return curr.pendingWebhooks < prev.pendingWebhooks ? curr : prev;
        }, events[0]);
        processedEvents.push(eventWithLeastPending);
      }
    }

    // Compute failure reasons data
    let failureReasonsData: FailureReason[] = [];

    if (processedEvents.length > 0) {
      const reasonsMap: Record<string, number> = {};

      processedEvents
        .filter(webhook => webhook.pendingWebhooks > 0)
        .forEach(error => {
          const reason = error.type || "Unknown";
          reasonsMap[reason] = (reasonsMap[reason] || 0) + 1;
        });

      failureReasonsData = Object.entries(reasonsMap)
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(reason => ({
          reason:
            reason.reason.split(".")[0].slice(0, 2) +
            "." +
            reason.reason.split(".")[1],
          count: reason.count,
        }));
    }

    // Compute errors array
    const errors: WebhookError[] = processedEvents
      .filter(webhook => webhook.pendingWebhooks > 0)
      .filter(webhook => !webhook.resolvedAt)
      .map(webhook => ({
        eventId: webhook.eventId,
        type: webhook.type || "Unknown",
        created: webhook.created,
        failedWebhooks: webhook.pendingWebhooks,
        userWebhookEvent: webhook,
      }));

    // Compute cards data for dashboard summary
    const totalWebhooks = processedEvents.length;
    const failedWebhooks = processedEvents.filter(
      w => w.pendingWebhooks > 0,
    ).length;

    const successRate =
      totalWebhooks === 0
        ? "0%"
        : `${(((totalWebhooks - failedWebhooks) / totalWebhooks) * 100).toFixed(
            2,
          )}%`;

    const cardsData: Omit<WebhookCardStats, "icon">[] = [
      {
        title: "Total Webhooks",
        value: totalWebhooks,
        description: "Total number of webhooks sent",
      },
      {
        title: "Failed Webhooks",
        value: failedWebhooks,
        description: "Total number of failed webhooks",
        variant: "destructive",
      },
      {
        title: "Success Rate",
        value: successRate,
        description: "Percentage of successful webhooks",
        variant: "success",
      },
    ];

    // Compute event volume data and graph data for charts
    const timestamps = processedEvents.map(w => w.created);
    const maxTime = Math.max(...timestamps);
    const minTime = Math.min(...timestamps);
    const timeSpan = maxTime - minTime;

    const webhooksByTime: Record<string, number> = {};
    const webhooksByTimeDetailed: Record<
      string,
      { succeeded: number; failed: number }
    > = {};

    processedEvents.forEach(webhook => {
      const date = moment.unix(webhook.created);
      const key =
        timeSpan > 86400 ? date.format("YYYY-MM-DD") : date.format("HH:00");

      webhooksByTime[key] = (webhooksByTime[key] || 0) + 1;

      if (!webhooksByTimeDetailed[key]) {
        webhooksByTimeDetailed[key] = { succeeded: 0, failed: 0 };
      }

      if (webhook.pendingWebhooks === 0) {
        webhooksByTimeDetailed[key].succeeded += 1;
      } else {
        webhooksByTimeDetailed[key].failed += 1;
      }
    });

    const eventVolumeData: EventVolumeData[] = Object.entries(webhooksByTime)
      .map(([timestamp, webhooks]) => ({
        timestamp,
        webhooks,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    const graphData: GraphData[] = Object.entries(webhooksByTimeDetailed)
      .map(([timestamp, data]) => ({
        timestamp,
        succeeded: data.succeeded,
        failed: data.failed,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    // Compute total number of successful webhooks
    const totalSuccess = processedEvents.reduce((acc, webhook) => {
      return webhook.pendingWebhooks === 0 ? acc + 1 : acc;
    }, 0);

    const statistics: StatisticsServer = {
      failureReasonsData,
      errors,
      cardsData,
      eventVolumeData,
      graphData,
      totalSuccess,
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error: any) {
    // Log any errors that occur during processing
    loggerServer.error(
      "Error getting webhook details",
      session?.user?.userId || "Unknown user",
      error,
    );

    // Return an internal server error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
