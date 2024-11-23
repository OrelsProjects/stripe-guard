"use client";

import { toast } from "react-toastify";
import axios from "axios";
import NotificationComponent from "@/components/ui/notification";
import { canUseNotifications, isMobilePhone } from "@/lib/utils/notificationUtils";
import { NotificationData } from "@/models/notification";
import { initMessaging, getUserToken } from "@/../firebase.config";
import { Logger } from "@/logger";

export default function useNotification() {
  const showNotification = async (notification: NotificationData) => {
    const notificationComponent = () => NotificationComponent({ notification });
    toast(notificationComponent, {
      autoClose: 3000,
    });
  };

  const didRequestPermission = () => {
    return localStorage.getItem("notificationPermissionRequested") === "true";
  };

  const setPermissionRequested = () => {
    localStorage.setItem("notificationPermissionRequested", "true");
  };

  const isPermissionGranted = () => {
    return Notification?.permission === "granted";
  };

  async function requestNotificationsPermission(
    initToken?: boolean,
  ): Promise<boolean> {
    if (!canUseNotifications()) {
      return false;
    }
    if (isPermissionGranted()) {
      return true;
    } else {
      initMessaging();
      const permissionResponse = await Notification.requestPermission();
      if (permissionResponse === "granted" && initToken) {
        await initNotifications();
      }
      return permissionResponse === "granted";
    }
  }

  /**
   * @returns push token or error message
   */
  async function initNotifications(): Promise<void> {
    if (Notification.permission !== "granted") {
      return;
    }
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then(registration => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope,
            );
          })
          .catch(error => {
            console.log("ServiceWorker registration failed: ", error);
          });
      });
    }
    let pushToken = "";
    try {
      initMessaging();
      pushToken = (await getUserToken()) || "no-token";
      if (isMobilePhone()) {
        await axios.patch("/api/user", { pushTokenMobile: pushToken });
      } else {
        await axios.patch("/api/user", { pushToken });
      }
    } catch (e: any) {
      Logger.error("Failed to get token", {
        data: {
          error: e,
          token: pushToken,
        },
      });
    }
  }

  return {
    showNotification,
    initNotifications,
    isPermissionGranted,
    didRequestPermission,
    setPermissionRequested,
    requestNotificationsPermission,
  };
}
