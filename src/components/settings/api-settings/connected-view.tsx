"use client";

import { Badge } from "@/components/ui/badge";
import { Check, Shield } from "lucide-react";
import { DisconnectDialog } from "./disconnect-dialog";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export function ConnectedView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Stripe Integration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your Stripe account is connected and webhooks are being monitored
          </p>
        </div>
        <Badge variant="success" className="flex items-center space-x-1">
          <Check className="h-3 w-3" />
          <span>Connected</span>
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 border-2 border-muted">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Active Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;re actively monitoring your webhook events and will notify
                you of any issues
              </p>
            </div>
          </div>
        </Card>
      </div>

      <DisconnectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
