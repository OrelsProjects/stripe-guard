"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FREE_PLAN_NAME, Plan } from "@/models/user";
import {
  CalendarDays,
  CreditCard,
  Gauge,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatPrice } from "@/models/payment";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogContent } from "@/components/ui/alert-dialog";
import usePayments from "@/lib/hooks/usePayments";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionSettingsProps {
  plan: Plan;
  loading?: boolean;
}

export function SubscriptionSettings({
  plan,
  loading,
}: SubscriptionSettingsProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const { cancelSubscription, reactivateSubscription } = usePayments();
  const tokensUsagePercentage = (plan.tokensUsed / plan.totalTokens) * 100;

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      await cancelSubscription();
      toast.success("Subscription cancelled successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to cancel subscription");
      console.error(error);
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setIsReactivating(true);
    try {
      await reactivateSubscription();
      toast.success("Subscription reactivated successfully");
    } catch (error) {
      toast.error("Failed to reactivate subscription");
      console.error(error);
    } finally {
      setIsReactivating(false);
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-primary mt-1" />
            <div>
              <h2 className="text-lg md:text-xl font-semibold">Subscription</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your subscription and usage
              </p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-10 w-28" />
          ) : plan.name === FREE_PLAN_NAME ? (
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={() => router.push("/pricing")}
            >
              Upgrade Plan
            </Button>
          ) : (
            plan.isActive && (
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Plan"}
              </Button>
            )
          )}
        </div>

        <div className="grid gap-6">
          {/* Plan Details */}
          <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="font-medium">Current Plan</h3>
              {loading ? (
                <Skeleton className="h-8 w-32 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-primary mt-1">
                  {plan.name}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-medium">Price</h3>
              {loading ? (
                <Skeleton className="h-8 w-32 mt-1" />
              ) : (
                <p className="text-2xl font-bold mt-1">
                  ${formatPrice({ priceWithCents: plan.price })}/{plan.interval}
                </p>
              )}
            </div>
          </div>

          {/* Subscription End Alert */}
          {!loading && !plan.isActive && plan.name !== FREE_PLAN_NAME && (
            <Alert
              variant="destructive"
              className="border-destructive/50 text-destructive flex flex-row justify-start items-center"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center gap-2">
                Your subscription will end on{" "}
                {moment(plan.nextRefillAt).format("MMMM D, YYYY")}.
                <Button
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={() => handleReactivateSubscription()}
                  disabled={isReactivating}
                >
                  {isReactivating ? "Reactivating..." : "Reactivate"}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Next Payment */}
          {(loading || plan.name !== FREE_PLAN_NAME) && (
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-medium">Next Payment</h3>
                {loading ? (
                  <Skeleton className="h-5 w-full mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Your next payment of $
                    {formatPrice({
                      priceWithCents: plan.price,
                    })}{" "}
                    will be on{" "}
                    {moment(plan.nextRefillAt).format("MMMM D, YYYY")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Token Usage */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Gauge className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h3 className="font-medium">Token Usage</h3>
                {loading ? (
                  <Skeleton className="h-5 w-full mt-1" />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.tokensUsed} out of {plan.totalTokens} tokens used
                  </p>
                )}
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <Progress value={tokensUsagePercentage} className="h-2" />
            )}
            {loading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <p className="text-xs text-muted-foreground">
                Tokens will reset on{" "}
                {moment(plan.nextRefillAt).format("MMMM D, YYYY")}
              </p>
            )}
          </div>
        </div>

        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to cancel?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 text-foreground/95">
                <p>By cancelling your subscription, you&apos;ll lose access to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Higher monthly token limits</li>
                  <li>Priority support</li>
                  <li>Advanced features and capabilities</li>
                </ul>
                <p className="font-medium text-destructive">
                  Your subscription will remain active until the end of your
                  current billing period.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                disabled={cancelling}
                onClick={handleCancelSubscription}
                className="bg-destructive/5 border border-destructive text-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
                variant="destructive"
              >
                {cancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Yes, Cancel Subscription"
                )}
              </AlertDialogAction>
              <Button
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelling}
              >
                Keep subscription
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
