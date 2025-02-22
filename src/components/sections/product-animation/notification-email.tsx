"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  generateUserAlertEmail,
  generateWebhookFailureEmail,
} from "@/app/api/_utils/mail/templates";
import { EnabledEvent } from "@/models/payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationEmailProps {
  type: "alert" | "apology";
  delay?: number;
  onAnimationComplete?: () => void;
  event: string | null;
}

export const NotificationEmail = ({
  type,
  delay = 0,
  onAnimationComplete,
  event,
}: NotificationEmailProps) => {
  const [clickable, setClickable] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isAlert = type === "alert";

  const emailContent = useMemo(() => {
    if (!event) return "";
    if (type === "alert") {
      return generateWebhookFailureEmail(
        {
          id: "dummy_id",
          type: event,
        },
        new Date(),
        2,
      );
    }
    const content = generateUserAlertEmail(event as EnabledEvent);
    return content;
  }, []);

  return (
    <Dialog open={false}>
      <DialogTrigger asChild className="hover:cursor-default">
        <motion.div
          initial={{ x: 0, y: 60, opacity: 0 }}
          animate={{ x: 300, y: isAlert ? 80 : -140, opacity: 1 }}
          transition={{ duration: 0.5, delay }}
          className={cn(
            "absolute left-1/2 top-1/2 flex items-center gap-3 bg-background border border-border/15 p-4 rounded-lg max-w-[280px]",
          )}
          onAnimationComplete={() => {
            setClickable(true);
            onAnimationComplete?.();
          }}
          onClick={() => clickable && setDialogOpen(true)}
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
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isAlert ? "Admin Alert" : "User Notification"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh] overflow-auto rounded-md">
          <div
            className="notification-email"
            dangerouslySetInnerHTML={{ __html: emailContent }}
          />
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
