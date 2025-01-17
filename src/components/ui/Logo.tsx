"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
const LOGO = "/favicon.ico";

export interface LogoProps {
  height?: number;
  width?: number;
  textClassName?: string;
  imageClassName?: string;
  animate?: boolean;
  className?: string;
  withText?: boolean;
  navigateOnClick?: boolean;
}

export default function Logo({
  height,
  width,
  animate,
  className,
  textClassName,
  imageClassName,
  withText = true,
  navigateOnClick = false,
}: LogoProps) {
  const router = useCustomRouter();
  const animation = animate
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2",
        {
          "cursor-pointer": navigateOnClick,
        },
        className,
      )}
      {...animation}
      onClick={navigateOnClick ? () => router.push("/") : undefined}
    >
      <Image
        src={LOGO}
        alt={APP_NAME}
        width={width || 26}
        height={height || 26}
        className={cn("w-6 h-6", imageClassName)}
      />
      {withText && (
        <span
          className={cn("text-lg text-foreground font-semibold", textClassName)}
        >
          {APP_NAME}
        </span>
      )}
    </motion.div>
  );
}
