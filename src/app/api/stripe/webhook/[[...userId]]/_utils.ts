import { Event } from "@/models/payment";

export const REGISTERED_CONNECTED_HOOKS = 1; // Threshold for pending hooks
export const RETRIES = [30000, 10000]; // Retry times for pending hooks

export async function NotifyUserWebhookFailed(event: Event) {
  const failedWebhooks = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;
}
