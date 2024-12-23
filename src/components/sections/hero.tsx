"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { NotificationComponent } from "@/components/sections/notification";
import { FlipWords } from "@/components/ui/flipWords";

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
  const [webhookErrors] = useState<string[]>([
    "Failed Payment",
    // "Card Declined",
    // "Insufficient Funds",
    // "Expired Card",
    // "Incorrect CVC",
    // "Processing Error",
    // "Fraudulent",
    // "Payment Intent Failed",
    // "Chargeback",
    // "Dispute",
  ]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start bg-background pt-20 sm:pt-10 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary backdrop-blur-sm px-3 py-1 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_3px_hsl(var(--primary))]"></div>
                <p>Never lose revenue again</p>
              </div>
            </div>
            {/* Main heading */}
            <FadeIn direction="up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-wide text-foreground">
                <p>Never Miss</p>
                <motion.span className="text-primary inline-block">
                  <div>
                    <FlipWords words={webhookErrors} delay={2.5} />
                  </div>
                </motion.span>
                <p>Again</p>
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
            <FadeIn
              direction="up"
              delay={0.3}
              className="hidden flex-row gap-0 justify-center xl:flex"
            >
              <div className="relative w-[412px] h-[295px]">
                <svg
                  width="412"
                  height="295"
                  viewBox="0 0 412 295"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute z-10"
                >
                  <motion.path
                    id="path-left"
                    d="M0.5 1.5H23C34.0457 1.5 43 10.4543 43 21.5V182C43 193.046 51.9543 202 63 202H387.5C398.546 202 410.5 210.954 410.5 222V295M0.5 74H24.5C34.7173 74 43 82.2827 43 92.5"
                    stroke="url(#paint0_linear_0_54)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, pathOffset: 1 }}
                    animate={{ pathLength: 1, pathOffset: 0 }}
                    transition={{
                      duration: 2, // Duration for the animation
                      ease: "easeInOut", // Smoothing effect
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_0_54"
                      x1="410.003"
                      y1="290"
                      x2="10.6043"
                      y2="45.6676"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0.0645857"
                        stop-color="#2563EB"
                        stop-opacity="0.05"
                      />
                      <stop offset="0.547993" stop-color="#2563EB" />
                      <stop
                        offset="1"
                        stop-color="#2563EB"
                        stop-opacity="0.015"
                      />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex justify-end items-center left-[calc(43px-45.6px-15.7rem)] top-[calc(92.5px-24px)] w-64 h-[10px]">
                  <NotificationComponent
                    type="failed"
                    message="Failed Payment"
                    subtext="Invoice Failed Payment"
                    time="2m ago"
                  />
                </div>
                <div className="absolute flex justify-end items-center left-[calc(43px-45.6px-15.7rem)] top-[calc(92.5px-94px)] w-68 h-[10px]">
                  <NotificationComponent
                    type="retry"
                    message="Retry Attempted"
                    subtext="Webhook failed"
                    time="2m ago"
                  />
                </div>
              </div>
              <div className="relative w-[412px] h-[295px]">
                <svg
                  width="414"
                  height="295"
                  viewBox="0 0 414 295"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    id="path-right"
                    initial={{ pathLength: 0, pathOffset: 1 }}
                    animate={{ pathLength: 1, pathOffset: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d="M414 1.5H391.5C380.454 1.5 371.5 10.4543 371.5 21.5V182C371.5 193.046 362.546 202 351.5 202H27C15.9543 202 1.5 210.954 1.5 222V295M414 74H390C379.783 74 371.5 82.2827 371.5 92.5"
                    stroke="url(#paint0_linear_0_55)"
                    stroke-width="2"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_0_55"
                      x1="1.99999"
                      y1="290"
                      x2="402.5"
                      y2="43.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0.0645857"
                        stop-color="#2563EB"
                        stop-opacity="0.05"
                      />
                      <stop offset="0.547993" stop-color="#2563EB" />
                      <stop
                        offset="1"
                        stop-color="#2563EB"
                        stop-opacity="0.015"
                      />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute flex justify-end items-center right-[calc(43px-45.6px-15.7rem)] top-[calc(92.5px-24px)] w-64 h-[10px]">
                  <NotificationComponent
                    type="failed"
                    message="Failed Payment"
                    subtext="Invoice Failed Payment"
                    time="2m ago"
                  />
                </div>
                <div className="absolute flex justify-end items-center right-[calc(43px-45.6px-15.7rem)] top-[calc(92.5px-94px)] w-68 h-[10px]">
                  <NotificationComponent
                    type="retry"
                    message="Retry Attempted"
                    subtext="Webhook failed"
                    time="2m ago"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Logo at bottom */}
      <Logo className="hidden md:flex" />
    </section>
  );
}
