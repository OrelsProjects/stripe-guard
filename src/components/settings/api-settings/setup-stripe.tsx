"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, KeyRound, Webhook } from "lucide-react";
import { DisconnectDialog } from "./disconnect-dialog";
import Link from "next/link";

export function SetupStripe() {
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    // Here you would typically make an API call to your backend to store the Stripe credentials
    console.log(
      "Connecting with API Key:",
      apiKey,
      "and Webhook URL:",
      webhookUrl,
    );
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsDialogOpen(true);
  };

  const confirmDisconnect = () => {
    // Here you would typically make an API call to your backend to remove the Stripe credentials
    console.log("Disconnecting Stripe");
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
          <Link href="/stripe-setup">Setup Stripe</Link>
        </Button>
      </div>
    </div>
  );
}
