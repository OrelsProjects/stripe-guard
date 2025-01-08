"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowDown,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { AnimatedText } from "@/components/ui/animated-text";
import { EventTracker } from "@/eventTracker";
import { cn } from "@/lib/utils";

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

const FlowItem = ({
  icon: Icon,
  title,
  delay,
  textColor = "text-foreground",
  iconBg = "bg-background/10",
  iconColor = "text-foreground",
  borderColor = "border-border",
}: {
  icon: any;
  title: string;
  delay: number;
  textColor?: string;
  iconBg?: string;
  iconColor?: string;
  borderColor?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, scale: 0.85 },
      visible: {
        opacity: 1,
        scale: [0.85, 0.85, 1],
        transition: {
          duration: 0.7,
          delay,
          ease: "easeInOut",
        },
      },
    }}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className={`relative flex items-center gap-4 px-2 py-2 rounded-2xl w-full max-w-2xl shadow-sm z-20 bg-background/5 backdrop-blur-sm border ${borderColor}`}
  >
    <div className={`shrink-0 mt-1`}>
      {typeof Icon === "function" ? (
        <Icon className={`w-8 h-8 ${iconColor}`} />
      ) : (
        Icon
      )}
    </div>
    <h3
      className={cn(
        "2xl:absolute w-full font-bold text-base md:text-xl text-center",
        textColor,
      )}
    >
      {title}
    </h3>
  </motion.div>
);

const ConnectorLine = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    className="h-24 relative z-10"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay }}
  >
    <motion.svg
      // slowly build the line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay }}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 800 800"
      className="h-24 md:h-36 absolute -top-3.5 left-1/2 -translate-x-1/2"
    >
      <g
        strokeWidth="20"
        className={color}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="62 62"
        transform="rotate(45, 400, 400)"
      >
        <line x1="167.5" y1="167.5" x2="570.5" y2="570.5" />
      </g>
    </motion.svg>
  </motion.div>
);

export function HeroSection() {
  const handleCTAClick = () => {
    EventTracker.track("hero_cta_clicked", {
      location: "hero_section",
      button_text: "Get Started",
    });
  };

  return (
    <section className="container mx-auto flex flex-col lg:flex-row items-start justify-center gap-16 lg:gap-16 px-8 py-12 lg:py-32">
      <div className="container px-4 relative z-10">
        <div className="text-center">
          <div className="space-y-10 lg:space-y-12 text-start">
            {/* Main heading */}
            <div className="!w-fit text-center lg:text-left">
              <motion.h1 className="font-medium text-4xl lg:text-6xl tracking-tight text-foreground">
                Don&apos;t let a{" "}
                <strong className="italic font-black">failed webhook</strong>{" "}
                <br />
                cost you a{" "}
                <strong className="font-black text-primary">customer</strong>
              </motion.h1>
            </div>

            {/* Description */}
            <div className="!w-fit">
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Missed payments can hurt your revenue and customer experience.
                Monitor your Stripe webhooks seamlessly, fix issues instantly,
                and keep your business running smoothly.
              </p>

              {/* Benefits list */}
              <div className="mt-6 space-y-2 text-start">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-green-500 shrink-0"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    />
                  </svg>
                  <span>1-minute setup with your Stripe account</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-green-500 shrink-0"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    />
                  </svg>
                  <span>Save an average of $50 per avoided churn</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-green-500 shrink-0"
                  >
                    <path
                      fill="currentColor"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                    />
                  </svg>
                  <span>Avoid losing customers over failed webhooks</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="!w-fit">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="xl" asChild onClick={handleCTAClick}>
                  <Link href="/login">
                    Protect your webhooks now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flow diagram */}
      <motion.div className="w-full flex flex-col items-center justify-center gap-1">
        <FlowItem
          icon={() => <AlertTriangle className="w-10 h-10 text-destructive" />}
          title="One of your webhooks fails"
          delay={0}
          textColor="text-destructive"
          iconBg="bg-destructive/10"
          iconColor="text-destructive"
          borderColor="border-destructive/20"
        />
        <ConnectorLine delay={1.5} color="stroke-destructive/20" />
        <FlowItem
          icon={() => <Logo withText={false} imageClassName="w-12 h-12" />}
          title="Sends alert to your email + warm email to your customer"
          delay={1.5}
          textColor="text-primary"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          borderColor="border-primary/20"
        />
        <ConnectorLine delay={3} color="stroke-primary/20" />
        <FlowItem
          icon={() => (
            <img
              src="/stripe-square.jpg"
              alt="Stripe"
              className="w-11 h-11 object-contain rounded"
            />
          )}
          title="Churn avoided = Customer saved 🥳"
          delay={3}
          textColor="text-foreground"
          iconBg="bg-background/10"
          iconColor="text-foreground"
          borderColor="border-border/40"
        />
      </motion.div>
    </section>
  );
}
