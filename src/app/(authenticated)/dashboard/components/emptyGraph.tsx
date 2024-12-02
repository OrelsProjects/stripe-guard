import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function EmptyGraph() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="h-full flex flex-col items-center justify-center text-center p-6"
    >
      <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No webhook data yet</h3>
      {/* <p className="text-muted-foreground mb-4">
        Start monitoring your webhooks to see performance insights here.
      </p> */}
      <p className="text-sm text-muted-foreground">
        As you receive webhook events, this graph will populate with the
        relevant data
      </p>
    </motion.div>
  );
}
