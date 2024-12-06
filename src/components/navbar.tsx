"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, Home, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectAuth } from "@/lib/features/auth/authSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/settings", icon: Settings },
  // { name: "Premium", href: "/premium", icon: Crown },
];

const setDidCloseUserNeedsSetup = () => {
  localStorage.setItem("didCloseUserNeedsSetup", "true");
};

const getDidCloseUserNeedsSetup = () => {
  return localStorage.getItem("didCloseUserNeedsSetup");
};

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAppSelector(selectAuth);

  const [open, setOpen] = useState(true);
  const [showLastChance, setShowLastChance] = useState(false);

  useEffect(() => {
    if (getDidCloseUserNeedsSetup()) setOpen(false);
  }, []);

  const shouldShowUserNeedsSetup = useMemo(
    () =>
      (user?.settings.plan?.tokensLeft || 0) > 0 &&
      !user?.settings.isOnboarded &&
      open,
    [user],
  );

  const handleClose = () => {
    setOpen(false);
    setShowLastChance(true);
    setDidCloseUserNeedsSetup();
  };

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
        <AnimatePresence>
          {shouldShowUserNeedsSetup && (
            <motion.div
              key="user-needs-setup"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: 10, opacity: 0, transition: { duration: 0.4 } }}
              transition={{ type: "spring", bounce: 0.75 }}
              className="absolute right-4 flex items-center space-x-4 bg-yellow-100 dark:bg-yellow-200 p-2 rounded-md"
            >
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-900">
                Your revenue is not protected
              </p>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="bg-transparent border-yellow-800/40 text-yellow-800 dark:text-yellow-900 dark:border-yellow-900/40 hover:bg-transparent"
              >
                <Link href="/stripe-setup">Connect Stripe</Link>
              </Button>
              <X
                onClick={handleClose}
                className="h-4 w-4 text-yellow-800 dark:text-yellow-900 hover:cursor-pointer"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Dialog open={showLastChance} onOpenChange={setShowLastChance}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogHeader className="flex flex-row items-center gap-2">
              <Bell className="h-6 w-6 mt-2" />
              <h3 className="text-lg font-bold ">
                Your revenue is not protected.
              </h3>
            </DialogHeader>
            <p>
              You can always connect your Stripe account later in the settings.
            </p>
            <DialogFooter className="flex flex-col">
              <Button asChild>
                <Link
                  href="/settings#api-settings"
                  onClick={() => {
                    setShowLastChance(false);
                  }}
                >
                  Take me there
                </Link>
              </Button>
              <Button
                variant="link"
                className="!border-none"
                onClick={() => {
                  setShowLastChance(false);
                }}
              >
                I&apos;ll do it later
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}
