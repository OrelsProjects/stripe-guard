import { UserWebhookEvent } from "@prisma/client";

export interface WebhooksStatistics {
  succeeded: UserWebhookEvent[];
  failed: UserWebhookEvent[];
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

export type WebhookCardStatsTitles =
  | "Total Webhooks"
  | "Failed Webhooks"
  | "Success Rate";

// element (Icon) with className as props
type Icon = React.FC<React.SVGProps<SVGSVGElement>>;

export type WebhookCardStats = {
  title: WebhookCardStatsTitles;
  value: number;
  description: string;
  icon: Icon;
  variant?: "destructive" | "success";
};
