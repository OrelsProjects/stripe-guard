import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bell } from "lucide-react";
import { format } from "date-fns";
import { WebhookError } from "@/models/webhook";

interface ErrorDialogProps {
  error: WebhookError | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (error: WebhookError) => void;
}

export function ErrorDialog({
  error,
  open,
  onOpenChange,
  onResolve,
}: ErrorDialogProps) {
  if (!error) return null;

  const navigateToStripeEvent = () => {
    // Replace 'YOUR_STRIPE_DASHBOARD_URL' with the actual base URL for your Stripe dashboard
    const stripeEventUrl = `https://dashboard.stripe.com/events/${error.eventId}`;
    window.open(stripeEventUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border rounded-lg shadow-lg">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Webhook Error Details
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <p>
              <strong className="text-muted-foreground">Event ID:</strong>{" "}
              <Button
                variant="link"
                onClick={navigateToStripeEvent}
                className="font-mono text-sm !p-0 h-fit"
              >
                {error.eventId}
              </Button>
            </p>
            <p>
              <strong className="text-muted-foreground">Type:</strong>{" "}
              <span>{error.type}</span>
            </p>
            <p>
              <strong className="text-muted-foreground">
                Failed Webhooks:
              </strong>{" "}
              <span className="text-destructive font-semibold">
                {error.failedWebhooks}
              </span>
            </p>
            <p>
              <strong className="text-muted-foreground">Details:</strong>{" "}
              {error.type}
            </p>
          </div>

          <div className="w-full flex items-center justify-end space-x-2 text-sm text-muted-foreground/80">
            <Bell className="w-4 h-4" />
            <span>{format((error.created as number) * 1000, "PPpp")}</span>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            size="lg"
            onClick={() => {
              onResolve(error);
              onOpenChange(false);
            }}
          >
            Resolved
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
