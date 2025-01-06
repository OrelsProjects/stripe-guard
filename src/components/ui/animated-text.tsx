"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const sentences = text.split(".").filter(sentence => sentence.trim() !== "");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.26, // Delay between words in a sentence
        delayChildren: (i) * 1, // 2-second delay between sentences
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <>
      {sentences.map((sentence, sentenceIndex) => {
        const words = sentence.trim().split(" ");
        return (
          <motion.h1
            key={sentenceIndex}
            className={cn(
              "text-4xl md:text-6xl font-bold text-primary mb-4",
              className,
            )}
            variants={container}
            initial="hidden"
            animate="visible"
            custom={sentenceIndex + 1}
          >
            {words.map((word, wordIndex) => (
              <motion.span
                key={`${sentenceIndex}-${wordIndex}`}
                className="inline-block mr-2"
                variants={child}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="inline-block"
              variants={child}
              key={`${sentenceIndex}-period`}
            >
              .
            </motion.span>
          </motion.h1>
        );
      })}
    </>
  );
}
