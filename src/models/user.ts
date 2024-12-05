export const UserSettingsDefault: UserSettings = {
  notificationChannels: {
    email: {
      enabled: false,
      value: "",
    },
  },
  connected: false,
};

export type BillingHistory = {
  amount: number;
  date: Date;
  planName: string;
  tokensPurchased: number;
};

export type Plan = {
  tokensLeft: number;
  billingHistory: BillingHistory[];
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

  plan?: Plan;
}

export interface AppUser {
  id: string;
  name?: string | null;
  image?: string | null;
  email?: string | null;
  settings: UserSettings;
}
