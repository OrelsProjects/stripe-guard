"use client";

import SetupOption from "@/app/(auth)/stripe-setup/components/setup-option";
import useAuth from "@/lib/hooks/useAuth";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { motion } from "framer-motion";
import { Webhook, Key } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

export default function StripeSetup() {
  const router = useCustomRouter();
  const [loadingStripeAuth, setLoadingStripeAuth] = React.useState(false);
  const [loadingGenerateApiKey, setLoadingGenerateApiKey] =
    React.useState(false);
  const { authenticateWithStripe } = useAuth();

  const handleStripeConnect = async () => {
    setLoadingStripeAuth(true);
    authenticateWithStripe().catch(() => {
      toast.error("Something went wrong.. Try again.");
    });
  };

  const handleApiKeyGeneration = () => {
    setLoadingGenerateApiKey(true);
    router.push("/stripe-setup/api-key");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 flex items-center justify-center p-4 font-['Montserrat']">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center text-foreground mb-8">
            Connect with Stripe
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <SetupOption
            icon={Webhook}
            title="Stripe Connect"
            description="Full integration with your Stripe account. Recommended for complete webhook monitoring and analytics."
            buttonText="Connect with Stripe"
            onClick={handleStripeConnect}
            loading={loadingStripeAuth}
            disabled={loadingGenerateApiKey}
          />

          <SetupOption
            icon={Key}
            title="API Key"
            description="Generate a restricted API key with limited permissions. Suitable for basic webhook monitoring."
            buttonText="Generate API Key"
            variant="outline"
            onClick={handleApiKeyGeneration}
            loading={loadingGenerateApiKey}
            disabled={loadingStripeAuth}
          />
        </div>
      </div>
    </div>
  );
}
