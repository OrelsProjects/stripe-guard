import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
