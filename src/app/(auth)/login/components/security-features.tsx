import { motion } from "framer-motion";
import { Lock, Shield, Bell } from "lucide-react";

const features = [
  {
    icon: Shield,
    text: "24/7 monitoring",
  },
  {
    icon: Bell,
    text: "Instant alerts",
  },
  {
    icon: Lock,
    text: "Encrypted keys",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SecurityFeatures() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col sm:flex-row justify-center gap-6 mt-8"
    >
      {features.map(({ icon: Icon, text }) => (
        <motion.div
          key={text}
          variants={item}
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm">{text}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
