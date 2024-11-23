export type NotificationType = "saas-template";

export type NotificationData = {
  title: string;
  type: NotificationType;
  body?: string;
  image?: string;
  onClick?: () => void;
};
