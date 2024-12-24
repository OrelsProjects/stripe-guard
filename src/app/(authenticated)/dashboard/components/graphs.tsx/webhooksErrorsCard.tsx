import { ErrorCard } from "@/app/(authenticated)/dashboard/components/errorCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { WebhookError } from "@/models/webhook";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface WebhookErrorsCardProps {
  loading: boolean;
  errors: WebhookError[];
  onErrorClick: (error: WebhookError) => void;
  onResolve: (error: WebhookError) => void;
  className?: string;
}

function WebhookErrorsCard({
  loading,
  errors,
  onResolve,
  onErrorClick,
  className,
}: WebhookErrorsCardProps) {
  return (
    <Card className={cn("p-4 h-[430px] flex flex-col gap-6", className)}>
      <CardTitle className="text-xl font-semibold">Webhook errors</CardTitle>
      <CardContent className="h-full w-full flex items-start justify-start">
        {loading ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="h-full w-full flex items-center justify-center"
          >
            <Loader />
          </motion.div>
        ) : errors.length > 0 ? (
          <div className="w-full flex flex-col justify-between">
            <div className="max-h-[300px] grid gap-4 md:grid-cols-2 lg:grid-cols-1 pr-4 overflow-auto">
              {errors.map(error => (
                <ErrorCard
                  key={error.eventId}
                  error={error}
                  onClick={() => onErrorClick(error)}
                  onResolve={onResolve}
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
      </CardContent>
    </Card>
  );
}

export default WebhookErrorsCard;
