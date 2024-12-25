"use client";

import {
  Check,
  X,
  Clock,
  PenToolIcon as Tool,
  Zap,
  DollarSign,
  CoffeeIcon,
  HeartPulseIcon,
  UserMinus,
  Repeat,
} from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const comparisonData = [
  {
    task: "Creating complex webhook flows and dashboards",
    withoutStripeProtect: 1500,
    withStripeProtect: 0,
    timeIndication: "3 days",
    icon: (
      <Tool className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
  {
    task: "Developing new features (per feature)",
    withoutStripeProtect: 500,
    withStripeProtect: 0,
    timeIndication: "1 day",
    icon: (
      <Zap className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
  {
    task: "Pinpointing failed webhooks",
    withoutStripeProtect: 125,
    withStripeProtect: 0,
    timeIndication: "2 hours",
    icon: (
      <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
  {
    task: "Bug fixing and maintenance",
    withoutStripeProtect: "more than you think",
    withStripeProtect: 0,
    icon: (
      <Tool className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
  {
    task: "Frustrated customers",
    withoutStripeProtect: "a lot",
    withStripeProtect: "a little",
    icon: (
      <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
  {
    task: "Retraining new developers",
    withoutStripeProtect: "expensive and slow",
    withStripeProtect: "tokens are forever",
    timeIndication: "Weeks",
    icon: (
      <Repeat className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
  {
    task: "Handling webhook issues stress-free",
    withoutStripeProtect: "High stress and manual fixes",
    withStripeProtect: "Automated alerts and customer assurance",
    icon: (
      <HeartPulseIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
  {
    task: "Buying tokens to protect webhooks",
    withoutStripeProtect: 0,
    withStripeProtect: "a few bucks",
    icon: (
      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground" />
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
    viewport: { once: true },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
    viewport: { once: true },
  },
};

export default function ComparisonSection() {
  return (
    <section className="py-16 sm:py-24 md:py-32 lg:py-40 bg-gradient-to-b from-primary/20 via-primary/0 to-primary/0">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 space-y-4 sm:space-y-6">
          <motion.span
            className="text-sm sm:text-base md:text-lg uppercase tracking-wider text-muted-foreground"
            variants={itemVariants}
          >
            Compare & Conquer
          </motion.span>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground"
            variants={itemVariants}
          >
            Stop Bleeding Money—
            <br className="hidden sm:block" />
            Start Growing Your Profits
          </motion.h2>
        </div>

        <motion.div
          className="overflow-x-auto mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          variants={itemVariants}
        >
          <table className="w-full text-left border-collapse bg-foreground/5 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-primary/10">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground">
                  Task
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground text-center">
                  Traditional Approach
                </th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground text-center">
                  With {appName}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((item, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-muted-foreground/20 hover:bg-background/10 transition-colors duration-200"
                  variants={itemVariants}
                >
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground">
                    {item.icon}
                    {item.task}
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 font-semibold text-foreground text-center text-xs sm:text-sm md:text-base lg:text-lg">
                    {typeof item.withoutStripeProtect === "number"
                      ? `$${item.withoutStripeProtect}`
                      : item.withoutStripeProtect}
                    {item.timeIndication && <span className="text-xs text-muted-foreground">
                      {" "}
                      ({item.timeIndication})
                    </span>}
                  </td>
                  <td className="px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 font-semibold text-foreground text-center text-xs sm:text-sm md:text-base lg:text-lg">
                    {typeof item.withStripeProtect === "number"
                      ? `$${item.withStripeProtect}`
                      : item.withStripeProtect}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <motion.p
            className="w-full text-xs text-start sm:text-xs md:text-sm text-muted-foreground/60 pl-2 mt-2"
            variants={itemVariants}
          >
            Based on industry standards of average senior developer salary in
            the US
          </motion.p>
        </motion.div>

        <motion.div
          className="text-center space-y-6 sm:space-y-8 md:space-y-10"
          variants={itemVariants}
        >
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight font-semibold text-secondary dark:text-foreground">
            Secure Your Revenue Now
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 text-base sm:text-lg md:text-xl lg:text-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link href="/login">Get started</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
