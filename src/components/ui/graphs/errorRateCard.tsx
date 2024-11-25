import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ErrorRateCard() {
  const [percentage, setPercentage] = useState(0);
  const targetPercentage = 2.8;
  const previousPercentage = 3.2;
  const improvement = ((previousPercentage - targetPercentage) / previousPercentage) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPercentage(targetPercentage);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const severity = percentage < 2 ? "low" : percentage < 5 ? "medium" : "high";

  const severityConfig = {
    low: {
      color: "bg-green-500",
      text: "Healthy",
      description: "Error rate is within acceptable range",
    },
    medium: {
      color: "bg-yellow-300",
      text: "Elevated",
      description: "Error rate requires attention",
    },
    high: {
      color: "bg-red-500",
      text: "Critical",
      description: "Immediate action required",
    },
  }[severity];

  return (
    <Card className="p-6 bg-background/5 backdrop-blur supports-[backdrop-filter]:bg-background/5 border-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Current Error Rate</h3>
          <Badge
            variant="outline"
            className={`${severityConfig.color} bg-opacity-20 border-opacity-30 text-background`}
          >
            {severityConfig.text}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <motion.div
              className="text-5xl font-bold text-white tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {percentage.toFixed(1)}%
            </motion.div>
            <div className="flex items-center gap-2">
              {improvement > 0 ? (
                <TrendingDown className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm ${
                  improvement > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(improvement).toFixed(1)}% vs last month
              </span>
            </div>
          </div>

          <div className="relative">
            <motion.div
              className={`w-20 h-20 rounded-full ${severityConfig.color} opacity-20`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <AlertTriangle className={`w-10 h-10 text-yellow-300`} />
            </motion.div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>0%</span>
            <span>5%</span>
            <span>10%</span>
          </div>
          <motion.div
            className="h-2 bg-muted rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className={`h-full ${severityConfig.color}`}
              initial={{ width: "0%" }}
              animate={{ width: `${(percentage / 10) * 100}%` }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.div>
          <p className="text-sm text-muted-foreground mt-2">
            {severityConfig.description}
          </p>
        </div>
      </motion.div>
    </Card>
  );
}