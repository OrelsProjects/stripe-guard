import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

const data = [
  { name: "Card Declined", value: 45, color: "hsl(var(--chart-1))", trend: -5 },
  { name: "Insufficient Funds", value: 30, color: "hsl(var(--chart-2))", trend: +2 },
  { name: "Expired Card", value: 15, color: "hsl(var(--chart-3))", trend: -3 },
  { name: "Fraudulent", value: 8, color: "hsl(var(--chart-4))", trend: +1 },
  { name: "Other", value: 2, color: "hsl(var(--chart-5))", trend: 0 },
];

export function ErrorDistributionChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card className="p-6 bg-background/5 backdrop-blur supports-[backdrop-filter]:bg-background/5 border-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-white"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Error Distribution</h3>
          <Badge variant="outline" className="bg-primary/10">
            Last 30 days
          </Badge>
        </div>

        <div className="relative h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={isHovered ? 85 : 80}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={(_, index) => {
                  setActiveIndex(index);
                  setIsHovered(true);
                }}
                onMouseLeave={() => {
                  setActiveIndex(null);
                  setIsHovered(false);
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: `brightness(${activeIndex === index ? 1.2 : 1})`,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background/95 backdrop-blur p-3 rounded-lg border border-border shadow-xl">
                        <p className="font-semibold text-sm">{data.name}</p>
                        <p className="text-xl font-bold text-primary">{data.value}%</p>
                        <div className="flex items-center gap-1 text-sm mt-1">
                          {data.trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : data.trend < 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : null}
                          <span
                            className={
                              data.trend > 0
                                ? "text-green-500"
                                : data.trend < 0
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }
                          >
                            {data.trend > 0 ? "+" : ""}
                            {data.trend}% vs last month
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence>
              {activeIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <motion.p className="text-4xl font-bold text-primary">
                    {data[activeIndex].value}%
                  </motion.p>
                  <motion.p className="text-sm text-muted-foreground">
                    {data[activeIndex].name}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {data.map((entry, index) => (
            <motion.div
              key={entry.name}
              className="flex items-center gap-2 group cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setActiveIndex(index)}
              onHoverEnd={() => setActiveIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                style={{ backgroundColor: entry.color }}
              />
              <div>
                <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                  {entry.name}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({entry.value}%)
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Card>
  );
}