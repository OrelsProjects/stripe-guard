"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NavigationBar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-16 sticky top-0 z-50 w-full flex justify-center items-center border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex items-center h-14 justify-between">
        <Logo />
        <nav className="flex items-center gap-10 flex-1 justify-end text-base">
          {["Features", "How it Works", "Pricing", "Read more"].map(
            (item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="hidden sm:block"
              >
                <Link
                  href={
                    item === "Read more"
                      ? "/blog"
                      : item === "How it Works"
                        ? "#how-does-it-work"
                        : `#${item.toLowerCase().replace(/\s+/g, "-")}`
                  }
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              </motion.div>
            ),
          )}
          <Button className="md:px-16 md:py-5" asChild>
            <Link href="/login">
              <span className="hidden md:block">Protect your revenue</span>
              <span className="md:hidden">Get started</span>
              <ArrowRight />
            </Link>
          </Button>
        </nav>
      </div>
    </motion.header>
  );
}
