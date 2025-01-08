"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  PenTool,
  HeartPulse,
  DollarSign,
  Shield,
  HeartPulseIcon,
  Repeat,
  Hammer,
  Wrench,
  X,
} from "lucide-react";

const comparisonData = [
  {
    task: "Building complex webhook workflows",
    withoutStripeProtect: "$1,500",
    withStripeProtect: "$0",
    timeIndication: "3 days",
    impact: "high",
    tooltip: "Time spent building webhook workflows",
    icon: <Hammer className="h-6 w-6" />,
  },
  {
    task: "Developing additional features (per feature)",
    withoutStripeProtect: "$500",
    withStripeProtect: "$0",
    timeIndication: "1 day",
    icon: <Zap className="h-6 w-6" />,
    impact: "high",
    tooltip: "Cost of developing additional features",
  },
  {
    task: "Finding failed webhooks",
    withoutStripeProtect: "$125",
    withStripeProtect: "$0",
    timeIndication: "2 hours",
    icon: <Clock className="h-6 w-6" />,
    impact: "high",
    tooltip: "Time spent finding failed webhooks",
  },
  {
    task: "Ongoing bug fixes and maintenance",
    withoutStripeProtect: "Overwhelming costs",
    withStripeProtect: "$0",
    icon: <Wrench className="h-6 w-6" />,
    impact: "high",
    tooltip: "Ongoing bug fixes and maintenance",
  },
  {
    task: "Customer frustration",
    withoutStripeProtect: "High",
    withStripeProtect: "Minimal",
    icon: <X className="h-6 w-6" />,
    impact: "high",
    tooltip: "Customer frustration",
  },
  {
    task: "Training new developers",
    withoutStripeProtect: "Costly and time-consuming",
    withStripeProtect: "Effortless",
    timeIndication: "Weeks",
    icon: <Repeat className="h-6 w-6" />,
    impact: "high",
    tooltip: "Training new developers",
  },
  {
    task: "Handling webhook issues",
    withoutStripeProtect: "Manual fixes and stress",
    withStripeProtect: "Automated alerts",
    icon: <HeartPulseIcon className="h-6 w-6" />,
    impact: "high",
    tooltip: "Handling webhook issues",
  },
  {
    task: "Protecting webhooks with tokens",
    withoutStripeProtect: "$0",
    withStripeProtect: "Affordable",
    icon: <DollarSign className="h-6 w-6" />,
    impact: "high",
    tooltip: "Protecting webhooks with tokens",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

export default function ComparisonSection() {
  return (
    <section className="py-24">
      <motion.div
        className="container mx-auto px-4 max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="text-center mb-16 text-card">
          <motion.h2
            className="text-card"
            variants={itemVariants}
          >
            The real cost of webhook failures
          </motion.h2>
          <motion.p
            className="text-lg text-muted max-w-3xl mx-auto"
            variants={itemVariants}
          >
            See how much you're really losing from unreliable webhook management
          </motion.p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-card shadow-xl rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-primary/10">
                <th className="px-6 py-4 text-left text-lg font-semibold">
                  Metric
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold">
                  Without Protection
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold">
                  With Our Service
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <motion.tr
                  key={index}
                  className={`
                    border-b border-border/50 hover:bg-muted/50 transition-colors
                    ${item.impact === "critical" ? "bg-destructive/5" : ""}
                    ${item.impact === "high" ? "bg-warning/5" : ""}
                  `}
                  variants={itemVariants}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        p-2 rounded-lg
                        ${item.impact === "critical" ? "bg-destructive/10" : ""}
                        ${item.impact === "high" ? "bg-warning/10" : ""}
                        ${item.impact === "medium" ? "bg-primary/10" : ""}
                      `}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium">{item.task}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.tooltip}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-green-500">
                    {item.withStripeProtect}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-destructive">
                    {item.withoutStripeProtect}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.div
          className="mt-0 text-sm text-muted/80 text-start"
          variants={itemVariants}
        >
          *Data reflects industry averages for senior developer rates and time
          savings.
        </motion.div>
      </motion.div>
    </section>
  );
}
