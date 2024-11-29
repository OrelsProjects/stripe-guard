"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ApiSettings } from "@/components/settings/api-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { RetrySettings } from "@/components/settings/retry-settings";
import { BillingSettings } from "@/components/settings/billing-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { useAppSelector } from "@/lib/hooks/redux";
import useAuth from "@/lib/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { UserSettingsDefault } from "@/models/user";
import { Loader } from "@/components/ui/loader";

export default function SettingsPage() {
  const { user } = useAppSelector(state => state.auth);
  const { updateUserSettings } = useAuth();

  const [userSettings, setUserSettings] = useState(
    user?.settings || UserSettingsDefault,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserSettings(user?.settings);
    }
  }, [user]);

  const handleSave = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await updateUserSettings(userSettings);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your webhook monitoring preferences"
      />

      <div className="grid gap-6">
        <BillingSettings plan={userSettings.plan} />
        <ThemeSettings />
        <NotificationSettings
          notificationEmail={userSettings.notificationChannels.email}
          onEmailChange={value => {
            setUserSettings({
              ...userSettings,
              notificationChannels: {
                ...userSettings.notificationChannels,
                email: value,
              },
            });
          }}
        />
        <ApiSettings
          connected={userSettings.connected}
          apiKey={userSettings.stripeApiKey}
          webhookUrl={userSettings.webhookUrl}
        />
        {/* <RetrySettings /> */}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader className="text-foreground" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
