"use client";

export const canUseNotifications = () => {
  return (
    ("Notification" in window || "PushManager" in window) &&
    "serviceWorker" in navigator
  );
};

export const isMobilePhone = () => {
  if (typeof navigator !== "undefined") {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator?.userAgent
    );
  }
};
