"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useMediaQuery from "@/lib/hooks/useMediaQuery";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)"); // tailwind: md
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref,
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", latest => {
    const extraHeight = isMobile ? 0 : 2;
    const cardsBreakpoints = content.map(
      (_, index) => index / (cardLength + extraHeight),
    );
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "hsla(var(--foreground) / 0.0)",
    "var(--neutral-800)",
    "var(--neutral-900)",
  ];

  const shadows = [
    "shadow-md shadow-background",
    "shadow-md shadow-primary",
    "shadow-md shadow-purple-500",
  ];

  const linearGradients = [
    "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
    "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
    "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className={cn(
        "w-full h-[30rem] md:h-[40rem] overflow-y-auto flex flex-col justify-start md:justify-center md:items-center relative md:space-x-10 rounded-md p-12 pt-0 px-8 md:py-12 md:pt-12 transition-colors duration-300",
      )}
      ref={ref}
    >
      <div className="relative flex items-start md:px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="mt-12 md:my-32">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl md:text-5xl  font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-sm md:text-xl text-slate-300 max-w-sm mt-4"
              >
                {item.description}
              </motion.p>
              <div
                className={cn("h-60 mt-12 flex justify-center items-start md:hidden", {
                  "opacity-30": activeCard !== index,
                })}
              >
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        // style={{ background: backgroundGradient }}
        className={cn(
          "hidden lg:block h-fit w-fit rounded-2xl sticky top-16 overflow-hidden",
          shadows[activeCard % shadows.length],

          contentClassName,
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
