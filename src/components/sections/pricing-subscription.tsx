"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import usePayments from "@/lib/hooks/usePayments";
import {
  Pricing,
  PricingType,
  Product,
  ProductsResponse,
} from "@/models/payment";
import { Skeleton } from "@/components/ui/skeleton";
import { Logger } from "@/logger";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/redux";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const freePlan: Product = {
  id: "free",
  name: "Totally free",
  description: "Just starting to Stripe? No cost, no frills, no judgment.",
  priceStructure: {
    yearly: {
      id: "price_free",
      price: 0,
      tokens: 0,
      currency: "USD",
    },
    monthly: {
      id: "price_free",
      price: 0,
      tokens: 0,
      currency: "USD",
    },
  },
  features: [
    "Basic dashboard access",
    "Webhook event history (30 days)",
    "Monitor up to 500 webhooks/month",
  ],
  recommended: true,
};

const transparentTextVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function PricingSubscription({
  className,
}: {
  className?: string;
}) {
  const { state } = useAppSelector(state => state.auth);
  const { getProducts, goToCheckout } = usePayments();
  const router = useCustomRouter();
  const [selectedPlan, setSelectedPlan] = useState<PricingType>("monthly");
  const [loading, setLoading] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [products, setProducts] = useState<Product[]>([freePlan]);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    setLoading(true);
    getProducts()
      .then((productsResponse: ProductsResponse | null) => {
        setProducts([freePlan, ...(productsResponse?.products || [])]);
      })
      .catch(() => {
        Logger.error("Error fetching products");
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, []);

  const handleGetStarted = (productId: string, priceId: string) => {
    setLoadingCheckout(true);
    if (state === "authenticated") {
      goToCheckout(priceId, productId, false).finally(() => {
        setLoadingCheckout(false);
      });
    } else {
      router.push(`/login?pri_id=${priceId}&pro_id=${productId}`);
    }
  };

  return (
    <section
      id="pricing"
      className={cn("min-h-screen mt-32 container px-6 md:px-8", className)}
    >
      <div className="text-center">
        <h2 className="text-3xl sm:text-6xl font-bold tracking-tight">
          Simple,{" "}
          <span className="relative text-background overflow-clip">
            <motion.span
              variants={transparentTextVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute inset-0 bg-foreground/30 z-10 rounded-lg overflow-clip"
            />
            <span className="relative z-20">transparent</span>
          </span>{" "}
          pricing
        </h2>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant={selectedPlan === "monthly" ? "default" : "outline"}
            onClick={() => setSelectedPlan("monthly")}
          >
            Monthly billing
          </Button>
          <Button
            variant={selectedPlan === "yearly" ? "default" : "outline"}
            onClick={() => setSelectedPlan("yearly")}
          >
            Yearly billing
            <Badge variant="secondary" className="ml-2">
              Save 30%
            </Badge>
          </Button>
        </div>
      </div>
      <div
        className={cn("w-full mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3", {
          "lg:grid-cols-2": state === "authenticated",
        })}
      >
        {loading
          ? Array.from({ length: state === "authenticated" ? 2 : 3 }).map(
              (_, index) => (
                <Skeleton key={index} className="h-[574px] w-full" />
              ),
            )
          : products.map(tier =>
              state === "authenticated" && tier.name.includes("free") ? null : (
                <MotionCard
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  key={tier.name}
                  // make it span over 2 columns
                  className={cn(
                    "relative h-full p-8 flex flex-col",
                    tier.recommended ? "border-primary border-2" : "",
                  )}
                >
                  {tier.recommended && (
                    <Badge className="absolute -top-6 right-4 flex flex-col bg-background border-2 border-primary py-1 px-2 pointer-events-none">
                      <p className="text-primary font-bold text-sm">
                        Just pick this one!
                      </p>
                      <span className="text-xs font-normal">
                        You can upgrade later.
                      </span>
                    </Badge>
                  )}
                  <div className="flex flex-col items-start">
                    <h4
                      className="text-2xl font-bold"
                      dangerouslySetInnerHTML={{ __html: tier.name }}
                    />
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>
                  <div className="mt-6">
                    <span className="text-4xl font-bold">
                      $
                      {selectedPlan === "monthly"
                        ? tier.priceStructure.monthly.price
                        : tier.priceStructure.yearly.price / 12}
                    </span>
                    <span className="text-muted-foreground">
                      {selectedPlan === "monthly" ? "/month" : "/month"}
                    </span>
                  </div>
                  <ul className="my-8 space-y-4">
                    {tier.features.map(feature => (
                      <li key={feature} className="flex items-center">
                        <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {tier.name.includes("free") ? (
                    <Button
                      disabled={loadingCheckout}
                      className="mt-auto w-full"
                      asChild
                    >
                      <Link
                        className={cn({
                          "pointer-events-none opacity-50": loadingCheckout,
                        })}
                        href={loadingCheckout ? "/" : "/login"}
                      >
                        {loadingCheckout ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <motion.p key="get-started">
                            Get started - free
                          </motion.p>
                        )}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      disabled={loadingCheckout}
                      className="mt-auto w-full overflow-clip"
                      onClick={() =>
                        handleGetStarted(
                          tier.id,
                          tier.priceStructure[selectedPlan].id,
                        )
                      }
                    >
                      <motion.p key="get-started">
                        {loadingCheckout ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Get started"
                        )}
                      </motion.p>
                    </Button>
                  )}
                </MotionCard>
              ),
            )}
      </div>
    </section>
  );
}
