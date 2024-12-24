"use client";

import WebhookErrorsCard from "@/app/(authenticated)/dashboard/components/graphs.tsx/webhooksErrorsCard";
import { FadeIn } from "@/components/animations/fade-in";
import { Card } from "@/components/ui/card";
import { WebhookError } from "@/models/webhook";
import { motion } from "framer-motion";
import { forwardRef, ForwardedRef } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsSectionProps extends React.HTMLAttributes<HTMLElement> {}

const mockWebhookErrors: WebhookError[] = [
  {
    eventId: "evt_1",
    type: "subscription.created",
    created: 1672531200, // Unix timestamp for 2023-01-01
    failedWebhooks: 2,
    userWebhookEvent: {
      id: "uw_1",
      userId: "user_1",
      eventId: "evt_1",
      livemode: false,
      type: "subscription.created",
      created: 1672531200,
      pendingWebhooks: 1,
      connected: true,
      succeeded: false,
      requestId: "req_1",
      requestIdempotencyKey: "key_1",
      userNotifiedAt: new Date("2023-01-02T00:00:00Z"),
      createdAt: new Date("2023-01-01T12:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
      resolvedAt: null,
    },
  },
  {
    eventId: "evt_2",
    type: "invoice.payment_failed",
    created: 1672617600, // Unix timestamp for 2023-01-02
    failedWebhooks: 3,
    userWebhookEvent: {
      id: "uw_2",
      userId: "user_2",
      eventId: "evt_2",
      livemode: true,
      type: "invoice.payment_failed",
      created: 1672617600,
      pendingWebhooks: 2,
      connected: false,
      succeeded: false,
      requestId: "req_2",
      requestIdempotencyKey: "key_2",
      userNotifiedAt: null,
      createdAt: new Date("2023-01-02T12:00:00Z"),
      updatedAt: new Date("2023-01-03T00:00:00Z"),
      resolvedAt: new Date("2023-01-04T00:00:00Z"),
    },
  },
  {
    eventId: "evt_3",
    type: "customer.updated",
    created: 1672704000, // Unix timestamp for 2023-01-03
    failedWebhooks: 0,
    userWebhookEvent: {
      id: "uw_3",
      userId: "user_3",
      eventId: "evt_3",
      livemode: false,
      type: "customer.updated",
      created: 1672704000,
      pendingWebhooks: 0,
      connected: true,
      succeeded: true,
      requestId: "req_3",
      requestIdempotencyKey: "key_3",
      userNotifiedAt: new Date("2023-01-03T12:00:00Z"),
      createdAt: new Date("2023-01-03T12:00:00Z"),
      updatedAt: new Date("2023-01-03T12:00:00Z"),
      resolvedAt: new Date("2023-01-03T12:00:00Z"),
    },
  },
];

const successVsFailureData = [
  { name: "Success", value: 85, color: "#10B981" },
  { name: "Failure", value: 15, color: "#EF4444" },
];

const eventVolumeData = [
  { date: "Mon", events: 120 },
  { date: "Tue", events: 180 },
  { date: "Wed", events: 150 },
  { date: "Thu", events: 210 },
  { date: "Fri", events: 190 },
  { date: "Sat", events: 140 },
  { date: "Sun", events: 130 },
];

const failureReasonsData = [
  { reason: "Timeout", count: 45 },
  { reason: "Invalid Key", count: 28 },
  { reason: "Server Error", count: 15 },
  { reason: "Network", count: 12 },
];

const eventTypeData = [
  { type: "payment.success", value: 40, color: "#10B981" },
  { type: "payment.failed", value: 20, color: "#EF4444" },
  { type: "subscription.created", value: 25, color: "#3B82F6" },
  { type: "invoice.paid", value: 15, color: "#F59E0B" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
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

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex items-center justify-start md:justify-center space-x-4 overflow-x-auto">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span
            className="text-xs text-muted-foreground"
            style={{ color: entry.color }}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const AnalyticsSection = forwardRef<HTMLElement, AnalyticsSectionProps>(
  (_, ref: ForwardedRef<HTMLElement>) => {
    return (
      <section id="analytics" className="py-24" ref={ref}>
        <div className="container px-4 mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
              Real-Time Analytics Dashboard
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
              Monitor your webhook performance with interactive charts and
              real-time data visualization.
            </p>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2">
            <FadeIn delay={0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Success vs Failure Rates
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={successVsFailureData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        cornerRadius={4}
                        stroke="none"
                      >
                        {successVsFailureData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} opacity={0.9} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Event Volume Over Time
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
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="events"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="url(#eventGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <WebhookErrorsCard
                  className="!h-full !max-h-[394px]"
                  errors={mockWebhookErrors}
                  loading={false}
                  onErrorClick={() => {}}
                  onResolve={() => {}}
                />
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Event Type Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        cornerRadius={4}
                        paddingAngle={1}
                        stroke="none"
                      >
                        {eventTypeData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} opacity={0.9} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        payload={eventTypeData.map(entry => ({
                          value: entry.type,
                          type: "circle",
                          color: entry.color,
                        }))}
                        content={<CustomLegend />}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>
    );
  },
);

AnalyticsSection.displayName = "AnalyticsSection";
