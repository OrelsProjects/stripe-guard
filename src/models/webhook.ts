import { UserWebhooks } from "@prisma/client";

export interface WebhooksStatistics {
  succeeded: UserWebhooks[];
  failed: UserWebhooks[];
}

export type GraphData = {
  timestamp: string;
  succeeded: number;
  failed: number;
};

export type EventVolumeData = {
  timestamp: string;
  webhooks: number;
};

export type WebhookError = {
  eventId: string;
  type: string;
  created: number;
  failedWebhooks: number;
};

export type FailureReason = {
  reason: string;
  count: number;
};