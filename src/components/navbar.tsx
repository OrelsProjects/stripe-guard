"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, Home, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectAuth } from "@/lib/features/auth/authSlice";
import { motion } from "framer-motion";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/settings", icon: Settings },
  // { name: "Premium", href: "/premium", icon: Crown },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAppSelector(selectAuth);

  // Only if user has tokens and is not onboarded
  const shouldShowUserNeedsSetup = useMemo(
    () =>
      (user?.settings.plan?.tokensLeft || 0) > 0 && !user?.settings.isOnboarded,
    [user],
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 relative">
        <div className="flex items-center space-x-4 absolute left-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center space-x-4">
          {navigation.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        {shouldShowUserNeedsSetup && (
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0.75 }}
            className="absolute right-4 flex items-center space-x-4 bg-yellow-100 p-2 rounded-md"
          >
            <p className="text-sm font-medium text-yellow-800">
              Your revenue is not protected
            </p>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/stripe-setup">Connect Stripe</Link>
            </Button>
          </motion.div>
        )}
        {/* <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="outline"
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
          </Button>
        </div> */}
      </div>
    </nav>
  );
}
