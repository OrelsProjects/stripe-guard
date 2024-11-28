import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
const LOGO = "/logo.png";

export interface LogoProps {
  height?: number;
  width?: number;
  animate?: boolean;
}

export default function Logo({ height, width, animate }: LogoProps) {
  const animation = animate
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <motion.div className="flex items-center gap-2 mr-4" {...animation}>
      <Image
        src={LOGO}
        alt={APP_NAME}
        width={width || 32}
        height={height || 32}
      />
      <span className="text-lg font-semibold">{APP_NAME}</span>
    </motion.div>
  );
}
