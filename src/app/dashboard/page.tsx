"use client";

import { ErrorCard } from "@/app/dashboard/components/errorCard";
import { ErrorDialog } from "@/app/dashboard/components/errorDialog";
import { WebhookGraph } from "@/app/dashboard/components/webhookGraph";
import { FadeIn } from "@/components/animations/fade-in";
import { Card } from "@/components/ui/card";
import { UserWebhooks } from "@prisma/client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
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

// Mock data - replace with real data in production
const mockGraphData = [
  { timestamp: "00:00", succeeded: 95, failed: 14 },
  { timestamp: "04:00", succeeded: 98, failed: 23 },
  { timestamp: "08:00", succeeded: 100, failed: 50 },
  { timestamp: "12:00", succeeded: 97, failed: 32 },
  { timestamp: "16:00", succeeded: 99, failed: 1 },
  { timestamp: "20:00", succeeded: 96, failed: 14 },
];

// Mock data - events = succeeded + failed
const eventVolumeData = mockGraphData.map(data => ({
  timestamp: data.timestamp,
  webhooks: data.succeeded + data.failed,
}));

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
  {
    eventId: "evt_1234567890",
    type: "checkout.session.completed",
    created: Date.now() / 1000 - 3600,
    pendingWebHooks: 2,
  },
  {
    eventId: "evt_0987654321",
    type: "auth.capture.completed",
    created: Date.now() / 1000 - 7200,
    pendingWebHooks: 1,
  },
];

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
  const [selectedError, setSelectedError] =
    useState<Partial<UserWebhooks> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Reduce, if error.type exists, add to the count, else create a new object
  // then map it to { reason: key, count: value } format
  const failureReasonsData = useMemo(() => {
    const reasons: { reason: string; count: number }[] = [];
    mockErrors.map(error => {
      if (reasons.some(reason => reason.reason === error.type)) {
        reasons.find(reason => reason.reason === error.type)!.count += 1;
      } else {
        reasons.push({ reason: error.type!, count: 1 });
      }
    });
    // make reason -> instead of checkout.session.completed, make it c.s.completed
    return reasons.map(reason => ({
      reason:
        reason.reason.split(".")[0].slice(0, 2) +
        "." +
        reason.reason.split(".")[1],
      count: reason.count,
    }));
  }, [mockErrors]);

  const totalSuccess = 98; // Calculate this based on your actual data

  return (
    <div className="container flex flex-col gap-2 bg-background py-8">
      <h1 className="text-4xl font-bold">Webhook Monitor</h1>
      <h2 className="text-2xl font-medium">Today&apos;s Webhook Performance</h2>
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background py-4">
        <div className="space-y-8">
          <WebhookGraph data={mockGraphData} totalSuccess={totalSuccess} />
          <ErrorDialog
            error={selectedError}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onResolve={error => setIsDialogOpen}
          />
        </div>
        {/* <FadeIn delay={0.3}> */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-full max-h-[478px]"
        >
          <Card className="p-6 h-full">
            <h3 className="text-lg font-semibold mb-4">
              Failure Reason Breakdown
            </h3>
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
          </Card>
        </motion.div>
        {/* </FadeIn> */}
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="p-4 h-full">
            {mockErrors.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Failed Webhooks</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
            ) : (
              <div className="flex gap-2">
                <CheckCircle2 className="w-6 h-6 text-success" />
                <p className="text-lg text-muted-foreground">
                  All the webhooks are running smoothly! 🚀
                </p>
              </div>
            )}
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Webhooks sent over time
            </h3>
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
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
