import { Logger } from "@/logger";
import { UserWebhookEvent } from "@prisma/client";
import axios from "axios";
import { useCallback } from "react";

export default function useUserWebhookEvents() {
  const getUserWebhookEvents = useCallback(async (): Promise<
    UserWebhookEvent[] | null
  > => {
    try {
      const getUserWebhookEvents = await axios.get<UserWebhookEvent[]>(
        "/api/stripe/user/webhooks-details",
      );
      return getUserWebhookEvents.data;
    } catch (error: any) {
      Logger.error("Error getting webhook details", error);
      return null;
    }
  }, []);

  return {
    getUserWebhookEvents,
  };
}
