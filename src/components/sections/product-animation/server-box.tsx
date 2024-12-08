import { motion } from "framer-motion";
import { Server, CheckCircle2, XCircle } from "lucide-react";

interface ServerBoxProps {
  isProcessing: boolean;
  isSuccess: boolean | null;
}

export const ServerBox = ({ isProcessing, isSuccess }: ServerBoxProps) => {
  let bgClass = "bg-secondary"; // default for initial/failure states
  if (isSuccess === true) bgClass = "bg-success";
  if (isSuccess === false) bgClass = "bg-destructive";

  return (
    <motion.div
      className={`p-6 rounded-lg ${bgClass} relative`}
      animate={{
        scale: isProcessing && isSuccess === null ? [1, 1.1, 1] : 1,
        transition: {
          repeat: isProcessing && isSuccess === null ? Infinity : 0,
        },
      }}
    >
      <Server className="w-12 h-12 text-primary-foreground" />
      {isSuccess === true && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -right-4"
        >
          <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
        </motion.div>
      )}
      {isSuccess === false && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-4 -right-4"
        >
          <XCircle className="w-8 h-8 text-destructive-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
};
