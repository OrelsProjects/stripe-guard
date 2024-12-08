import { motion, AnimatePresence } from "framer-motion";
import { Server, CheckCircle2, XCircle } from "lucide-react";
import { LoadingSpinner } from "./loading-spinner";

interface ServerIconProps {
  stage: "initial" | "processing" | "success" | "failure" | "loading";
}

export const ServerIcon = ({ stage }: ServerIconProps) => {
  const bgColor = {
    initial: "bg-secondary",
    processing: "bg-secondary",
    success: "bg-success",
    failure: "bg-destructive",
    loading: "bg-secondary",
  }[stage];

  let iconColor = "text-primary-foreground";
  if (stage === "failure") iconColor = "text-destructive-foreground";

  return (
    <motion.div
      className={`relative p-8 rounded-xl ${bgColor} transition-colors duration-300`}
      animate={{ scale: stage === "processing" ? 1.05 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <Server className={`w-16 h-16 ${iconColor}`} />

      <AnimatePresence>
        {stage === "processing" && <LoadingSpinner />}

        {stage === "success" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-3 -right-3"
          >
            <CheckCircle2 className="w-8 h-8 text-green-800" />
          </motion.div>
        )}

        {stage === "failure" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-3 -right-3"
          >
            <XCircle className="w-8 h-8 text-red-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};