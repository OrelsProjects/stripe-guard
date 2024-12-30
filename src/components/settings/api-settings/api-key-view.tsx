"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, KeyRound, Webhook } from "lucide-react";
import { DisconnectDialog } from "./disconnect-dialog";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { decrypt, encrypt } from "@/lib/utils/encryption";
import axios from "axios";
import { Logger } from "@/logger";
import { Loader } from "@/components/ui/loader";

interface SetupStripeProps {
  apiKey?: string;
  webhookUrl?: string;
}

export function ApiKeyView({ apiKey, webhookUrl }: SetupStripeProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKeyDecrypted, setApiKeyDecrypted] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleShowKey = async (show: boolean) => {
    if (show && !apiKeyDecrypted) {
      if (loading) return;
      setLoading(true);
      try {
        const apiKeyResponse = await axios.get<{ apiKey: string }>(
          "/api/stripe/api-key/decrypt",
        );
        const apiKey = apiKeyResponse.data.apiKey;
        if (apiKey) {
          setApiKeyDecrypted(apiKey);
        }
      } catch (error: any) {
        Logger.error("Error fetching decrypted API key:", error);
      } finally {
        setLoading(false);
      }
    }
    setShowKey(show);
  };

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
            <div className="flex items-center space-x-2 relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={showKey ? apiKeyDecrypted || apiKey : apiKey}
                disabled
                className="font-mono pr-8"
              />
              {loading ? (
                <Loader className="absolute right-4 h-5 w-5 animate-spin" />
              ) : showKey ? (
                <EyeOpenIcon
                  className="absolute right-2 h-5 w-5 text-foreground"
                  onClick={e => {
                    e.preventDefault();
                    handleShowKey(false);
                  }}
                />
              ) : (
                <EyeClosedIcon
                  className="absolute right-2 h-5 w-5 text-foreground"
                  onClick={e => {
                    e.preventDefault();
                    handleShowKey(true);
                  }}
                />
              )}
            </div>
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
        <DisconnectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </div>
    </div>
  );
}
