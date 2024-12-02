"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import useStripeCredentials from "@/lib/hooks/useWebhooks";
import { WebhookError, Statistics } from "@/models/webhook";
import { ErrorDialog } from "@/app/(authenticated)/dashboard/components/errorDialog";
import TopEventTypeDistributionGraph from "@/app/(authenticated)/dashboard/components/graphs.tsx/topEventTypeDistributionGraph";
import WebhookErrorsCard from "@/app/(authenticated)/dashboard/components/graphs.tsx/webhooksErrorsCard";
import WebhooksSentOverTimeChart from "@/app/(authenticated)/dashboard/components/graphs.tsx/webhooksSentOverTimeChart";
import WebhookGraph from "@/app/(authenticated)/dashboard/components/graphs.tsx/webhookGraph";

function Dashboard() {
  const [selectedError, setSelectedError] = useState<WebhookError | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadingWebhooks = useRef(false);
  const { getUserWebhookEvents } = useStripeCredentials();

  useEffect(() => {
    if (loadingWebhooks.current) return;
    loadingWebhooks.current = true;
    setLoading(true);
    getUserWebhookEvents() // This function should now fetch the statistics
      .then(stats => setStatistics(stats))
      .catch(() => toast.error("Failed to fetch data"))
      .finally(() => {
        loadingWebhooks.current = false;
        setLoading(false);
      });
  }, []);

  const failureReasonsData = statistics?.failureReasonsData ?? [];
  const errors = statistics?.errors ?? [];
  const cardsData = statistics?.cardsData ?? [];
  const eventVolumeData = statistics?.eventVolumeData ?? [];
  const graphData = statistics?.graphData ?? [];
  const totalSuccess = statistics?.totalSuccess ?? 0;

  return (
    <div className="w-full h-full flex justify-center">
      <div className="container flex flex-col gap-2 bg-background py-8">
        <h1 className="text-4xl font-bold">Webhook Monitor</h1>
        <h2 className="text-xl">Today&apos;s Webhook Performance</h2>
        <div className="w-full h-full flex flex-col gap-8 relative">
          {/* Cards Mapping */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 z-10">
            {cardsData.map(stat => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon && (
                    <stat.icon
                      className={`h-6 w-6 ${
                        stat.variant === "destructive"
                          ? "text-destructive"
                          : stat.variant === "success"
                            ? "text-success"
                            : "text-foreground"
                      }`}
                    />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex justify-start">
                    {loading ? <Loader className="h-6 w-6" /> : stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Modularized Components */}
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background py-4">
            <div className="space-y-8">
              <WebhookGraph
                data={graphData}
                totalSuccess={totalSuccess}
                loading={loading}
              />

              <ErrorDialog
                error={selectedError}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onResolve={error => setIsDialogOpen}
              />
            </div>

            <TopEventTypeDistributionGraph
              loading={loading}
              failureReasonsData={failureReasonsData}
            />

            <WebhookErrorsCard
              loading={loading}
              errors={errors}
              onErrorClick={error => {
                setSelectedError(error);
                setIsDialogOpen(true);
              }}
            />

            <WebhooksSentOverTimeChart
              loading={loading}
              eventVolumeData={eventVolumeData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
