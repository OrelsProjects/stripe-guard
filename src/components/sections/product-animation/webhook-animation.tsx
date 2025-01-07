import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  CogIcon,
  User,
  UserCog,
  Webhook,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { ServerIcon } from "./server-icon";
import { NotificationEmail } from "./notification-email";
import { sendAlertToUserEvents } from "@/models/payment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { EventTracker } from "@/eventTracker";

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

const eventNameVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    viewport: { once: true },
  },
};

export const WebhookAnimation = () => {
  const [StripeProtectServerStage, setStripeProtectServerStage] = useState<
    "initial" | "processing" | "success" | "failure" | "loading" | "triggered"
  >("initial");
  const [userServerStage, setUserServerStage] = useState<
    "initial" | "processing" | "success" | "failure" | "loading"
  >("initial");
  const [stage, setStage] = useState<
    "idle" | "initial" | "processing" | "success" | "failure" | "loading"
  >("idle");
  const [timesTried, setTimesTried] = useState(0);
  const [webhookVisible, setWebhookVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stripeAnimationKey, setStripeAnimationKey] = useState(0);
  const [animationOngoing, setAnimationOngoing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [animatingEvent, setAnimatingEvent] = useState<{
    name: string;
    index: number;
    x: number;
    y: number;
  } | null>(null);

  const runAnimation = async (event: string) => {
    setTimesTried(prev => prev + 1);
    setSelectedEvent(event);
    setStage("initial");
    setStripeProtectServerStage("initial");
    setUserServerStage("initial");
    setAnimationOngoing(true);
    setShowNotifications(false);
    setStripeAnimationKey(key => key + 1);
    setStage("loading");
    await new Promise(resolve => setTimeout(resolve, 1000));
    setWebhookVisible(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setWebhookVisible(false);
    setStage("processing"); // Start with user server processing
    setUserServerStage("processing");
    setStripeProtectServerStage("processing");

    await new Promise(resolve => setTimeout(resolve, 1000));

    const userServerSuccess = timesTried % 2 === 1;

    if (userServerSuccess) {
      setStage("success");
      setUserServerStage("success");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStripeProtectServerStage("success");
      setAnimationOngoing(false);
      setSelectedEvent(null);
      setAnimatingEvent(null);
      EventTracker.track("webhook_demo_success", {
        event_type: selectedEvent,
        times_tried: timesTried,
      });
    } else {
      setStage("failure");
      setUserServerStage("failure");
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStripeProtectServerStage("triggered");
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowNotifications(true);
      EventTracker.track("webhook_demo_failure", {
        event_type: selectedEvent,
        times_tried: timesTried,
      });
    }
  };

  const handleEventClick = (
    event: string,
    index: number,
    x: number,
    y: number,
  ) => {
    if (animationOngoing) return;
    EventTracker.track("webhook_demo_event_clicked", {
      event_type: event,
      index,
    });
    setSelectedEvent(event);
    setAnimatingEvent({
      name: event,
      index,
      x,
      y,
    });
    setAnimationOngoing(true);
  };

  const handleProcessingComplete = () => {
    const userServerSuccess = timesTried % 2 === 1;
    
    if (userServerSuccess) {
      setStage("success");
      setUserServerStage("success");
      setStripeProtectServerStage("success");
      setAnimationOngoing(false);
      setSelectedEvent(null);
      setAnimatingEvent(null);
      EventTracker.track("webhook_demo_success", {
        event_type: selectedEvent,
        times_tried: timesTried,
      });
    } else {
      setStage("failure");
      setUserServerStage("failure");
      setStripeProtectServerStage("triggered");
      setShowNotifications(true);
      EventTracker.track("webhook_demo_failure", {
        event_type: selectedEvent,
        times_tried: timesTried,
      });
    }
  };

  useEffect(() => {
    if (animatingEvent) {
      const timer = setTimeout(() => {
        if (!selectedEvent) {
          return;
        }
        setAnimatingEvent(null);
        runAnimation(selectedEvent);
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
      case "charge.failed":
        return "Charge Failed";
      default:
        return ev;
    }
  }, []);

  return (
    <motion.section
      id="how-does-it-work"
      className="hidden md:flex flex-col items-center justify-center min-h-[70vh] p-8 relative bg-muted px-16"
    >
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="text-6xl font-bold text-secondary mb-8 absolute top-10 dark:text-foreground"
      >
        {" "}
        How does it work - In practice
      </motion.h1>
      <div className="relative container max- h-fit w-full flex justify-start">
        <div className="h-60 container relative">
          <div className="w-fit relative py-4 flex flex-col items-center space-y-4 overflow-visible">
            {sendAlertToUserEvents.map((ev, index) => (
              <motion.div
                key={ev}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={eventNameVariants}
                transition={{ delay: 0.3 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="relative w-64"
                onMouseEnter={() => setHoveredEvent(ev)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <Button
                  variant={hoveredEvent === ev ? "default" : "outline"}
                  size="lg"
                  disabled={
                    animationOngoing ||
                    (selectedEvent !== null && selectedEvent !== ev)
                  }
                  onClick={e => {
                    handleEventClick(ev, index, e.clientX, e.clientY);
                  }}
                  className={cn(
                    "w-full transition-all duration-200 hover:shadow-lg",
                    {
                      "border-primary border-2 !opacity-100":
                        selectedEvent === ev,
                      "transform hover:-translate-y-0.5": !animationOngoing,
                    },
                  )}
                >
                  {eventName(ev)}
                </Button>
              </motion.div>
            ))}
            <AnimatePresence>
              {timesTried === 0 && stage === "idle" && (
                <motion.div
                  key="press-event-instruction"
                  initial="hidden"
                  exit="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    ...eventNameVariants,
                    visible: {
                      ...eventNameVariants.visible,
                      transition: { duration: 0.5, delay: 2 },
                    },
                  }}
                  transition={{ duration: 1.2 }}
                  className="absolute -bottom-20 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg flex items-center gap-3 w-56"
                >
                  <p className="text-sm font-medium">
                    Click an event to see how it works in practice.
                  </p>
                  <ArrowUp className="w-7 h-7 animate-bounce" />
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* Loading stripe */}
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
          {/* Stripe image */}
          {animationOngoing || timesTried > 0 ? (
            <motion.div
              key={stripeAnimationKey}
              whileInView="visible"
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
          ) : (
            <motion.div
              key={`${stripeAnimationKey}-no-animation`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={eventNameVariants}
              transition={{ delay: 1.5 }}
              className={cn(
                "w-fit h-fit absolute left-[33%] top-[30%] z-20  rounded-lg shadow-lg overflow-hidden",
              )}
            >
              <img
                src="/stripe.jpg"
                alt="stripe"
                className={cn("h-28 w-auto object-cover rounded-lg shadow-lg")}
              />
            </motion.div>
          )}

          {/* Webhook  */}
          <AnimatePresence>
            {webhookVisible && (
              <motion.div
                key="stripe-protect-server-webhook"
                initial={{ x: -400, y: 0, opacity: 1 }}
                animate={{ x: -70, y: 90, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: 1,
                }}
                className="absolute left-[70%] top-[36%] bg-primary p-4 rounded-xl duration-300 ease-linear"
              >
                <Webhook className="w-12 h-12 text-primary-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {webhookVisible && (
              <motion.div
                id="user-server-webhook"
                initial={{ x: -400, y: 0, opacity: 1 }}
                animate={{ x: -70, y: -90, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: 1,
                }}
                className="absolute left-[70%] top-[36%] bg-primary p-4 rounded-xl duration-300 ease-linear"
              >
                <Webhook className="w-12 h-12 text-primary-foreground" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            whileInView="visible"
            initial={{ x: -86, y: 0, opacity: 0 }}
            animate={{ x: -66, y: 0, opacity: 1 }}
            transition={{ delay: 1.7 }}
            viewport={{ once: true }}
            id="stripe-protect-server"
            className="absolute left-[66%] top-[65%] -translate-x-1/2 flex flex-col"
          >
            <ServerIcon stage={StripeProtectServerStage} />
            <Logo className="w-16 h-16" />
          </motion.div>
          <motion.div
            whileInView="visible"
            initial={{ x: -86, y: 0, opacity: 0 }}
            animate={{ x: -66, y: 0, opacity: 1 }}
            transition={{ delay: 1.8 }}
            viewport={{ once: true }}
            id="user-server"
            className="absolute left-[66%] -top-[5%] -translate-x-1/2 flex flex-col items-center"
          >
            <ServerIcon stage={userServerStage} />
            <strong>Your Server</strong>
          </motion.div>

          <AnimatePresence>
            {showNotifications && (
              <>
                <NotificationEmail event={selectedEvent} type="apology" />
                <NotificationEmail
                  event={selectedEvent}
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
