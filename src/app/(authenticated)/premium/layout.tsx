import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Premium",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
