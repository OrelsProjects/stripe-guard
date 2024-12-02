"use client";

import AuthProvider from "@/app/providers/AuthProvider";
import FreeTrialProvider from "@/app/providers/FreeTrialProvider";
import { Navbar } from "@/components/navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return (
    <main className="space-y-16">
      <AuthProvider>
        <FreeTrialProvider>
          <Navbar />
          <div className="w-full h-full">{children}</div>
        </FreeTrialProvider>
      </AuthProvider>
    </main>
  );
}
