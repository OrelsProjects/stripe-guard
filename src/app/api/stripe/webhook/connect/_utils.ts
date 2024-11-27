import Stripe from "stripe";


export type EventAccountNotNull = Omit<Stripe.Event, "account"> & { account: string };

export const REGISTERED_CONNECTED_HOOKS = 1; // Threshold for pending hooks
export const RETRIES = [30000, 10000]; // Retry times for pending hooks


export async function NotifyUserWebhookFailed(event: EventAccountNotNull) {
  const failedWebhooks = event.pending_webhooks - REGISTERED_CONNECTED_HOOKS;
}
