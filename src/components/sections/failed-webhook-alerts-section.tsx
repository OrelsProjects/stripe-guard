import React, { useEffect, useState } from "react";
import { Bell, AlertCircle, CheckCircle2, Mail, Webhook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

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
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="h-full flex flex-col lg:flex-row items-center gap-12">
          {/* Content Section */}
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-6xl  font-bold leading-tight">
              Never miss a failed webhook.
              <span className="block text-primary">
                Stay informed, stay in control.
              </span>
            </h2>

            <p className="text-lg text-foreground/80">
              Instant email alerts keep you on top of webhook failures, ensuring
              your payment operations run smoothly 24/7. Resolve issues quickly
              and maintain seamless business operations with real-time
              notifications delivered straight to your inbox.
            </p>

            <ul className="space-y-4">
              {[
                "Immediate notifications when webhooks fail",
                "Detailed error information for quick debugging",
                "One-click access to the failure on Stripe's dashboard",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Animation Section */}
          <div className="lg:w-1/2">
            <div className="min-h-[300px] md:min-h-[562px] relative bg-background rounded-lg p-8 border border-border shadow-xl">
              {/* Webhook Server */}
              <div className="absolute top-8 left-8">
                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                  <Webhook
                    className={`w-8 h-8 ${showAlert ? "text-red-400" : "text-primary"}`}
                  />
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  Webhook
                </div>
              </div>

              {/* Alert Animation */}
              {showAlert && (
                <div className="absolute top-11 left-11 animate-ping">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
              )}

              {/* Email Animation */}
              <div className="absolute right-8 top-8">
                <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                  <Mail
                    className={`w-8 h-8 ${showEmail ? "text-success" : "text-primary"}`}
                  />
                </div>
                <div className="text-sm text-center text-muted-foreground">
                  Email Alert
                </div>
              </div>

              {/* Connection Line */}
              <div className="absolute top-16 left-28 right-28 h-0.5 bg-border">
                <div
                  className={`h-full bg-primary transition-all duration-700 ${showEmail ? "w-full" : "w-0"}`}
                />
              </div>

              {/* Sample Email Preview */}
              <AnimatePresence>
                <motion.div
                  className={cn(
                    "mt-32 bg-background rounded-lg flex justify-center items-center transition-all duration-700",
                    {
                      "opacity-100 translate-y-0": showEmail,
                      "opacity-20 translate-y-5": !showEmail,
                    },
                  )}
                >
                  <img
                    src="/landing/email-webhook-failure-alert.png"
                    alt="Webhook Failure Alert"
                    className="w-[80%] h-auto"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
