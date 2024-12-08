import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative w-16 h-16">
        <div className="absolute border-4 border-primary/20 rounded-full w-full h-full" />
        <div className="absolute border-4 border-primary border-t-transparent rounded-full w-full h-full animate-spin" />
      </div>
    </motion.div>
  );
};
