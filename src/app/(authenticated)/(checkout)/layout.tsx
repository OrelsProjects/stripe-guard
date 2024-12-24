import PromotionProvider from "@/app/providers/PromotionProvider";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
