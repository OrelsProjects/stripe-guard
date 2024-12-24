import { Event } from "@/models/payment";

export const REGISTERED_CONNECTED_HOOKS = 1; // Threshold for pending hooks
export const INITIAL_RETRY_DELAY = 300;
// Retry times for pending hooks - Max 9 seconds, as stripe will timeout after 10 seconds
export const MAX_RETRIES = 6; // Max retries for pending hooks
export const MAX_RETRY_DELAY = 2100; // Cap delay at 2 seconds

// Max duration for webhook to respond: 300 + 600 + 1200 + 2100 + 2100 + 2100 = 8400ms

export async function NotifyUserWebhookFailed(event: Event) {
  const failedWebhooks = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;
}
