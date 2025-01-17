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

export type EventTimeToComplete = {
  timestamp: string;
  timeToComplete: number;
};

export type WebhookError = {
  eventId: string;
  type: string;
  created: number;
  failedWebhooks: number;
  timeToComplete: number;
  userWebhookEvent: UserWebhookEvent;
};

export type FailureReason = {
  reason: string;
  count: number;
};

export type WebhookCardStatsTitles =
  | "Total webhooks"
  | "Failed webhooks"
  | "Success rate"
  | "Average time to complete";

// element (Icon) with className as props
type Icon = React.FC<React.SVGProps<SVGSVGElement>>;

export type WebhookCardStats = {
  title: WebhookCardStatsTitles;
  value: number | string;
  description: string;
  icon: Icon;
  variant?: "destructive" | "success";
};

export type Statistics = {
  cardsData: WebhookCardStats[];
  errors: WebhookError[];
  failureReasonsData: FailureReason[];
  graphData: GraphData[];
  eventVolumeData: EventVolumeData[];
  eventTimeToComplete: EventTimeToComplete[];
  totalSuccess: string | number;
};

export type StatisticsServer = Omit<Statistics, "cardsData"> & {
  cardsData: Omit<WebhookCardStats, "icon">[];
};
