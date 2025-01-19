import { IntervalType, MIN_TOKENS } from "@/models/payment";

export const freePlan: Plan = {
  name: "Free",
  price: 0,
  interval: "monthly",
  tokensLeft: MIN_TOKENS,
  tokensUsed: 0,
  totalTokens: MIN_TOKENS,
  nextRefillAt: new Date(),
};

export const UserSettingsDefault: UserSettings = {
  userCriticalEvents: [],
  notificationChannels: {
    email: {
      enabled: false,
      value: "",
    },
  },
  plan: freePlan,
  connected: false,
  isOnboarded: false,
};

export type Plan = {
  name: string;
  price: number;
  interval: IntervalType;
  tokensLeft: number;
  tokensUsed: number;
  totalTokens: number;
  nextRefillAt: Date;
};

export type NotificationsChannel = {
  enabled: boolean;
  value: string;
};

export type NotificationChannels = {
  email: NotificationsChannel;
};
export type StripeKeyEncrypted = string;

export interface UserSettings {
  stripeApiKey?: StripeKeyEncrypted;
  webhookUrl?: string;

  connected: boolean;

  notificationChannels: NotificationChannels;

  plan: Plan;

  userCriticalEvents: string[];

  isOnboarded: boolean;
}

export interface AppUser {
  id: string;
  name?: string | null;
  image?: string | null;
  email?: string | null;
  settings: UserSettings;
}
