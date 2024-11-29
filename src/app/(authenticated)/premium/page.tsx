"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import usePayments from "@/lib/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";
import { Interval, Product } from "@/models/payment";
import { Loader } from "@/components/ui/loader";
import { toast } from "react-toastify";

export default function PremiumPage() {
  const { getProducts, goToCheckout } = usePayments();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const loadingRef = useRef(false);
  const [billingInterval, setBillingInterval] = useState<Interval>("year");

  useEffect(() => {
    const fetchProducts = async () => {
      if (loadingRef.current) {
        return;
      }
      loadingRef.current = true;
      setLoading(true);
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    fetchProducts();
  }, []);

  const handleCheckout = async (priceId: string, productId: string) => {
    if (loadingCheckout) {
      return;
    }
    setLoadingCheckout(true);
    try {
      await goToCheckout(priceId, productId);
    } catch (error) {
      toast.error("Something went wrong. Try again :)");
    } finally {
      setLoadingCheckout(false);
    }
  };

  const intervalToPlan = useMemo(() => {
    const intervalToPlan = new Map<Interval, Product[]>();
    products.forEach(product => {
      const interval = product.priceStructure.interval;
      if (!intervalToPlan.has(interval)) {
        intervalToPlan.set(interval, []);
      }
      intervalToPlan.get(interval)?.push(product);
    });
    return intervalToPlan;
  }, [products]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center space-y-4 mb-12">
        {loading ? (
          <>
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Get started with our flexible pricing plans
            </p>
          </>
        )}

        <div className="flex items-center justify-center mt-4 space-x-2 text-sm">
          {loading ? (
            <Skeleton className="h-6 w-80 mx-auto" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">
                Try any plan free for 14 days. Cancel anytime during trial.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-center space-x-2 mt-6">
          {loading ? (
            <Skeleton className="h-8 w-64 mx-auto" />
          ) : (
            <>
              <span
                className={
                  billingInterval === "month"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                Monthly
              </span>
              <Switch
                checked={billingInterval === "year"}
                onCheckedChange={checked =>
                  setBillingInterval(checked ? "year" : "month")
                }
              />
              <span
                className={
                  billingInterval === "year"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                Annual
                <Badge
                  variant={billingInterval === "year" ? "default" : "outline"}
                  className="ml-2"
                >
                  Save 20%
                </Badge>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn("relative h-full", {
                  "md:col-start-2 col-end-2": index === 0,
                  "md:col-start-3 col-end-3": index === 1,
                })}
              >
                <Card className="p-6 relative h-full flex flex-col">
                  <Skeleton className="h-8 w-24 mb-4 mx-auto" />
                  <Skeleton className="h-12 w-32 mb-2 mx-auto" />
                  <Skeleton className="h-4 w-24 mb-8 mx-auto" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full mt-auto" />
                </Card>
              </motion.div>
            ))
          : intervalToPlan.get(billingInterval)?.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn("relative", {
                  "md:col-start-2 col-end-2": index === 0,
                  "md:col-start-3 col-end-3": index === 1,
                })}
              >
                <Card
                  className={cn("p-6 relative h-full flex flex-col", {
                    "border-primary": plan.recommended,
                  })}
                >
                  {plan.recommended && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${plan.priceStructure.price}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingInterval === "month" ? "mo" : "year"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      After 14-day free trial
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {index === 0 && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      No credit card required
                    </p>
                  )}
                  <Button
                    className="w-full mt-auto"
                    onClick={() =>
                      handleCheckout(plan.priceStructure.id, plan.id)
                    }
                    variant={plan.recommended ? "default" : "outline"}
                    disabled={loadingCheckout}
                  >
                    {loadingCheckout && (
                      <Loader
                        className={cn({
                          "text-foreground": plan.recommended,
                        })}
                      />
                    )}
                    Start Free Trial
                  </Button>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
