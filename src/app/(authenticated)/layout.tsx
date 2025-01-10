"use client";

import AnimationProvider from "@/app/providers/AnimationProvider";
import AuthProvider from "@/app/providers/AuthProvider";
import InitiatePlanFromLandingProvider from "@/app/providers/InitiatePlanFromLandingProvider";
import LaunchPromoProvider from "@/app/providers/LaunchPromoProvider";
import NewTokensProvider from "@/app/providers/NewTokensProvider";
import PromotionProvider from "@/app/providers/PromotionProvider";
import { Navbar } from "@/components/navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: RootLayoutProps) {
  return (
    <main>
      <Navbar />
      <AuthProvider>
        <PromotionProvider />
        <NewTokensProvider />
        <LaunchPromoProvider />
        <AnimationProvider>
          <InitiatePlanFromLandingProvider>
            {children}
          </InitiatePlanFromLandingProvider>
        </AnimationProvider>
      </AuthProvider>
    </main>
  );
}
