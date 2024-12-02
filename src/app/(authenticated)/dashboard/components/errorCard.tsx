import { motion } from "framer-motion";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WebhookError } from "@/models/webhook";
import { Button } from "@/components/ui/button";

interface ErrorCardProps {
  error: WebhookError;
  onClick: () => void;
  onResolve: (error: WebhookError) => void;
}

export function ErrorCard({ error, onClick, onResolve }: ErrorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <CardContent className="pt-4 px-2">
          <div className="flex items-start gap-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">{error.type}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Failed webhooks: {error.failedWebhooks}
              </p>
              <p className="text-xs text-muted-foreground">
                {format((error.created as number) * 1000, "PPpp")}
              </p>
            </div>
            <Button
              size="lg"
              onClick={e => {
                e.stopPropagation();
                onResolve(error);
              }}
              className="my-auto"
            >
              Resolved
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
