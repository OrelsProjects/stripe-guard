"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Webhook } from "lucide-react";
import { DisconnectDialog } from "./disconnect-dialog";

interface SetupStripeProps {
  apiKey?: string;
  webhookUrl?: string;
}

export function ApiKeyView({ apiKey, webhookUrl }: SetupStripeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Stripe Configuration
        </h2>
        <p className="text-muted-foreground">
          Complete your Stripe setup to enable webhook monitoring
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col gap-0">
          <div className="space-y-2">
            <Label htmlFor="api-key">
              <div className="flex items-center space-x-2">
                <KeyRound className="h-4 w-4" />
                <span>Stripe API Key</span>
              </div>
            </Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              disabled
              className="font-mono"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your API key is securely stored and encrypted
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">
            <div className="flex items-center space-x-2">
              <Webhook className="h-4 w-4" />
              <span>Webhook URL</span>
            </div>
          </Label>
          <Input
            id="webhook-url"
            type="url"
            value={webhookUrl}
            disabled
            className="font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <DisconnectDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </div>
  );
}
