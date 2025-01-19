import React, { useEffect, useState } from "react";
import { Bell, AlertCircle, CheckCircle2, Mail, Webhook } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [forceShowEmail, setForceShowEmail] = useState(false);

  const initAnimation = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowEmail(true);
      setShowAlert(false);
    }, 800);
    setTimeout(() => {
      setShowAlert(false);
      setShowEmail(false);
    }, 5000);
  };

  useEffect(() => {
    initAnimation();
    const interval = setInterval(() => {
      initAnimation();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen md:max-h-screen bg-background px-6 md:px-8 flex flex-col items-center justify-center">
      <motion.div
        className="container mx-auto px-4 py-20"
        initial="hidden"
        whileInView="visible"
        onMouseEnter={() => setForceShowEmail(true)}
        onMouseLeave={() => setForceShowEmail(false)}
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="h-full flex flex-col lg:flex-row items-center gap-12">
          {/* Content Section */}
          <motion.div className="lg:w-1/2 space-y-6" variants={itemVariants}>
            <motion.h2
              className="text-3xl sm:text-6xl font-bold leading-tight"
              variants={itemVariants}
            >
              Never miss a failed webhook.
              <motion.span
                className="block text-primary"
                variants={itemVariants}
              >
                Stay informed, stay in control.
              </motion.span>
            </motion.h2>

            <motion.p
              className="text-lg text-foreground/80"
              variants={itemVariants}
            >
              Instant email alerts keep you on top of webhook failures, ensuring
              your payment operations run smoothly 24/7. Resolve issues quickly
              and maintain seamless business operations with real-time
              notifications delivered straight to your inbox.
            </motion.p>

            <motion.ul className="space-y-4" variants={itemVariants}>
              {[
                "Immediate notifications when webhooks fail",
                "Detailed error information for quick debugging",
                "One-click access to the failure on Stripe's dashboard",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground/80">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Animation Section */}
          <motion.div className="lg:w-1/2" variants={itemVariants}>
            <motion.div
              className="min-h-[300px] md:min-h-[562px] relative bg-background rounded-lg p-4 md:p-8 border border-border shadow-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Webhook Server */}
              <motion.div
                className="absolute top-8 left-8"
                variants={itemVariants}
              >
                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                  <Webhook
                    className={`w-8 h-8 ${showAlert ? "text-red-400" : "text-primary"}`}
                  />
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  Webhook
                </div>
              </motion.div>

              {/* Alert Animation */}
              {showAlert && (
                <div className="absolute top-11 left-11 animate-ping">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              )}

              {/* Email Animation */}
              <motion.div
                className="absolute right-8 top-8"
                variants={itemVariants}
              >
                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                  <Mail
                    className={`w-8 h-8 ${showEmail ? "text-success" : "text-primary"}`}
                  />
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  Email Alert
                </div>
              </motion.div>

              {/* Connection Line */}
              <motion.div
                className="absolute top-16 left-28 right-28 h-0.5 bg-border"
                variants={itemVariants}
              >
                <div
                  className={`h-full bg-primary transition-all duration-700 ${showEmail ? "w-full" : "w-0"}`}
                />
              </motion.div>

              {/* Sample Email Preview */}
              <AnimatePresence>
                <motion.div
                  className={cn(
                    "mt-32 bg-background rounded-lg flex justify-center items-center relative",
                  )}
                  variants={itemVariants}
                >
                  <AnimatePresence>
                    {showEmail || forceShowEmail ? (
                      <motion.div
                        className="absolute w-full md:w-[80%] bg-gradient-to-t from-background/60 via-transparent to-transparent h-full z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <p className="text-sm text-foreground absolute bottom-2 left-4">
                          An email alert will be sent to you on webhook failure.
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  <img
                    src="/landing/email-webhook-failure-alert.png"
                    alt="Webhook Failure Alert"
                    className={cn(
                      "w-full md:w-[80%] h-auto transition-all duration-700 z-10",
                      {
                        "opacity-100 translate-y-0":
                          showEmail || forceShowEmail,
                        "opacity-20 translate-y-2 md:translate-y-5":
                          !showEmail && !forceShowEmail,
                      },
                    )}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default App;
