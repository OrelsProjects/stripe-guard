"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CTA from "@/app/components/CTA";
import DashboardPreview from "@/app/components/DashboardPreview";
import Features from "@/app/components/Features";
import Hero from "@/app/components/Hero";
import Pricing from "@/app/components/Pricing";
import Testimonials from "@/app/components/Testimonials";
import DarkSection from "@/app/components/DarkSection";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const darkSectionRef = useRef(null);
  const [isDarkSectionVisible, setIsDarkSectionVisible] = useState(false);

  const test = async () => {
    await axios.post("/api/test");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDarkSectionVisible(
          entry.intersectionRatio > 0.2 && entry.intersectionRatio < 0.9
        );
      },
      {
        threshold: [0.2, 0.9],
      }
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
      className="min-h-screen"
      animate={{
        backgroundColor: isDarkSectionVisible ? "#000000" : "#ffffff",
      }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <Hero />
        <Features />
      </motion.div>

      <Button onClick={test}>Test</Button>

      {/* Attach the ref to DarkSection */}
      <div ref={darkSectionRef}>
        <DarkSection />
      </div>

      <motion.div
        animate={{ opacity: isDarkSectionVisible ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <DashboardPreview />
        <Testimonials />
        <Pricing />
        <CTA />
      </motion.div>
    </motion.div>
  );
}
