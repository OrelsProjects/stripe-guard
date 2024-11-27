"use client";

import { ErrorCard } from "@/app/dashboard/components/errorCard";
import { ErrorDialog } from "@/app/dashboard/components/errorDialog";
import { WebhookGraph } from "@/app/dashboard/components/webhookGraph";
import { UserWebhooks } from "@prisma/client";
import { useState } from "react";

// Mock data - replace with real data in production
const mockGraphData = [
  { timestamp: "00:00", succeeded: 95, failed: 5 },
  { timestamp: "04:00", succeeded: 98, failed: 2 },
  { timestamp: "08:00", succeeded: 100, failed: 0 },
  { timestamp: "12:00", succeeded: 97, failed: 3 },
  { timestamp: "16:00", succeeded: 99, failed: 1 },
  { timestamp: "20:00", succeeded: 96, failed: 4 },
];

const mockErrors: Partial<UserWebhooks>[] = [
  {
    eventId: "evt_1234567890",
    type: "checkout.session.completed",
    created: Date.now() / 1000 - 3600,
    pendingWebHooks: 2,
  },
  {
    eventId: "evt_0987654321",
    type: "payment_intent.succeeded",
    created: Date.now() / 1000 - 7200,
    pendingWebHooks: 1,
  },
];

function Dashboard() {
  const [selectedError, setSelectedError] =
    useState<Partial<UserWebhooks> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalSuccess = 98; // Calculate this based on your actual data

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Webhook Monitor</h1>

        <WebhookGraph data={mockGraphData} totalSuccess={totalSuccess} />

        {mockErrors.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Failed Webhooks</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockErrors.map(error => (
                <ErrorCard
                  key={error.eventId}
                  error={error}
                  onClick={() => {
                    setSelectedError(error);
                    setIsDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <ErrorDialog
          error={selectedError}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </div>
  );
}

export default Dashboard;
