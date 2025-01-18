"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import usePayments from "@/lib/hooks/usePayments";
import { Product, ProductsResponse } from "@/models/payment";
import { Skeleton } from "@/components/ui/skeleton";
import { Logger } from "@/logger";

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
    "Monitor up to 1,000 webhooks/month",
  ],
  recommended: true,
};

// width 0 to 100%
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

export default function PricingSubscription() {
  const { getProducts } = usePayments();
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const [loading, setLoading] = useState(true);
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

  return (
    <section className="mx-auto mt-32 max-w-7xl px-6 md:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Simple,{" "}
          <span className="relative text-background overflow-clip">
            <motion.span
              variants={transparentTextVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute inset-0 bg-foreground/10 z-10 rounded-lg overflow-clip"
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
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-[574px] w-full" />
            ))
          : products.map(tier => (
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                key={tier.name}
                // make it span over 2 columns
                className={cn(
                  "relative p-8",
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
                <ul className="mt-8 space-y-4">
                  {tier.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.name.includes("free") ? (
                  <Button className="mt-8 w-full">Get started - free</Button>
                ) : (
                  <Button className="mt-8 w-full overflow-clip">
                    <motion.p key="get-started">Get started</motion.p>
                  </Button>
                )}
              </MotionCard>
            ))}
      </div>
    </section>
  );
}
