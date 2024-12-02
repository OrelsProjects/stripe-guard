import { ErrorCard } from "@/app/(authenticated)/dashboard/components/errorCard";
import { Card, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { WebhookError } from "@/models/webhook";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface WebhookErrorsCardProps {
  loading: boolean;
  errors: WebhookError[];
  onErrorClick: (error: WebhookError) => void;
}

function WebhookErrorsCard({
  loading,
  errors,
  onErrorClick,
}: WebhookErrorsCardProps) {
  return (
    <Card className="p-4 h-full max-h-[478px] flex flex-col gap-6">
      <CardTitle className="text-xl font-semibold">Webhook errors</CardTitle>
      {loading ? (
        <Loader />
      ) : errors.length > 0 ? (
        <div className="flex flex-col justify-between">
          <div className="max-h-[300px] grid gap-4 md:grid-cols-2 lg:grid-cols-1 pr-4 overflow-auto">
            {errors.map(error => (
              <ErrorCard
                key={error.eventId}
                error={error}
                onClick={() => onErrorClick(error)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex gap-2 justify-center items-center">
          <CheckCircle2 className="w-6 h-6 text-success" />
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="text-lg text-muted-foreground"
          >
            All the webhooks are running smoothly! 🚀
          </motion.p>
        </div>
      )}
    </Card>
  );
}

export default WebhookErrorsCard;
