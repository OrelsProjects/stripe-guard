import { motion } from "framer-motion";
import { Mail } from "lucide-react";

interface NotificationEmailProps {
  type: "alert" | "apology";
  delay?: number;
  onAnimationComplete?: () => void;
}

export const NotificationEmail = ({
  type,
  delay = 0,
  onAnimationComplete,
}: NotificationEmailProps) => {
  const isAlert = type === "alert";

  return (
    <motion.div
      initial={{ x: 0, y: 60, opacity: 0 }}
      animate={{ x: 350, y: isAlert ? 80 : -140, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="absolute left-1/2 top-1/2 flex items-center gap-3 bg-card p-4 rounded-lg shadow-lg min-w-[200px]"
      onAnimationComplete={onAnimationComplete}
    >
      {isAlert ? (
        <Mail className="w-6 h-6 text-destructive shrink-0" />
      ) : (
        <Mail className="w-6 h-6 text-primary shrink-0" />
      )}
      <div className="flex flex-col w-[250px]">
        <span className="font-medium text-foreground">
          {isAlert ? "Admin Alert 🚨" : "User Notification"}
        </span>
        <span className="text-sm text-muted-foreground">
          {isAlert
            ? "Webhook Failed! Check it out"
            : "Apologies for the inconvenience."}
        </span>
      </div>
    </motion.div>
  );
};
