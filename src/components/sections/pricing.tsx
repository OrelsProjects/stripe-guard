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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Choose Your Premium Plan
        </h2>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Secure your webhooks with our flexible pricing options
        </p>
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
