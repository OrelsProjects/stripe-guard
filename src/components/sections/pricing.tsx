"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$20",
    description: "Perfect for small businesses",
    features: [
      "1,000 webhook events/month",
      "Email notifications",
      "7-day event history",
      "Basic analytics",
    ],
  },
  {
    name: "Pro",
    price: "$79",
    description: "For growing companies",
    features: [
      "10,000 webhook events/month",
      "Email + Slack notifications(coming soon)",
      "30-day event history",
      "Advanced analytics",
      "Custom alert rules (coming soon)",
      "Priority support",
      "Same price forever",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited webhook events",
      "All notification channels",
      "Unlimited history",
      "Advanced analytics",
      "Custom alert rules (coming soon)",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-48 bg-muted/50">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Choose the plan that best fits your needs. All plans include a
            14-day free trial. Monitor your webhooks effortlessly and get
            instant notifications on failures.
          </p>
        </FadeIn>

        <div id="pricing" className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.1}>
              <motion.div
                className={`h-full p-8 bg-background rounded-xl shadow-sm flex flex-col justify-between ${
                  plan.popular ? "ring-2 ring-primary" : ""
                }`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div>
                  {plan.popular && (
                    <span className="inline-block px-3 py-1 mb-4 text-sm font-medium text-primary bg-primary/10 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    {plan.description}
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="w-full mt-6"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="mailto:orelsmail@gmail.com">
                    {plan.price === "Custom"
                      ? "Contact Us"
                      : "Start Free Trial"}
                  </Link>
                </Button>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
