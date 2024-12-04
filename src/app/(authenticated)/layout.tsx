"use client";

import AuthProvider from "@/app/providers/AuthProvider";
import NewSubscriberProvider from "@/app/providers/NewSubscriberProvider";
import NewTokensProvider from "@/app/providers/NewTokensProvider";
import { Navbar } from "@/components/navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return (
    <main className="space-y-16">
      <AuthProvider>
        <NewSubscriberProvider />
        <NewTokensProvider />
        <Navbar />
        <div className="w-full h-full">{children}</div>
      </AuthProvider>
    </main>
  );
}
