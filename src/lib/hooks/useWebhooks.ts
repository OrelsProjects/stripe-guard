import { disconnectStripe } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Logger } from "@/logger";
import { Statistics, StatisticsServer } from "@/models/webhook";
import axios from "axios";
import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useCallback } from "react";

const iconMapping = {
  "Total webhooks": Activity,
  "Failed webhooks": AlertTriangle,
  "Success rate": CheckCircle,
  "Average time to complete": Clock,
};

export default function useWebhooks() {
  const dispatch = useAppDispatch();
  const resolveWebhook = useCallback(async (webhookId: string) => {
    try {
      await axios.patch("/api/webhook/resolve", { webhookId });
    } catch (error: any) {
      Logger.error("Error resolving webhook", error);
      throw new Error("Error resolving webhook");
    }
  }, []);

  const getStatistics = useCallback(async (): Promise<Statistics | null> => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const urlParams = new URLSearchParams({ timeZone });
      const userWebhooksStatistics = await axios.get<StatisticsServer>(
        "/api/stripe/user/webhook/statistics?" + urlParams,
      );
      const cardsData = userWebhooksStatistics.data.cardsData.map(card => ({
        ...card,
        icon: iconMapping[card.title],
      }));
      return {
        ...userWebhooksStatistics.data,
        cardsData,
      };
    } catch (error: any) {
      Logger.error("Error getting webhook details", error);
      throw error;
    }
  }, []);

  const disconnectUser = useCallback(async () => {
    try {
      await axios.delete("/api/stripe/user/disconnect");
      dispatch(disconnectStripe());
    } catch (error: any) {
      Logger.error("Error disconnecting user", error);
      throw new Error("Error disconnecting user");
    }
  }, []);

  return {
    disconnectUser,
    getStatistics,
    resolveWebhook,
  };
}
