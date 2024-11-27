import { motion } from "framer-motion";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserWebhooks } from "@prisma/client";

interface ErrorCardProps {
  error: Partial<UserWebhooks>;
  onClick: () => void;
}

export function ErrorCard({ error, onClick }: ErrorCardProps) {
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
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{error.type}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Failed webhooks: {error.pendingWebHooks}
              </p>
              <p className="text-xs text-muted-foreground">
                {format((error.created as number) * 1000, "PPpp")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
