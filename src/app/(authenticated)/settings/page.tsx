"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ApiSettings } from "@/components/settings/api-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { BillingSettings } from "@/components/settings/billing-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { useAppSelector } from "@/lib/hooks/redux";
import useAuth from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";
import { NotificationsChannel, UserSettingsDefault } from "@/models/user";
import { Loader } from "@/components/ui/loader";
import _ from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { selectAuth } from "@/lib/features/auth/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Logger } from "@/logger";
import { EventTracker } from "@/eventTracker";

export default function SettingsPage() {
  const { user, loading } = useAppSelector(selectAuth);
  const { updateUserSettings } = useAuth();

  const [userSettings, setUserSettings] = useState(
    user?.settings || UserSettingsDefault,
  );
  const [didSettingsChange, setDidSettingsChange] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    if (user) {
      setDidSettingsChange(!_.isEqual(user?.settings, userSettings));
    }
  }, [user, userSettings]);

  useEffect(() => {
    if (user) {
      setUserSettings(user?.settings);
    }
  }, [user]);

  const handleSave = async () => {
    if (loading) {
      return;
    }
    setLoadingSettings(true);
    EventTracker.track("settings_save_attempt");
    try {
      await updateUserSettings(userSettings);
      EventTracker.track("settings_save_success");
    } catch (error: any) {
      EventTracker.track("settings_save_error", { error: error.message });
      Logger.error(error);
    } finally {
      setLoadingSettings(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <PageHeader
          title="Settings"
          description="Manage your webhook monitoring preferences"
        />
        {loading ? (
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.[0] || <User className="h-4 w-4" />}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "No email"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <BillingSettings plan={userSettings.plan} loading={loading} />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <ThemeSettings />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <NotificationSettings
            notificationEmail={userSettings.notificationChannels.email}
            onChange={(value: NotificationsChannel) => {
              EventTracker.track("notification_settings_change", { value });
              setUserSettings({
                ...userSettings,
                notificationChannels: {
                  email: { ...value },
                },
              });
            }}
            loading={loading}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <ApiSettings
            connected={userSettings.connected}
            apiKey={userSettings.stripeApiKey}
            webhookUrl={userSettings.webhookUrl}
            loading={loading}
          />
        </div>
        {/* <RetrySettings /> */}
      </div>

      <AnimatePresence>
        {didSettingsChange && (
          <motion.div
            key="save-button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.7 }}
            className="container sticky bottom-0 flex justify-end py-4 bg-muted/60 backdrop-blur-md"
          >
            <Button onClick={handleSave} disabled={loading}>
              {loadingSettings && <Loader className="text-foreground mr-2" />}
              Save Changes
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
