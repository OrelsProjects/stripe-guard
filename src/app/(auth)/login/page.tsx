"use client";

import SecurityFeatures from "@/app/(auth)/login/components/security-features";
import GoogleLogin from "@/components/auth/googleLogin";
import Logo from "@/components/ui/Logo";
import { motion } from "framer-motion";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 flex items-center justify-center p-4 font-['Montserrat']">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex justify-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-xl aspect-video bg-card rounded-2xl shadow-lg shadow-primary/5 p-8 border border-border/50 backdrop-blur-sm"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-muted p-4 rounded-2xl shadow-lg shadow-muted/20">
              <Logo />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">
            Welcome to StripeGuard
          </h1>

          <p className="text-muted-foreground text-center mb-8">
            Monitor your webhooks status and get instant alerts
          </p>

          <GoogleLogin />
          <SecurityFeatures />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
