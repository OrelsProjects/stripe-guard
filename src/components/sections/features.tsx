"use client"

import { FadeIn } from "@/components/animations/fade-in"
import { motion } from "framer-motion"
import { AlertCircle, Bell, Gauge, Shield } from "lucide-react"

const features = [
  {
    icon: AlertCircle,
    title: "Real-Time Monitoring",
    description: "Track webhook events and detect failures instantly with our advanced monitoring system.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Get alerted via email, Slack, or SMS the moment a webhook failure occurs.",
  },
  {
    icon: Gauge,
    title: "Performance Analytics",
    description: "Comprehensive dashboard with insights into webhook performance and failure patterns.",
  },
  {
    icon: Shield,
    title: "Secure Integration",
    description: "Enterprise-grade security with encrypted connections and data protection.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Powerful Features for Payment Reliability
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Everything you need to ensure your payment system runs smoothly and efficiently.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <motion.div
                className="p-6 bg-background rounded-xl shadow-sm"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-block p-3 mb-4 rounded-lg bg-primary/10"
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}