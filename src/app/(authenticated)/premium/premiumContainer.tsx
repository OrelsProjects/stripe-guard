"use client";

import { PremiumTable } from "@/app/(authenticated)/premium/premiumTable";

export function PremiumContainer() {
  return (
    <div className="mx-auto py-12 px-4 w-[90%] space-y-20">
      <h1 className="text-3xl md:text-5xl font-extrabold  mb-6 text-center text-secondary">
        Don&apos;t lose revenue to failed webhooks
      </h1>
      <PremiumTable />
    </div>
  );
}
