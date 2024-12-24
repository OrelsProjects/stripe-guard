"use client";
// DO: Show in a section how much time you save by showing what needs to be done to set it up and how much money you save them
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
import CostComparisonSection from "@/components/sections/cost-comparison";
import { WebhookAnimation } from "@/components/sections/product-animation/webhook-animation";
import { WhatIfWebhookFails } from "@/components/sections/what-if-webhook-fails";
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

  return (
    <motion.main
      className="w-screen min-h-screen flex flex-col overflow-x-clip"
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
      </motion.div>
      {/* <TracingBeam className="w-full" hideOnMobile> */}
      <motion.div
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <CostComparisonSection />
        <WebhookAnimation />
        <ProblemAgitationSection />
        <WebhookReliability />
        <FeaturesSection />
      </motion.div>
      <div ref={darkSectionRef} >
        <AnalyticsSection />
      </div>
      <motion.div
        initial={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <WhatIfWebhookFails />
        <HowItWorksSection />
        {/* <SocialProofSection />
        <AboutUsSection /> */}
        <Pricing />
        <FAQSection />
        <SignUpSection />
      </motion.div>
      <Footer />
      {/* </TracingBeam> */}
    </motion.main>
  );
}
