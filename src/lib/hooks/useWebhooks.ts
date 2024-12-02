import { Logger } from "@/logger";
import { UserWebhookEvent } from "@prisma/client";
import axios from "axios";
import { useCallback } from "react";

export default function useStripeCredentials() {
  const getUserWebhookEvents = useCallback(async (): Promise<
    UserWebhookEvent[] | null
  > => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const urlParams = new URLSearchParams({ timeZone });
      const getUserWebhookEvents = await axios.get<UserWebhookEvent[]>(
        "/api/stripe/user/webhooks-details?" + urlParams,
      );
      return getUserWebhookEvents.data;
    } catch (error: any) {
      Logger.error("Error getting webhook details", error);
      return null;
    }
  }, []);

  const disconnectUser = useCallback(async () => {
    try {
      await axios.delete("/api/stripe/user/disconnect");
    } catch (error: any) {
      Logger.error("Error disconnecting user", error);
      throw new Error("Error disconnecting user");
    }
  }, []);

  return {
    disconnectUser,
    getUserWebhookEvents,
  };
}
