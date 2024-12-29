"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, KeyRound, Webhook } from "lucide-react";
import { DisconnectDialog } from "./disconnect-dialog";
import Link from "next/link";
import { Logger } from "@/logger";

export function SetupStripe() {
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsDialogOpen(true);
  };

  const confirmDisconnect = () => {
    // Here you would typically make an API call to your backend to remove the Stripe credentials
    Logger.warn("Disconnecting Stripe");
    setIsConnected(false);
    setApiKey("");
    setWebhookUrl("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Connect with Stripe
        </h2>
        <p className="text-muted-foreground">
          Setup your Stripe account to enable webhook monitoring
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <Button
          size="lg"
          className="w-full"
          onClick={handleConnect}
          disabled={!apiKey || !webhookUrl}
          asChild
        >
          <Link href="/stripe-setup/api-key">Setup Stripe</Link>
        </Button>
      </div>
    </div>
  );
}
