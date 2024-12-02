"use client";

import { ErrorCard } from "./components/errorCard";
import { ErrorDialog } from "./components/errorDialog";
import { WebhookGraph } from "./components/webhookGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useStripeCredentials from "@/lib/hooks/useWebhooks";
import { UserWebhookEvent } from "@prisma/client";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { Loader } from "@/components/ui/loader";
import {
  WebhookError,
  FailureReason,
  EventVolumeData,
  GraphData,
} from "@/models/webhook";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            {entry.name || entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [selectedError, setSelectedError] = useState<WebhookError | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [webhooks, setWebhooks] = useState<UserWebhookEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const loadingWebhooks = useRef(false);

  const { getUserWebhookEvents } = useStripeCredentials();

  useEffect(() => {
    if (loadingWebhooks.current) return;
    loadingWebhooks.current = true;
    setLoading(true);
    getUserWebhookEvents()
      .then(webhooks => setWebhooks(webhooks || []))
      .catch(() => toast.error("Failed to fetch data"))
      .finally(() => {
        loadingWebhooks.current = false;
        setLoading(false);
      });
  }, []);

  const failureReasonsData = useMemo((): FailureReason[] => {
    let reasons: { reason: string; count: number }[] = [];
    if (webhooks.length === 0) return reasons;
    webhooks
      ?.filter(webhook => !webhook.succeeded)
      .map(error => {
        if (reasons.some(reason => reason.reason === error.type)) {
          reasons.find(reason => reason.reason === error.type)!.count += 1;
        } else {
          reasons.push({ reason: error.type!, count: 1 });
        }
      });
    reasons = reasons.sort((a, b) => b.count - a.count).slice(0, 5);

    // make reason -> instead of checkout.session.completed, make it c.s.completed
    return reasons.map(reason => ({
      reason:
        reason.reason.split(".")[0].slice(0, 2) +
        "." +
        reason.reason.split(".")[1],
      count: reason.count,
    }));
  }, [webhooks]);

  const errors = useMemo((): WebhookError[] => {
    return webhooks
      .filter(webhook => !webhook.succeeded)
      .map(webhook => ({
        eventId: webhook.eventId,
        type: webhook.type,
        created: webhook.created,
        failedWebhooks: webhook.pendingWebHooks,
      }));
  }, [webhooks]);

  const cardsData = useMemo(() => {
    const totalWebhooks = webhooks.length;
    const failedWebhooks = webhooks.filter(
      webhook => !webhook.succeeded,
    ).length;
    const successRate = (totalWebhooks - failedWebhooks) / totalWebhooks;
    const successRateString = isNaN(successRate)
      ? "0%"
      : `${(successRate * 100).toFixed(2)}%`;

    return [
      {
        title: "Total Webhooks",
        value: totalWebhooks,
        description: "Total number of webhooks sent",
        icon: ({ className }: { className: string }) => (
          <Activity className={className} />
        ),
      },
      {
        title: "Failed Webhooks",
        value: failedWebhooks,
        description: "Total number of failed webhooks",
        icon: ({ className }: { className: string }) => (
          <AlertTriangle className={className} />
        ),
        variant: "destructive",
      },
      {
        title: "Success Rate",
        value: successRateString,
        description: "Percentage of successful webhooks",
        icon: ({ className }: { className: string }) => (
          <CheckCircle className={className} />
        ),
        variant: "success",
      },
    ];
  }, [webhooks]);

  const eventVolumeData = useMemo((): EventVolumeData[] => {
    const webhooksByTime = webhooks.reduce(
      (acc: Record<string, number>, webhook) => {
        const date = new Date(webhook.created * 1000);
        const timeSpan =
          Math.max(...webhooks.map(w => w.created)) -
          Math.min(...webhooks.map(w => w.created));
        const key =
          timeSpan > 86400
            ? date.toISOString().split("T")[0] // Format as YYYY-MM-DD
            : date.getHours().toString().padStart(2, "0") + ":00"; // Format as HH:00

        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(webhooksByTime)
      .map(([timestamp, webhooks]) => ({
        timestamp,
        webhooks,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [webhooks]);

  const graphData = useMemo((): GraphData[] => {
    const webhooksByTime = webhooks.reduce(
      (acc: Record<string, { succeeded: number; failed: number }>, webhook) => {
        const date = new Date(webhook.created * 1000);
        const timeSpan =
          Math.max(...webhooks.map(w => w.created)) -
          Math.min(...webhooks.map(w => w.created));
        const key =
          timeSpan > 86400
            ? date.toISOString().split("T")[0]
            : date.getHours().toString().padStart(2, "0") + ":00";

        if (!acc[key]) {
          acc[key] = { succeeded: 0, failed: 0 };
        }

        if (webhook.succeeded) {
          acc[key].succeeded += 1;
        } else {
          acc[key].failed += 1;
        }

        return acc;
      },
      {},
    );

    return Object.entries(webhooksByTime)
      .map(([timestamp, data]) => ({
        timestamp,
        succeeded: data.succeeded,
        failed: data.failed,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }, [webhooks]);

  const totalSuccess = useMemo(() => {
    return webhooks.reduce((acc, webhook) => {
      return webhook.succeeded ? acc + 1 : acc;
    }, 0);
  }, [webhooks]);

  return (
    <div className="container flex flex-col gap-2 bg-background py-8">
      <h1 className="text-4xl font-bold">Webhook Monitor</h1>
      <h2 className="text-xl">Today&apos;s Webhook Performance</h2>
      <div className="w-full h-full flex flex-col gap-8 relative">
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
          <Card className="h-full max-h-[478px] flex flex-col justify-between p-6">
            <CardTitle className="text-xl font-semibold mb-6">
              Top 5 Event Type Distribution
            </CardTitle>
            {loading ? (
              <Loader />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={failureReasonsData} barSize={40}>
                  <XAxis
                    dataKey="reason"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--destructive))"
                    radius={[4, 4, 0, 0]}
                    opacity={0.9}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card className="p-4 h-full flex flex-col gap-6">
            <CardTitle className="text-xl font-semibold">
              Webhook errors
            </CardTitle>
            {loading ? (
              <Loader />
            ) : errors.length > 0 ? (
              <div className="flex flex-col justify-between">
                <div className="max-h-[300px] grid gap-4 md:grid-cols-2 lg:grid-cols-1 pr-4 overflow-auto">
                  {errors.map(error => (
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
            ) : (
              <div className="w-full h-full flex gap-2  justify-center items-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
                <p className="text-lg text-muted-foreground">
                  All the webhooks are running smoothly! 🚀
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Webhooks sent over time
            </h3>
            {loading ? (
              <div className="h-[300px]">
                <Loader />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={eventVolumeData}>
                  <defs>
                    <linearGradient
                      id="eventGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="timestamp"
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="webhooks"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#eventGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
