"use client";

import { motion } from "framer-motion";

const steps = [
  "Connect your Stripe account",
  "We analyze your payment data",
  "View detailed reports and insights",
  "Receive alerts for critical issues",
  "Take action to resolve problems",
];

export default function HowItWorks() {
  return (
    <motion.section
      initial="hidden"
      transition={{ duration: 0.5 }}
      className="py-24 px-4 md:px-6 lg:px-8 text-white"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold mr-6">
                {index + 1}
              </div>
              <p className="text-xl">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
