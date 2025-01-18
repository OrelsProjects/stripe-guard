"use client";

import { useState } from "react";
import { AlertTriangle, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import FeatureSection from "@/components/ui/feature-section";
import PricingSubscription from "@/components/sections/pricing-subscription";
import { CostSection } from "@/components/sections/cost-section";

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

      {/* Cost Section */}
      <CostSection />

      <motion.section
        className="w-full min-h-screen flex flex-col justify-start items-center gap-12 bg-background py-12 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h3 className="text-pink-400 absolute top-4 text-sm sm:text-lg font-semibold">
          The right way to go...
        </h3>
        <motion.h2
          className="text-3xl sm:text-6xl font-bold mb-4 bg-gradient-to-r flex items-center gap-2"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
        >
          A peak into your dashboard
        </motion.h2>
        <motion.div className="container flex flex-col">
          <FeatureSection
            src="/landing/graphs/graph-average-time-to-complete.png"
            title="Webhook completion time insights"
            description="Gain insights into the average time it takes for your webhooks to complete. Identify slow-performing webhooks and optimize processing to improve overall efficiency."
            direction="ltr"
          />
          <FeatureSection
            src="/landing/graphs/graph-webhooks-sent-over-time.png"
            title="Webhook activity trends"
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

      <section className="relative w-full max-h-screen flex flex-col justify-start items-center gap-4 md:gap-16 bg-foreground/15 pt-16">
        <h2 className="w-full text-3xl sm:text-6xl font-bold tracking-tight text-center">
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
                className="!relative !h-[12rem] !w-[16rem] md:!h-[26rem] md:!w-[40rem]"
              />
            ),
          }))}
        />
      </section>

      <PricingSubscription className="mx-auto max-w-7xl" />

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
