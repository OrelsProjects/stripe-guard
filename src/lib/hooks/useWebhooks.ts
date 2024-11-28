import { Logger } from "@/logger";
import { UserWebhooks } from "@prisma/client";
import axios from "axios";
import { useCallback } from "react";

export default function useUserWebhooks() {
  const getUserWebhooks = useCallback(async (): Promise<
    UserWebhooks[] | null
  > => {
    try {
      const userWebhooks = await axios.get<UserWebhooks[]>(
        "/api/stripe/user/webhooks-details",
      );
      return userWebhooks.data;
    } catch (error: any) {
      Logger.error("Error getting webhook details", error);
      return null;
    }
  }, []);

  return {
    getUserWebhooks,
  };
}
