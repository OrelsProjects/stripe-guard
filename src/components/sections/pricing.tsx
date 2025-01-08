"use client";

import { useRouter } from "next/navigation";
import { PremiumTable } from "@/app/(authenticated)/premium/premiumTable";
import { useState } from "react";

export function Pricing() {
  const router = useRouter();
  const [discountApplied, setDiscountApplied] = useState(false);
  const handleCheckout = (priceId: string, productId: string) => {
    router.push(
      `/login?pri_id=${priceId}&pro_id=${productId}&promo=${discountApplied}`,
    );
  };

  return (
    <section id="pricing" className="py-16 px-4 md:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2>Prevent user frustration before issues escalate</h2>
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-16">
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-green-500 shrink-0"
            >
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
            <span>Avoid losing customers over failed webhooks</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-green-500 shrink-0"
            >
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
            <span>Save an average of $50 per avoided churn</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-green-500 shrink-0"
            >
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
            <span>1-minute setup with your Stripe account</span>
          </div>
        </div>
        <PremiumTable
          onDiscountEnabled={() => {
            setDiscountApplied(true);
          }}
          onCheckout={handleCheckout}
          buyText="Protect now"
        />
      </div>
    </section>
  );
}
