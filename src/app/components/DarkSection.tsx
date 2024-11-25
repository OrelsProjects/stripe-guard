"use client";

import { ForwardedRef, forwardRef } from "react";
import { motion } from "framer-motion";
import AdvancedFeatures from "@/app/components/AdvancedFeatures";
import CaseStudies from "@/app/components/CaseStudies";
import HowItWorks from "@/app/components/HowItWorks";
import { GraphGrid } from "@/components/ui/graphs/graphGrid";

interface DarkSectionProps extends React.HTMLAttributes<HTMLElement> {}

const DarkSection = forwardRef<HTMLElement, DarkSectionProps>(
  (_, ref: ForwardedRef<HTMLElement>) => {
    return (
      <motion.section ref={ref}>
        <HowItWorks />
        <GraphGrid />
        <CaseStudies />
      </motion.section>
    );
  }
);

export default DarkSection;