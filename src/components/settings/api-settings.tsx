"use client";

import { Card } from "@/components/ui/card";
import { SetupStripe } from "@/components/settings/api-settings/setup-stripe";
import { ConnectedView } from "@/components/settings/api-settings/connected-view";
import { ApiKeyView } from "@/components/settings/api-settings/api-key-view";

export interface ApiSettingsProps {
  apiKey?: string;
  webhookUrl?: string;
  connected?: boolean;
}

export function ApiSettings({
  apiKey,
  webhookUrl,
  connected = false,
}: ApiSettingsProps) {
  return (
    <Card className="p-6">
      {connected ? (
        <ConnectedView />
      ) : apiKey ? (
        <ApiKeyView apiKey={apiKey} webhookUrl={webhookUrl} />
      ) : (
        <SetupStripe />
      )}
    </Card>
  );
}
