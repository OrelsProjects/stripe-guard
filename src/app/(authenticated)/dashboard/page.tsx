"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import useWebhooks from "@/lib/hooks/useWebhooks";
import { WebhookError, Statistics } from "@/models/webhook";
import { ErrorDialog } from "@/app/(authenticated)/dashboard/components/errorDialog";
import TopEventTypeDistributionGraph from "@/app/(authenticated)/dashboard/components/graphs.tsx/topEventTypeDistributionGraph";
import WebhookErrorsCard from "@/app/(authenticated)/dashboard/components/graphs.tsx/webhooksErrorsCard";
import WebhooksSentOverTimeChart from "@/app/(authenticated)/dashboard/components/graphs.tsx/webhooksSentOverTimeChart";
import WebhookGraph from "@/app/(authenticated)/dashboard/components/graphs.tsx/webhookGraph";
import { UserWebhookEvent } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function Dashboard() {
  const [selectedError, setSelectedError] = useState<WebhookError | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(false);

  const loadingWebhooks = useRef(false);
  const { getUserWebhookEvents, resolveWebhook } = useWebhooks();

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

  const handleResolveWebhookError = async (webhookError: WebhookError) => {
    const { userWebhookEvent } = webhookError;
    const removedError = errors.find(
      error => error.userWebhookEvent.id === userWebhookEvent.id,
    );
    if (!removedError || !statistics) return;

    try {
      setStatistics({
        ...statistics,
        errors:
          errors.filter(
            error => error.userWebhookEvent.id !== userWebhookEvent.id,
          ) || [],
      });
      await resolveWebhook(userWebhookEvent.id);
    } catch {
      toast.error("Failed to resolve webhook error");
      if (statistics) {
        setStatistics({
          ...statistics,
          errors: [...errors],
        });
      }
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="container flex flex-col gap-2 bg-background py-8">
        <h1 className="text-4xl font-bold">Webhook Monitor</h1>
        <h2 className="text-xl">Today&apos;s Webhook Performance</h2>
        <div className="w-full h-full flex flex-col gap-8 relative">
          {/* Cards Mapping */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 z-10">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton className="h-32 w-full" key={i} />
                ))
              : cardsData.map(stat => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
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
                          {loading ? (
                            <Loader className="h-6 w-6" />
                          ) : (
                            stat.value
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {stat.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
          {/* Modularized Components */}
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background py-4">
            <WebhookErrorsCard
              loading={loading}
              errors={errors}
              onErrorClick={error => {
                setSelectedError(error);
                setIsDialogOpen(true);
              }}
              onResolve={handleResolveWebhookError}
            />
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
                onResolve={handleResolveWebhookError}
              />
            </div>

            <TopEventTypeDistributionGraph
              loading={loading}
              failureReasonsData={failureReasonsData}
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
