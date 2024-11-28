"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { AnalyticsSection } from "@/components/sections/analytics";
import NavigationBar from "@/components/sections/navigationBar";
import Footer from "@/components/sections/footer";
import SignUpSection from "@/components/sections/sign-up";

export default function Home() {
  const darkSectionRef = useRef(null);
  const [isDarkSectionVisible, setIsDarkSectionVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDarkSectionVisible(
          entry.intersectionRatio > 0.3 && entry.intersectionRatio < 0.8,
        );
      },
      {
        threshold: [0.3, 0.8],
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

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      transition={{ duration: 0.4 }}
    >
      <NavigationBar />
      <motion.div
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
      </motion.div>
      {/* <Button
        className="fixed bottom-4 right-4"
        onClick={authenticateWithStripe}
      >
        Stripe auth
      </Button>
      <Button className="fixed bottom-4 right-40" onClick={getStripeEvents}>
        Stripe events
      </Button> */}
      <div ref={darkSectionRef}>
        <AnalyticsSection />
      </div>
      <motion.div
        initial={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <SignUpSection />
        {/* <PricingSection /> */}
      </motion.div>
      <Footer />
    </motion.div>
  );
}
