import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingDown, TrendingUp } from "lucide-react";

const data = [
  { date: "Jan", errors: 65, previousErrors: 70, target: 50 },
  { date: "Feb", errors: 45, previousErrors: 55, target: 50 },
  { date: "Mar", errors: 75, previousErrors: 60, target: 50 },
  { date: "Apr", errors: 35, previousErrors: 45, target: 50 },
  { date: "May", errors: 85, previousErrors: 75, target: 50 },
  { date: "Jun", errors: 55, previousErrors: 65, target: 50 },
];

export function ErrorTrendGraph() {
  const [animate, setAnimate] = useState(false);
  const currentMonth = data[data.length - 1];
  const improvement =
    ((currentMonth.previousErrors - currentMonth.errors) / currentMonth.previousErrors) * 100;

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Card className="p-6 bg-background/5 backdrop-blur supports-[backdrop-filter]:bg-background/5 border-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Error Trend</h3>
            <div className="flex items-center gap-2 mt-1">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last 6 months</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {improvement > 0 ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <TrendingDown className="w-4 h-4 mr-1" />
                {improvement.toFixed(1)}% Improvement
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                <TrendingUp className="w-4 h-4 mr-1" />
                {Math.abs(improvement).toFixed(1)}% Increase
              </Badge>
            )}
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <defs>
                <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--muted-foreground))"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--muted-foreground))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                opacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 backdrop-blur p-3 rounded-lg border border-border shadow-xl">
                        <p className="font-semibold mb-2">{payload[0].payload.date}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Current:</span>
                            <span className="font-semibold text-primary">
                              {payload[0].payload.errors}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm text-muted-foreground">Previous:</span>
                            <span className="font-semibold text-muted-foreground">
                              {payload[0].payload.previousErrors}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={50}
                stroke="hsl(var(--primary))"
                strokeDasharray="3 3"
                label={{
                  value: "Target",
                  position: "right",
                  fill: "hsl(var(--primary))",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="previousErrors"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#previousGradient)"
                strokeDasharray="3 3"
              />
              <Area
                type="monotone"
                dataKey="errors"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#errorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Current Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground opacity-50" />
              <span className="text-sm text-muted-foreground">Previous Period</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-dashed border-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Target (50)</span>
          </div>
        </div>
      </motion.div>
    </Card>
  );
}