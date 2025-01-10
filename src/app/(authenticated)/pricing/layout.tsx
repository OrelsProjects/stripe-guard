import { cn } from "@/lib/utils";
import { Gabarito } from "@/lib/utils/fonts";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Premium",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("w-full h-full", Gabarito.className)}>{children}</div>
  );
}
