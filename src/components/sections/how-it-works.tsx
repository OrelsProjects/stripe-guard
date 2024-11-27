"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Plug, Search, Zap } from "lucide-react";

const steps = [
  {
    icon: Plug,
    title: "Connect Your Account",
    description:
      "Securely connect your Stripe account with OAuth authentication.",
  },
  {
    icon: Search,
    title: "Monitor Events",
    description:
      "We automatically track all webhook events and identify failures.",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description: "Receive real-time notifications when issues are detected.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Simple setup process with zero disruption to your existing webhook
            infrastructure.
          </p>
        </FadeIn>

        <div className="grid gap-12 md:grid-cols-3 mb-16">
          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.1}>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/10"
                >
                  <step.icon className="w-8 h-8 text-primary" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="gap-2">
                Start Monitoring Now <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold mb-4">Authenticate with Stripe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Seamlessly connect your Stripe account with just a few clicks. Our secure OAuth authentication ensures your data is protected.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="gap-2">
                Connect with Stripe <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
