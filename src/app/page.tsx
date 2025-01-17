"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Clock,
  Code2,
  Database,
  History,
  LineChart,
  Search,
  Settings,
  Shield,
  Webhook,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import CostComparison from "@/components/sections/cost-comparison";
import FeatureSection from "@/components/ui/feature-section";

const pricingTiers = [
  {
    name: "Totally free",
    price: "$0",
    priceYearly: "$0",
    description: "Just starting to Stripe? No cost, no frills, no judgment.",

    features: [
      "Monitor up to 1,000 webhooks/month",
      "Real-time alerts",
      "Webhook event history (1 year)",
      "Basic dashboard access",
    ],
    popular: true,
  },
  {
    name: "Casual Striper",
    price: "$13",
    priceYearly: "$9",
    description: "You Stripe on the side, but still need solid support.",
    features: [
      "Monitor 30,000 webhooks/month",
      "Real-time failure alerts",
      "Webhook event history (7 years)",
      "Priority support",
      "Custom alert rules (coming soon)",
    ],
  },
  {
    name: "Professional Striper",
    price: "$27",
    priceYearly: "$19",
    description: "Striping pays the bills, and you can’t afford mistakes.",
    features: [
      "Monitor unlimited webhooks",
      "Real-time failure alerts",
      "Webhook event history (forever)",
      "Priority support",
      "Custom alert rules (coming soon)",
    ],
  },
];

const features = [
  {
    icon: Clock,
    title: "Webhook Event History",
    description:
      "Access a complete history of webhook events for deeper insights.",
  },
  {
    icon: Bell,
    title: "Custom Alerts",
    description:
      "Set up personalized notifications for critical webhook events.",
  },
  {
    icon: Code2,
    title: "Seamless Integration",
    description: "Works out of the box with Stripe's ecosystem.",
  },
  {
    icon: LineChart,
    title: "Intuitive Dashboard",
    description:
      "Designed to give you a full view of your webhooks without complexity.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description:
      "Never miss a failed webhook. Get instant alerts to minimize downtime.",
  },
  {
    icon: Database,
    title: "Detailed Insights",
    description:
      "See every webhook event at a glance with clear, actionable data.",
  },
  {
    icon: Shield,
    title: "Simplified Debugging",
    description:
      "Troubleshoot webhook errors effortlessly with rich error logs.",
  },
];

