"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Logo from "@/components/ui/Logo";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  DollarSign,
  Gauge,
  Shield,
  UserX,
} from "lucide-react";

const MotionCard = motion(Card);

const features = [
  {
    icon: Bell,
    title: "Instant notifications",
    description:
      "Get alerted via email the moment a critical webhook failure occurs.",
  },
  {
    icon: AlertCircle,
    title: "Customer-friendly error handling",
    description:
      "Keep users informed with a friendly email and a proactive update when a failure is detected.",
  },
  // {
  //   icon: Gauge,
  //   title: "Performance analytics",
  //   description:
  //     "Comprehensive dashboard with insights into webhook performance and failure patterns.",
  // },
  // {
  //   icon: Shield,
  //   title: "Secure Integration",
  //   description: "Enterprise-grade security with encrypted connections and data protection.",
  // },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2>Powerful features for payment reliability</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Everything you need to ensure your payment system runs smoothly and
            efficiently.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FadeIn key={"the-smart-investment"} delay={0.1}>
            <motion.div
              className="p-6 bg-background rounded-xl shadow-md hover:shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-block p-3 mb-4 rounded-lg bg-primary/10"
              >
                <Logo withText={false} imageClassName="w-8 h-8" />
              </motion.div>
              <h3 className="mb-2 text-xl font-semibold pointer-events-none">
                The smart investment
              </h3>
              <p className="text-muted-foreground pointer-events-none">
                Invest $0.44 to protect 200 webhooks and secure a $50 customer.
                <strong>That&apos;s a 113x return on your investment.</strong>
              </p>
            </motion.div>
          </FadeIn>
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <motion.div
                className="p-6 bg-background rounded-xl shadow-md hover:shadow-lg"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-block p-3 mb-4 rounded-lg bg-primary/10"
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold pointer-events-none">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground pointer-events-none">
                  {feature.description}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
