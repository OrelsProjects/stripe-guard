import { Logger } from "@/logger";
import { Statistics, StatisticsServer } from "@/models/webhook";
import axios from "axios";
import { Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { useCallback } from "react";

const iconMapping = {
  "Total Webhooks": Activity,
  "Failed Webhooks": AlertTriangle,
  "Success Rate": CheckCircle,
};

export default function useStripeCredentials() {
  const getUserWebhookEvents = useCallback(async (): Promise<
    Statistics | null
  > => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const urlParams = new URLSearchParams({ timeZone });
      const getUserWebhookEvents = await axios.get<StatisticsServer>(
        "/api/stripe/user/webhooks-details?" + urlParams,
      );
      const cardsData = getUserWebhookEvents.data.cardsData.map(card => ({
        ...card,
        icon: iconMapping[card.title],
      }));
      return {
        ...getUserWebhookEvents.data,
        cardsData,
      }
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
