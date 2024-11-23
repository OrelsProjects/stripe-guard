import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface SessionUser {
    userId: string;
    meta: {
      referralCode?: string;
      pushToken?: string;
    };
    settings?: {
      showNotifications: boolean;
    };
  }

  interface Session {
    user: SessionUser & DefaultSession["user"];
  }
}
