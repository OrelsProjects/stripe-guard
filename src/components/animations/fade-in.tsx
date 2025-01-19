"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  fullWidth?: boolean;
  className?: string;
  viewport?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction,
  fullWidth,
  className,
  viewport = true,
}: FadeInProps) {
  const getDirection = () => {
    switch (direction) {
      case "up":
        return { y: 40 };
      case "down":
        return { y: -40 };
      case "left":
        return { x: 40 };
      case "right":
        return { x: -40 };
      default:
        return { y: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getDirection() }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: viewport }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      style={{ width: fullWidth ? "100%" : "auto" }}
      className={cn("w-full h-full container", className)}
    >
      {children}
    </motion.div>
  );
}
