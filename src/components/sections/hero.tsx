"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

// Overview component for displaying the product explanation
function ProductOverview() {
  return (
    <section className="py-10 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Never Miss a Failed Stripe Payment Again
          </h2>
          <p className="text-lg">
            Introducing your ultimate tool for monitoring Stripe webhook
            failures. Get instant alerts for missed payments and take control of
            your payment operations. Stay ahead of issues, safeguard your
            revenue, and ensure seamless customer experiences.
          </p>
          <ul className="space-y-4 text-left">
            <li>
              <strong className="block font-semibold">
                1. Real-Time Webhook Monitoring
              </strong>
              - Detect and log Stripe webhook failures automatically. - Capture
              critical details like event type, timestamp, failure reason, and
              retry attempts.
            </li>
            <li>
              <strong className="block font-semibold">
                2. Instant Notifications
              </strong>
              - Receive alerts the moment a webhook fails. - Get detailed
              insights, including failure causes and actionable next steps. -
              Stay informed through your preferred channels—email, Slack, or
              SMS.
            </li>
            <li>
              <strong className="block font-semibold">
                3. Insightful Dashboard
              </strong>
              - View comprehensive webhook logs in a user-friendly interface. -
              Track metrics such as failure counts, resolutions, and recurring
              issues.
            </li>
            <li>
              <strong className="block font-semibold">
                4. Custom Alert Configurations
              </strong>
              - Tailor notifications to match your workflow. - Set preferences
              for alert types, delivery channels, and urgency levels. - Empower
              your team to act swiftly on critical failures.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

interface Error {
  title: string;
  type: string;
  iconColor: string;
  details: string;
  timestamp: string;
  customer: string;
  paymentMethod: string;
  invoiceId: string;
  amount: string;
}

function ShowMoreSection({ error }: { error: Error | null }) {
  const [showMore, setShowMore] = useState(false);

  const variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  return (
    <div>
      <Button
        variant="link"
        size="sm"
        className="flex items-center space-x-2 text-muted-foreground !p-0 hover:no-underline"
        onClick={() => setShowMore(!showMore)}
      >
        <span>{showMore ? "Show Less" : "Show More"}</span>
        {showMore ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      <motion.div
        initial="hidden"
        animate={showMore ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-4 space-y-2">
          <p>
            <strong className="text-muted-foreground">Customer:</strong>{" "}
            {error?.customer}
          </p>
          <p>
            <strong className="text-muted-foreground">Amount:</strong>{" "}
            {error?.amount}
          </p>
          <p>
            <strong className="text-muted-foreground">Payment Method:</strong>{" "}
            {error?.paymentMethod}
          </p>
          <p>
            <strong className="text-muted-foreground">Invoice ID:</strong>{" "}
            {error?.invoiceId}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start bg-background pt-20 sm:pt-40 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary backdrop-blur-sm px-3 py-1 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_3px_hsl(var(--primary))]"></div>
                <p>Never lose revenue again</p>
              </div>
            </div>
            {/* Main heading */}
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-wide text-foreground">
                Never Miss a{" "}
                <motion.span
                  className="text-primary inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Failed Payment
                </motion.span>{" "}
                Again
              </h1>
            </FadeIn>

            {/* Description */}
            <FadeIn direction="up" delay={0.1}>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Monitor your webhooks effortlessly, get instant notifications on
                failures, and maintain smooth payment operations. Keep your
                revenue flowing without interruption.
              </p>
            </FadeIn>

            {/* CTA Buttons */}
            <FadeIn direction="up" delay={0.2}>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  asChild
                >
                  <Link href="/login">Start Monitoring now</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border border-foreground text-foreground px-8"
                  asChild
                >
                  <Link href="/blog">Learn more</Link>
                </Button>
              </div>
            </FadeIn>

            {/* Connected Line Effect */}
            <FadeIn direction="up" delay={0.3}>
              <div className="relative mt-8 h-20 flex justify-center">
                <svg
                  className="absolute w-full h-full"
                  viewBox="0 0 400 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 0 Q200 50 300 0 T500 0"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Logo at bottom */}
      <Logo />
    </section>
  );
}
