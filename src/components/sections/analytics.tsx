"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Card } from "@/components/ui/card";
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
                <Card className="p-6">
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
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                        opacity={0.9}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
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
                        paddingAngle={8}
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
