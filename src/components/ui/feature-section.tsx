import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeatureSectionProps {
  src: string;
  title: string;
  description: string;
  direction?: "ltr" | "rtl";
}

const itemVariants = {
  hidden: { opacity: 0, y: 300 },
  visible: { opacity: 1, y: 10 },
};

const itemVariantsMobile = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 10 },
};

export default function FeatureSection({
  src,
  title,
  description,
  direction = "ltr",
}: FeatureSectionProps) {
  return (
    <div
      className={cn(
        "relative grid items-end gap-6 lg:grid-cols-2 lg:gap-12 px-6 rounded-t-lg bg-card overflow-clip pt-24",
        {
          "rounded-bl-lg": direction === "ltr",
          "rounded-br-lg": direction === "rtl",
        },
      )}
    >
      <img
        src={
          direction === "rtl"
            ? "/landing/feature-background-flip.png"
            : "/landing/feature-background.png"
        }
        alt="feature background"
        className={cn(
          "absolute inset-0 w-full h-full object-cover z-50 opacity-50",
        )}
      />
      <div
        className={cn(
          "space-y-4 mb-16",
          direction === "rtl" && "lg:order-last",
        )}
      >
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <p className="text-foreground font-thin">{description}</p>
      </div>
      <div
        className={cn(
          "relative bg-card w-fit",
          direction === "rtl" && "lg:order-first",
        )}
      >
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5, delay: 0.3 }}
          initial="hidden"
          whileInView="visible"
          className="hidden sm:block bg-card"
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={title}
            width={700}
            height={600}
          />
        </motion.div>
        <motion.div
          variants={itemVariantsMobile}
          transition={{ duration: 0.5, delay: 0.3 }}
          initial="hidden"
          whileInView="visible"
          className="block sm:hidden bg-card"
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={title}
            width={700}
            height={600}
          />
        </motion.div>
      </div>
    </div>
  );
}
