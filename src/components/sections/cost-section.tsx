"use client";

import { motion } from "framer-motion";
import { LucideIcon, AlertTriangle, XCircle, Search } from "lucide-react";

interface CostItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  quote: string;
  mainImage: string;
  overlayImage?: string;
  gradientFrom: string;
  gradientTo: string;
}

function CostItem({
  icon: Icon,
  title,
  description,
  quote,
  mainImage,
  overlayImage,
  gradientFrom,
  gradientTo,
}: CostItemProps) {
  return (
    <motion.div className="max-w-5xl mx-auto px-4" variants={itemVariants}>
      <motion.h2
        className={`text-xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} bg-clip-text text-transparent flex items-center gap-2`}
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
      >
        <motion.div
          className={`w-6 h-6 sm:w-12 sm:h-12 bg-${gradientFrom}/20 rounded-md sm:rounded-xl flex items-center justify-center flex-shrink-0`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className={`w-4 h-4 sm:w-8 sm:h-8 text-${gradientFrom}`} />
        </motion.div>
        {title}
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl mb-12"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
      >
        {description}
      </motion.p>

      <motion.div
        className="relative"
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r from-${gradientFrom}/30 to-${gradientTo}/30 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity`}
        />
        <div className="relative overflow-clip">
          <img
            src={mainImage}
            alt={title}
            className="relative rounded-lg border border-zinc-800 w-full shadow-xl"
          />
          {overlayImage && (
            <motion.img
              initial={{ opacity: 0, y: 100, x: 60 }}
              variants={{
                visible: {
                  opacity: 1,
                  y: 40,
                  x: 60,
                },
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileInView="visible"
              viewport={{ once: true }}
              src={overlayImage}
              alt={`${title} overlay`}
              className="absolute bottom-0 right-0 rounded-lg border border-zinc-800 h-36 md:h-64 shadow-xl"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-base text-muted-foreground italic">
              &quot;{quote}&quot;
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

const imageVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function CostSection() {
  return (
    <motion.section
      className="w-full min-h-screen flex flex-col justify-start items-center gap-12 bg-black/20 py-12"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
          },
        },
      }}
    >
      <motion.h2
        className="text-3xl sm:text-6xl font-bold tracking-tight text-center text-foreground"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
      >
        The cost of not having a webhook monitor
      </motion.h2>

      <CostItem
        icon={Search}
        title="Logs investigation nightmare"
        description="Every minute spent searching through logs for failed webhooks is time you don't ship new features."
        quote="Finding that one failed webhook shouldn't take hours."
        mainImage="/landing/datadog.png"
        overlayImage="/landing/stripe-errors.png"
        gradientFrom="red-500"
        gradientTo="red-300"
      />

      <CostItem
        icon={XCircle}
        title="Customer churn risk"
        description="Every failed webhook is a ticking time bomb for your business. When payments fail to process or services don't activate, customers don't just get frustrated—they leave."
        quote="In today's competitive market, a single critical webhook failure can cost you thousands."
        mainImage="/landing/churn.png"
        gradientFrom="red-500"
        gradientTo="red-300"
      />

      <CostItem
        icon={AlertTriangle}
        title="Silent failures"
        description="The most dangerous failures are the ones you don't see coming. Webhook errors lurk in the shadows of your system, silently corrupting your data and breaking critical business flows."
        quote="By the time you notice, the damage is already done."
        mainImage="https://images.unsplash.com/photo-1525785967371-87ba44b3e6cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80"
        gradientFrom="yellow-500"
        gradientTo="yellow-300"
      />
    </motion.section>
  );
}
