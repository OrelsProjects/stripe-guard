"use client";

import { Card } from "@/components/ui/card";
import { SetupStripe } from "@/components/settings/api-settings/setup-stripe";
import { ConnectedView } from "@/components/settings/api-settings/connected-view";
import { ApiKeyView } from "@/components/settings/api-settings/api-key-view";
import { Skeleton } from "@/components/ui/skeleton";

export interface ApiSettingsProps {
  apiKey?: string;
  webhookUrl?: string;
  connected?: boolean;
  loading?: boolean;
}

export function ApiSettings({
  apiKey,
  webhookUrl,
  connected = false,
  loading = false,
}: ApiSettingsProps) {
  return (
    <Card id="api-settings" className="p-4 md:p-6">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-64" />
        </div>
      ) : connected ? (
        <ConnectedView />
      ) : apiKey ? (
        <ApiKeyView apiKey={apiKey} webhookUrl={webhookUrl} />
      ) : (
        <SetupStripe />
      )}
    </Card>
  );
}

