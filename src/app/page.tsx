"use client";
// DO: Show in a section how much time you save by showing what needs to be done to set it up and how much money you save them
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { AnalyticsSection } from "@/components/sections/analytics";
import NavigationBar from "@/components/sections/navigationBar";
import Footer from "@/components/sections/footer";
import SignUpSection from "@/components/sections/sign-up";
import { FAQSection } from "@/components/sections/faq";
import CostComparisonSection from "@/components/sections/cost-comparison";
import { WebhookAnimation } from "@/components/sections/product-animation/webhook-animation";
import { WebhookReliability } from "@/components/sections/webhook-reliability";
import { Pricing } from "@/components/sections/pricing";

export default function Home() {
  const darkSectionRef = useRef<HTMLDivElement>(null);
  const [isDarkSectionVisible, setIsDarkSectionVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDarkSectionVisible(
          entry.intersectionRatio > 0.5 && entry.intersectionRatio < 0.8,
        );
      },
      {
        threshold: [0.5, 0.8],
      },
    );

    if (darkSectionRef.current) {
      observer.observe(darkSectionRef.current);
    }

    return () => {
      if (darkSectionRef.current) {
        observer.unobserve(darkSectionRef.current);
      }
    };
  }, []);

  const Analytics = () => (
    <div ref={darkSectionRef}>
      <AnalyticsSection />
    </div>
  );

  const NegativeSection = () => (
    <motion.div
      animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className=" bg-card-foreground py-16 flex flex-col gap-32"
    >
      <WebhookReliability />
      <CostComparisonSection />
    </motion.div>
  );

  const PositiveSection = () => (
    <motion.div
      animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <WebhookAnimation />
      <FeaturesSection />
      <Pricing />
      <FAQSection />
    </motion.div>
  );

  const Hero = () => (
    <motion.div
      animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <HeroSection />
    </motion.div>
  );

  return (
    <motion.main
      className="w-screen min-h-screen flex flex-col overflow-x-clip"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <NavigationBar />
      <Hero />
      <NegativeSection />
      <PositiveSection />
      <Footer />
    </motion.main>
  );
}
