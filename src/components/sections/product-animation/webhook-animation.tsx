import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  CogIcon,
  User,
  UserCog,
  Webhook,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ServerIcon } from "./server-icon";
import { NotificationEmail } from "./notification-email";
import { criticalEvents } from "@/models/payment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { EventTracker } from "@/eventTracker";
import { Logger } from "@/logger";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
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
  const animationOngoingRef = useRef(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [animatingEvent, setAnimatingEvent] = useState<{
    name: string;
    index: number;
  } | null>(null);

  const [barIntersected, setBarIntersected] = useState(false);
  const [restartingAnimation, setRestartingAnimation] = useState(false);
  const restartingAnimationRef = useRef(false);

  useEffect(() => {
    const bar = document.getElementById("webhook-animation-bar");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!barIntersected) {
            setBarIntersected(entry.isIntersecting);
            startNewAnimation(3000);
          }
        }
      },
      { threshold: 0.5 },
    );
    if (bar) {
      observer.observe(bar);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const startNewAnimation = async (delay: number = 0) => {
    if (animationOngoingRef.current) return;

    await new Promise(resolve => setTimeout(resolve, delay));
    const randomIndex = Math.floor(
      Math.random() * criticalEvents.length,
    );
    const randomEvent = criticalEvents[randomIndex];

    setSelectedEvent(randomEvent);
    setAnimatingEvent({
      name: randomEvent,
      index: randomIndex,
    });
    animationOngoingRef.current = true;
  };

  const waitForAnimation = async (ms: number) => {
    if (restartingAnimationRef.current) {
      setRestartingAnimation(false);
      restartingAnimationRef.current = false;
      throw new Error("Animation is restarting");
    }
    await new Promise(resolve => setTimeout(resolve, ms));
    if (restartingAnimationRef.current) {
      setRestartingAnimation(false);
      restartingAnimationRef.current = false;
      throw new Error("Animation is restarting");
    }
  };

  const runAnimation = async (event: string) => {
    try {
      setTimesTried(prev => prev + 1);
      setSelectedEvent(event);
      setStage("initial");
      setStripeProtectServerStage("initial");
      setUserServerStage("initial");
      animationOngoingRef.current = true;
      setShowNotifications(false);
      setStripeAnimationKey(key => key + 1);
      setStage("loading");
      // await new Promise(resolve => setTimeout(resolve, 1000));
      await waitForAnimation(1000);
      setWebhookVisible(true);

      await waitForAnimation(1500);
      setWebhookVisible(false);
      setStage("processing");
      setUserServerStage("processing");
      setStripeProtectServerStage("processing");

      await waitForAnimation(1000);

      const userServerSuccess = timesTried % 2 === 1;

      if (userServerSuccess) {
        setStage("success");
        setUserServerStage("success");
        await waitForAnimation(1000);
        setStripeProtectServerStage("success");
        animationOngoingRef.current = false;
        setSelectedEvent(null);
        setAnimatingEvent(null);
        EventTracker.track("webhook_demo_success", {
          event_type: selectedEvent,
          times_tried: timesTried,
        });
      } else {
        setStage("failure");
        setUserServerStage("failure");
        await waitForAnimation(1200);
        setStripeProtectServerStage("triggered");
        await waitForAnimation(1000);
        setShowNotifications(true);
        EventTracker.track("webhook_demo_failure", {
          event_type: selectedEvent,
          times_tried: timesTried,
        });
      }

      // Schedule next animation after a delay
      const delay = timesTried > 0 ? 2500 : 4000;
      setTimeout(() => {
        animationOngoingRef.current = false;
        setSelectedEvent(null);
        setAnimatingEvent(null);
        startNewAnimation();
      }, delay);
    } catch (error: any) {
      if (error.message === "Animation is restarting") {
        return;
      }
      Logger.error(error);
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

  const resetAnimation = () => {
    EventTracker.track("webhook_demo_restart");
    if (restartingAnimation || restartingAnimationRef.current) return;
    // Reset all states
    // setBarIntersected(true);
    restartingAnimationRef.current = true;
    setRestartingAnimation(true);

    animationOngoingRef.current = false;
    setSelectedEvent(null);
    setAnimatingEvent(null);
    setStage("idle");
    setStripeProtectServerStage("initial");
    setUserServerStage("initial");
    setTimesTried(0);
    setWebhookVisible(false);
    setShowNotifications(false);
    setStripeAnimationKey(prev => prev + 1);

    // Start new animation after a short delay
    setTimeout(() => {
      startNewAnimation(3000);
    }, 100);
  };

  return (
    <motion.section
      id="how-it-works"
      className="hidden xl:flex flex-col items-center justify-center min-h-[80vh] p-8 relative px-16 bg-card/30"
    >
      {/* Reset button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-4 right-10 z-50"
      >
        <Button
          variant="outline"
          size="icon"
          onClick={resetAnimation}
          className="hover:bg-background/20 shadow-md w-fit p-4"
          title="Reset animation"
          disabled={restartingAnimation}
        >
          <RotateCcw
            className={cn("!h-6 !w-6 rotate-180", {
              "animate-spin": restartingAnimation,
            })}
          />
          Restart animation
        </Button>
      </motion.div>

      <div className="w-full flex flex-col items-center mb-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-secondary absolute top-10 dark:text-foreground"
        >
          {" "}
          Prevent user frustration before issues escalate
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-muted-foreground/80 absolute top-40"
        >
          How StripeProtect helps you keep your customers away from the the
          dispute button
        </motion.p>
      </div>

      {/* Bar, that if intersected with, animation starts */}
      <div
        id="webhook-animation-bar"
        className="absolute top-60 left-0 w-full h-2 bg-transparent"
      />
      {barIntersected && (
        <div className="relative container max- h-fit w-full flex justify-start">
          <div className="h-60 container relative">
            <div className="w-fit relative py-4 flex flex-col items-center space-y-4 overflow-visible">
              {criticalEvents.map((ev, index) => (
                <motion.div
                  key={ev}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={eventNameVariants}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className="relative w-64"
                  onMouseEnter={() => setHoveredEvent(ev)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  <Button
                    variant={"outline"}
                    size="lg"
                    disabled={true}
                    className={cn(
                      "w-full transition-all duration-200 border-border/20",
                      {
                        "border-primary border-2 !opacity-100":
                          selectedEvent === ev,
                      },
                    )}
                  >
                    {eventName(ev)}
                  </Button>
                </motion.div>
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
            {!restartingAnimation &&
            (animationOngoingRef.current || timesTried > 0) ? (
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
                  delay: 1.5,
                }}
              >
                <img
                  src="/stripe.jpg"
                  alt="stripe"
                  className={cn(
                    "h-28 w-auto object-cover rounded-lg shadow-lg",
                  )}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`${stripeAnimationKey}-no-animation`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={eventNameVariants}
                transition={{ delay: restartingAnimation ? 0 : 1.5 }}
                className={cn(
                  "w-fit h-fit absolute left-[33%] top-[30%] z-20  rounded-lg shadow-lg overflow-hidden",
                )}
              >
                <img
                  src="/stripe.jpg"
                  alt="stripe"
                  className={cn(
                    "h-28 w-auto object-cover rounded-lg shadow-lg",
                  )}
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
                      animationOngoingRef.current = false;
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
      )}
    </motion.section>
  );
};