const graphs = [
  {
    title: "Webhook errors history",
    description:
      "A short description of each error, including how many webhooks failed and when.",
    src: "/landing/webhook-errors-error.png",
  },
  {
    title: "Details of the error",
    description:
      "A detailed description of the error, including a direct link to the webhook that failed on Stripe's dashboard.",
    src: "/landing/webhook-errors-dialog.png",
  },
  {
    title: "Webhook on Stripe's dashboard",
    description:
      "By clicking the link, you'll be redirected to Stripe's dashboard where you can see the webhook and the error details.",
    src: "/landing/webhook-errors-stripe.png",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// width 0 to 100%
const transparentTextVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

const imageVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

function App() {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-16 md:px-8 md:pt-24">
        <HeroParallax
          products={[
            {
              title: "Average time to complete",
              link: "",
              thumbnail: "/landing/graphs/graph-average-time-to-complete.png",
            },
            {
              title: "Top failed event types",
              link: "/landing/graphs/graph-top-failures.png",
              thumbnail: "/landing/graphs/graph-top-failures.png",
            },
            {
              title: "Webhooks sent over time",
              link: "",
              thumbnail: "/landing/graphs/graph-webhooks-sent-over-time.png",
            },
            {
              title: "Webhook fails and successes",
              link: "",
              thumbnail: "/landing/graphs/graph-fails-and-successes.png",
            },
            {
              title: "Average time to complete",
              link: "",
              thumbnail: "/landing/graphs/graph-average-time-to-complete.png",
            },
            {
              title: "Webhook monitoring",
              link: "",
              thumbnail: "/landing/graphs/cards-monitor.png",
            },
            {
              title: "Webhook monitoring",
              link: "",
              thumbnail: "/landing/graphs/cards-monitor.png",
            },
            {
              title: "Webhook success rate",
              link: "",
              thumbnail: "/landing/graphs/cards-success-rate.png",
            },
            {
              title: "Average time to complete",
              link: "",
              thumbnail: "/landing/graphs/graph-average-time-to-complete.png",
            },
          ]}
        />
      </section>

      {/* Why it sucks not having a webhook monitor */}
      {/* 1. Having a critical webhook failure can lead to customers churning */}
      {/* 2. Webhooks errors are harder to notice, since they are not part of the main flow */}
      {/* 3. You need to look through a huge loads of logs to find the culprit */}
      {/* How StripeWebhook.com helps */}
      {/* 1. Detailed notifications for every webhook failure */}
      {/* 2. Webhook event history */}
      {/* 3. Custom alert rules */}
      {/* 4. Seamless integration with Stripe's ecosystem */}

      <motion.section
        className="w-full min-h-screen flex flex-col justify-start items-center gap-12 bg-black py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          className="text-6xl font-bold tracking-tight text-center text-foreground"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
        >
          The cost of not having a webhook monitor
        </motion.h2>

        {/* Log Investigation Nightmare */}
        <motion.div className="max-w-5xl mx-auto px-4" variants={itemVariants}>
          <motion.h2
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent flex items-center gap-2"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.div
              className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MagnifyingGlassIcon className="w-8 h-8 text-red-500" />
            </motion.div>
            Logs investigation nightmare
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
          >
            Every minute spent searching through logs for failed webhooks is
            time you don&apos;t ship new features.
          </motion.p>

          <motion.div
            className="relative w-full group"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
            <div className="relative overflow-clip">
              <img
                src="/landing/datadog.png"
                alt="Complex log analysis"
                className="relative rounded-lg border border-zinc-800 w-full shadow-xl"
              />
              <motion.img
                initial={{ opacity: 0, y: 100, x: 60 }}
                variants={{
                  visible: {
                    opacity: 1,
                    y: 40,
                    x: 60,
                  },
                }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileInView="visible"
                viewport={{ once: true }}
                src="/landing/stripe-errors.png"
                alt="Complex log analysis"
                className="absolute bottom-0 right-0 rounded-lg border border-zinc-800 h-36 md:h-64 shadow-xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-base text-muted-foreground italic">
                  "Finding that one failed webhook shouldn't take hours."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Customer Churn Risk */}
        <motion.div className="max-w-5xl mx-auto px-4" variants={itemVariants}>
          <motion.h2
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent flex items-center gap-2"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.div
              className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <XCircle className="w-8 h-8 text-red-500" />
            </motion.div>
            Customer churn risk
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-12"
            variants={itemVariants}
          >
            Every failed webhook is a ticking time bomb for your business. When
            payments fail to process or services don&apos;t activate, customers
            don&apos;t just get frustrated—they leave.
          </motion.p>

          <motion.div
            className="relative w-full group"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
              alt="Frustrated customer experience"
              className="relative rounded-lg border border-zinc-800 w-full shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-base text-muted-foreground italic">
                  "In today's competitive market, a single critical webhook
                  failure can cost you thousands."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Silent Failures */}
        <motion.div className="max-w-5xl mx-auto px-4" variants={itemVariants}>
          <motion.h2
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent flex items-center gap-2"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.div
              className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </motion.div>
            Silent failures
          </motion.h2>
          <motion.p
            className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-12"
            variants={itemVariants}
          >
            The most dangerous failures are the ones you don&apos;t see coming.
            Webhook errors lurk in the shadows of your system, silently
            corrupting your data and breaking critical business flows.
          </motion.p>

          <motion.div
            className="relative w-full group"
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <img
              src="https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80"
              alt="System error visualization"
              className="relative rounded-lg border border-zinc-800 w-full shadow-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-base text-muted-foreground italic">
                  "By the time you notice, the damage is already done."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="w-full min-h-screen flex flex-col justify-start items-center gap-12 bg-background py-12 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-pink-400 absolute top-4 text-lg font-semibold">
          The right way to go...
        </h3>
        <motion.h2
          className="text-5xl font-bold mb-4 bg-gradient-to-r flex items-center gap-2"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
        >
          A peak into your dashboard
        </motion.h2>
        <motion.div className="container flex flex-col">
          <FeatureSection
            src="/landing/graphs/graph-average-time-to-complete.png"
            title="Webhook Completion Time Insights"
            description="Gain insights into the average time it takes for your webhooks to complete. Identify slow-performing webhooks and optimize processing to improve overall efficiency."
            direction="ltr"
          />
          <FeatureSection
            src="/landing/graphs/graph-webhooks-sent-over-time.png"
            title="Webhook Activity Trends"
            description="Visualize the volume of webhooks sent over time to detect peak activity periods and usage patterns. Use this data to better plan resource allocation and ensure system stability during high-traffic times."
            direction="rtl"
          />
          <FeatureSection
            src="/landing/graphs/graph-fails-and-successes.png"
            title="Webhook Success vs. Failure"
            description="Track the success and failure rates of your webhooks to quickly identify issues and improve reliability. Stay informed and proactive in resolving problems to ensure seamless user experiences."
            direction="ltr"
          />
        </motion.div>
      </motion.section>

      <section className="relative w-full max-h-screen flex flex-col justify-start items-center gap-16 bg-foreground/15 pt-16">
        <h2 className="w-full text-5xl font-bold tracking-tight text-center">
          <span className="text-primary">Detailed notifications</span> for every
          webhook failure
        </h2>

        <StickyScroll
          content={graphs.map(graph => ({
            title: graph.title,
            description: graph.description,
            content: (
              <Image
                src={graph.src}
                alt={graph.title}
                fill
                className="!relative !h-[26rem] !w-[40rem]"
              />
            ),
          }))}
        />
      </section>

      {/* Pricing Section */}
      <section className="mx-auto mt-32 max-w-7xl px-6 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Simple,{" "}
            <span className="relative text-background overflow-clip">
              <motion.span
                variants={transparentTextVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute inset-0 bg-foreground/10 z-10 rounded-lg overflow-clip"
              />
              <span className="relative z-20">transparent</span>
            </span>{" "}
            pricing
          </h2>

          <div className="mt-8 flex justify-center gap-4">
            <Button
              variant={selectedPlan === "monthly" ? "default" : "outline"}
              onClick={() => setSelectedPlan("monthly")}
            >
              Monthly billing
            </Button>
            <Button
              variant={selectedPlan === "yearly" ? "default" : "outline"}
              onClick={() => setSelectedPlan("yearly")}
            >
              Yearly billing
              <Badge variant="secondary" className="ml-2">
                Save 30%
              </Badge>
            </Button>
          </div>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Center the card */}
          {pricingTiers.map(tier => (
            <Card
              key={tier.name}
              // make it span over 2 columns
              className={cn(
                "relative p-8",
                tier.popular ? "border-primary border-2" : "",
              )}
            >
              {tier.popular && (
                <Badge className="absolute -top-6 right-4 flex flex-col bg-background border-2 border-primary py-1 px-2 pointer-events-none">
                  <p className="text-primary font-bold text-sm">
                    Just pick this one!
                  </p>
                  <span className="text-xs font-normal">
                    You can upgrade later.
                  </span>
                </Badge>
              )}
              <div className="flex flex-col items-start">
                <h4
                  className="text-2xl font-bold"
                  dangerouslySetInnerHTML={{ __html: tier.name }}
                />
                <p className="text-muted-foreground">{tier.description}</p>
              </div>
              <div className="mt-6">
                <span className="text-4xl font-bold">
                  {selectedPlan === "monthly" ? tier.price : tier.priceYearly}
                </span>
                <span className="text-muted-foreground">
                  {selectedPlan === "monthly" ? "/month" : "/year"}
                </span>
              </div>
              <ul className="mt-8 space-y-4">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-center">
                    <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.name.includes("free") ? (
                <Button className="mt-8 w-full">Get started - free</Button>
              ) : (
                <Button className="mt-8 w-full overflow-clip">
                  <motion.p key="get-started">Get started</motion.p>
                </Button>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto mt-32 max-w-3xl px-6 pb-32 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-16">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How does it integrate with my Stripe account?
            </AccordionTrigger>
            <AccordionContent>
              Integration is simple and secure. Just connect your Stripe account
              through our dashboard, and we&apos;ll automatically start
              monitoring your webhooks. No code changes required.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              What happens if a webhook fails?
            </AccordionTrigger>
            <AccordionContent>
              You&apos;ll receive instant notifications through your preferred
              channels (email, Slack, etc.). Our dashboard provides detailed
              error logs and debugging tools to help you quickly resolve any
              issues.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is my data secure?</AccordionTrigger>
            <AccordionContent>
              Absolutely. We use industry-standard encryption and security
              practices. We never store sensitive payment data, and all webhook
              data is encrypted at rest and in transit.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

export default App;
