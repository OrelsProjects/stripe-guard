import { motion, AnimatePresence } from "framer-motion";
import { CogIcon, User, UserCog, Webhook } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ServerIcon } from "./server-icon";
import { NotificationEmail } from "./notification-email";
import { sendAlertToUserEvents } from "@/models/payment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
    viewport: { once: true },
  },
};

export const WebhookAnimation = () => {
  const [stage, setStage] = useState<
    "initial" | "processing" | "success" | "failure" | "loading"
  >("initial");
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [webhookVisible, setWebhookVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stripeAnimationKey, setStripeAnimationKey] = useState(0);
  const [animationOngoing, setAnimationOngoing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [animatingEvent, setAnimatingEvent] = useState<{
    name: string;
    index: number;
    x: number;
    y: number;
  } | null>(null);

  const runAnimation = async (event?: string) => {
    setStage("initial");
    setAnimationOngoing(true);
    setShowNotifications(false);
    setStripeAnimationKey(key => key + 1);
    setStage("loading");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWebhookVisible(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setWebhookVisible(false);
    setStage("processing");

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate shimmer and webhook press animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const success = isFirstTime ? false : Math.random() > 0.7;
    setIsFirstTime(false);
    setStage(success ? "success" : "failure");

    if (!success) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowNotifications(true);
    } else {
      setAnimationOngoing(false);
      setSelectedEvent(null);
      setAnimatingEvent(null);
    }
  };

  useEffect(() => {
    console.log("stage", stage);
  }, [stage]);

  const handleEventClick = (
    event: string,
    index: number,
    x: number,
    y: number,
  ) => {
    if (animationOngoing) return;
    setSelectedEvent(event);
    setAnimatingEvent({
      name: event,
      index,
      x,
      y,
    });
    setAnimationOngoing(true);
  };

  useEffect(() => {
    if (animatingEvent) {
      const timer = setTimeout(() => {
        setAnimatingEvent(null);
        runAnimation(selectedEvent || undefined);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [animatingEvent, selectedEvent]);

  const eventName = useCallback((ev: string) => {
    switch (ev) {
      case "charge.succeeded":
        return "Charge Succeeded";
      case "invoice.payment_succeeded":
        return "Invoice Payment Succeeded";
      case "customer.subscription.created":
        return "Customer Subscription Created";
      case "customer.subscription.updated":
        return "Customer Subscription Updated";
      default:
        return ev;
    }
  }, []);

  return (
    <motion.section className="hidden md:flex flex-col items-center justify-center min-h-[70vh] p-8 relative bg-muted">
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="text-6xl font-bold text-secondary mb-8 absolute top-10"
      >
        {" "}
        How does it work - In practice
      </motion.h1>
      <div className="relative h-fit w-full flex justify-center">
        <div className="h-60 container relative">
          <div className="absolute left-0 top-0 p-4 flex flex-col space-y-4">
            {sendAlertToUserEvents.map((ev, index) => (
              <Button
                variant="outline"
                size="lg"
                key={ev}
                disabled={selectedEvent !== null && selectedEvent !== ev}
                onClick={e => {
                  handleEventClick(ev, index, e.clientX, e.clientY);
                }}
                className={cn({
                  "opacity-30": animationOngoing && selectedEvent !== ev,
                  "border-primary border-2": selectedEvent === ev,
                })}
              >
                {eventName(ev)}
              </Button>
            ))}
          </div>

          <AnimatePresence>
            {animatingEvent && (
              <motion.div
                key={animatingEvent.name}
                initial={{
                  left: "10%",
                  top: "45%",
                  opacity: 1,
                }}
                animate={{
                  top: "45%", // First move top, then hold it
                  left: "32%", // Move left after top is done
                  opacity: 0.5,
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  type: "spring",
                  damping: 20,
                  stiffness: 100,
                  delay: 0.5,
                }}
                className="absolute bg-background text-foreground p-2 rounded shadow-lg z-10"
                style={{ pointerEvents: "none" }}
              >
                {animatingEvent.name}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stage === "loading" && !webhookVisible && (
              <motion.div
                key={stripeAnimationKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "w-[211px] h-[112px] p-2 absolute left-[33%] top-[30%] z-30 bg-transparent",
                )}
              >
                <CogIcon className="w-8 h-8 text-foreground animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            key={stripeAnimationKey}
            className={cn(
              "w-fit h-fit absolute left-[33%] top-[30%] z-20  rounded-lg shadow-lg overflow-hidden",
            )}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.8, 1] }}
            transition={{
              repeat: 0,
              repeatType: "reverse",
              duration: 0.7,
              ease: "easeInOut",
              delay: animationOngoing ? 1.5 : Infinity,
            }}
          >
            <img
              src="/stripe.jpg"
              alt="stripe"
              className={cn("h-28 w-auto object-cover rounded-lg shadow-lg")}
            />
          </motion.div>

          <AnimatePresence>
            {webhookVisible && (
              <motion.div
                initial={{ x: -400, opacity: 1 }}
                animate={{ x: -30, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 1,
                }}
                className="absolute left-[66%] top-[36%] -translate-x-[200px] bg-primary p-4 rounded-xl"
              >
                <Webhook className="w-12 h-12 text-primary-foreground" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute left-[66%] top-[25%] -translate-x-1/2 flex flex-col">
            <ServerIcon stage={stage} />
            <Logo className="w-16 h-16" />
          </div>

          <AnimatePresence>
            {showNotifications && (
              <>
                <NotificationEmail type="apology" />
                <NotificationEmail
                  type="alert"
                  delay={0.5}
                  onAnimationComplete={() => {
                    setAnimationOngoing(false);
                    setSelectedEvent(null);
                    setAnimatingEvent(null);
                  }}
                />
              </>
            )}
          </AnimatePresence>
          <motion.div className="absolute -right-10 -top-3 transition-all">
            <User
              className={cn("w-16 h-16 text-foreground opacity-30", {
                "opacity-100": stage === "failure",
              })}
            />
          </motion.div>
          <motion.div className="absolute -right-10 -bottom-12 mb-6 transition-all">
            <UserCog
              className={cn("w-16 h-16 text-foreground opacity-30", {
                "opacity-100": stage === "failure",
              })}
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
