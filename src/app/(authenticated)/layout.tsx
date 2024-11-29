import type { Viewport } from "next";
import AuthProvider from "@/app/providers/AuthProvider";
import { Navbar } from "@/components/navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: RootLayoutProps) {
  return (
    <main className="space-y-16">
      <Navbar />
      <div className="w-full h-full">
        <AuthProvider>{children}</AuthProvider>
      </div>
    </main>
  );
}
