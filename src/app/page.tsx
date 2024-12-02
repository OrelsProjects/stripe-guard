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
import { ProblemAgitationSection } from "@/components/sections/problem-agitation";
import { SocialProofSection } from "@/components/sections/social-proof";
import { AboutUsSection } from "@/components/sections/about-us";
import { FAQSection } from "@/components/sections/faq";
import usePayments from "@/lib/hooks/usePayments";

export default function Home() {
  const darkSectionRef = useRef<HTMLDivElement>(null);
  const [isDarkSectionVisible, setIsDarkSectionVisible] = useState(false);
  const { getProducts } = usePayments();

  useEffect(() => {
    getProducts();
  }, []);

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

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <NavigationBar />
      <motion.div
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <HeroSection />
        <ProblemAgitationSection />
        <FeaturesSection />
      </motion.div>
      <div ref={darkSectionRef}>
        <AnalyticsSection />
      </div>
      <motion.div
        initial={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <HowItWorksSection />
        <SocialProofSection />
        <AboutUsSection />
        <FAQSection />
        <SignUpSection />
      </motion.div>
      <Footer />
    </motion.div>
  );
}
