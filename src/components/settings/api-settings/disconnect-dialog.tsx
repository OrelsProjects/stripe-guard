"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import useStripeCredentials from "@/lib/hooks/useWebhooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface DisconnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DisconnectDialog({
  open,
  onOpenChange,
}: DisconnectDialogProps) {
  const router = useRouter();
  const { disconnectUser } = useStripeCredentials();
  const [loading, setLoading] = useState(false);

  const handleDisconnect = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await disconnectUser();
      router.refresh();
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      onOpenChange(false); // Close the dialog when the operation is successful
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={state => !loading && onOpenChange(state)}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive-outline" className="w-fit">
          Disconnect Stripe Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will disconnect your Stripe account and stop all webhook
            monitoring. You will lose access to:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Webhook failure notifications</li>
              <li>Analytics and monitoring data</li>
              <li>Retry management features</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={e => {
              e.preventDefault();
              handleDisconnect();
            }}
            disabled={loading}
          >
            {loading && <Loader className="text-foreground" />}
            Yes, disconnect account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
