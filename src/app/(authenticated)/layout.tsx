"use client";

import AnimationProvider from "@/app/providers/AnimationProvider";
import AuthProvider from "@/app/providers/AuthProvider";
import InitiatePlanFromLandingProvider from "@/app/providers/InitiatePlanFromLandingProvider";
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
      <div className="space-y-8 mt-16">
        <AuthProvider>
          <PromotionProvider />
          <NewTokensProvider />
          <InitiatePlanFromLandingProvider />
          <AnimationProvider className="w-full h-full">
            {children}
          </AnimationProvider>
        </AuthProvider>
      </div>
    </main>
  );
}
