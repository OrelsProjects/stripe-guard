"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Activity,
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import Link from "next/link";

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
      {/* Show More/Less Button */}
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

      {/* Animated Show More Section */}
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
  const [selectedError, setSelectedError] = useState<Error | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const errors: Error[] = [
    {
      title: "Payment Failed",
      type: "invoice.payment_failed",
      iconColor: "text-red-500",
      details:
        "The payment failed due to insufficient funds. Ensure the customer has enough balance and try again.",
      timestamp: "2m ago",
      customer: "John Doe",
      amount: "$120.00",
      paymentMethod: "Visa **** 4242",
      invoiceId: "INV-00123",
    },
    {
      title: "Retry Attempted",
      type: "charge.failed",
      iconColor: "text-yellow-500",
      details:
        "The charge failed on retry due to an invalid card. Verify the card details or contact the customer.",
      timestamp: "5m ago",
      customer: "Jane Smith",
      amount: "$45.00",
      paymentMethod: "MasterCard **** 5432",
      invoiceId: "INV-00456",
    },
  ];
  const handleCardClick = (error: Error) => {
    setSelectedError(error);
    setIsDialogOpen(true);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const notificationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4 mb-16 lg:w-1/2 lg:mb-0">
            <div className="max-w-lg flex flex-col items-center sm:items-start">
              <FadeIn direction="up">
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-center sm:text-start sm:text-5xl lg:text-6xl">
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
              <FadeIn direction="up" delay={0.1}>
                <p className="mb-8 text-lg text-muted-foreground text-center sm:text-start">
                  Monitor webhook failures, notify instantly, and maintain
                  smooth payment operations. Keep your revenue flowing without
                  interruption.
                </p>
              </FadeIn>
              <FadeIn direction="up" delay={0.2}>
                <div className="flex flex-col space-y-4 items-center sm:flex-row sm:space-y-0 sm:space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" className="gap-2" asChild>
                      <Link href="/dashboard">
                        Start Monitoring <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" variant="outline" className="gap-2">
                      Learn More
                    </Button>
                  </motion.div>
                </div>
              </FadeIn>
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <FadeIn direction="left" delay={0.3}>
              <motion.div
                className="relative mx-auto border rounded-lg shadow-lg bg-card max-w-max"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-semibold">Webhook Monitor</h3>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bell className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6 w-80"
                  >
                    {errors.map((error, index) => (
                      <motion.div
                        key={index}
                        variants={notificationVariants}
                        className="p-4 border rounded-lg relative select-none cursor-pointer"
                        whileHover={{ x: 5 }}
                        onClick={() => handleCardClick(error)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Activity
                              className={`w-5 h-5 ${error.iconColor}`}
                            />
                            <div>
                              <p className="font-medium">{error.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {error.type}
                              </p>
                            </div>
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 text-sm text-muted-foreground/70">
                          {error.timestamp}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border rounded-lg shadow-lg">
          <DialogHeader>
            <div className="flex items-center space-x-4">
              {/* Icon with relevant color */}
              <div
                className={`p-3 rounded-full ${
                  selectedError?.iconColor === "text-red-500"
                    ? "bg-red-100"
                    : selectedError?.iconColor === "text-yellow-500"
                      ? "bg-yellow-100"
                      : "bg-gray-100"
                }`}
              >
                <Activity
                  className={`w-6 h-6 ${
                    selectedError?.iconColor || "text-gray-500"
                  }`}
                />
              </div>
              <DialogTitle className="text-xl font-bold">
                {selectedError?.title}
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-4 space-y-4">
            {/* Basic Details */}
            <div>
              <p>
                <strong className="text-muted-foreground">Type:</strong>{" "}
                <span className="text-primary">{selectedError?.type}</span>
              </p>
              <p>
                <strong className="text-muted-foreground">Details:</strong>{" "}
                {selectedError?.details}
              </p>
            </div>

            {/* Show More Section */}
            <ShowMoreSection error={selectedError} />

            {/* Timestamp */}
            <div className="w-full flex items-center justify-end space-x-2 text-sm text-muted-foreground/80">
              <Bell className="w-4 h-4" />
              <span>{selectedError?.timestamp}</span>
            </div>
          </div>
          <div className="mt-6">
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
