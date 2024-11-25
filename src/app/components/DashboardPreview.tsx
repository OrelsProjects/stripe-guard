"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { name: "Jan", errors: 4, subscriptionIssues: 2 },
  { name: "Feb", errors: 3, subscriptionIssues: 1 },
  { name: "Mar", errors: 2, subscriptionIssues: 3 },
  { name: "Apr", errors: 5, subscriptionIssues: 2 },
  { name: "May", errors: 1, subscriptionIssues: 0 },
  { name: "Jun", errors: 0, subscriptionIssues: 1 },
];

export default function DashboardPreview() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Dashboard Preview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Errors Overview</CardTitle>
              <CardDescription>
                Monthly breakdown of payment errors and subscription issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  errors: {
                    label: "Payment Errors",
                    color: "hsl(var(--chart-1))",
                  },
                  subscriptionIssues: {
                    label: "Subscription Issues",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="errors"
                      stroke="var(--color-errors)"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="subscriptionIssues"
                      stroke="var(--color-subscriptionIssues)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current status of your payment system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-500 mb-4">
                    All Systems Operational
                  </div>
                  <p className="text-xl text-muted-foreground">
                    Your payment system is running smoothly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
