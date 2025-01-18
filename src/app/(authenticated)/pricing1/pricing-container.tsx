"use client";

import { PricingTable } from "@/app/(authenticated)/pricing1/pricing-table";

export function PricingContainer() {
  return (
    <div className="mx-auto py-12 px-4 w-[90%] space-y-20">
      <h2 className="text-3xl md:text-5xl font-extrabold  mb-6 text-center text-secondary">
        Don&apos;t lose revenue to failed webhooks
      </h2>
      <PricingTable />
    </div>
  );
}
