import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export const EmailNotifications = () => {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card p-4 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <Mail className="w-6 h-6 text-destructive" />
          <div>
            <h3 className="font-bold text-foreground">Alert to Owner</h3>
            <p className="text-sm text-muted-foreground">
              Webhook processing failed!
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card p-4 rounded-lg shadow-lg"
      >
        <div className="flex items-center space-x-3">
          <Mail className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-bold text-foreground">Apology to Client</h3>
            <p className="text-sm text-muted-foreground">
              We&apos;re sorry, but there was an error processing your webhook.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
