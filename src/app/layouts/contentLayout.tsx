"use client";

import React from "react";
import "@/../firebase.config";
import type { Viewport } from "next";

import AuthProvider from "@/app/providers/AuthProvider";
import NotificationsProvider from "@/app/providers/NotificationsProvider";
import TopLoaderProvider from "@/app/providers/TopLoaderProvider";
import AnimationProvider from "@/app/providers/AnimationProvider";
import HeightProvider from "@/app/providers/HeightProvider";
import ContentProvider from "@/app/providers/ContentProvider";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function ContentLayout({ children }: RootLayoutProps) {
  return (
    <main>
      <AuthProvider>
        <NotificationsProvider />
        <HeightProvider>
          <ContentProvider>
            <TopLoaderProvider />
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
                vault: true, // Enable vault to store payment details
                // currency: "USD",
                // enableFunding: "card,ideal",
                // components: "googlepay,buttons",
              }}
            >
              <AnimationProvider>{children}</AnimationProvider>
            </PayPalScriptProvider>
          </ContentProvider>
        </HeightProvider>
      </AuthProvider>
    </main>
  );
}

export const viewport: Viewport = {
  themeColor: "#121212",
};
