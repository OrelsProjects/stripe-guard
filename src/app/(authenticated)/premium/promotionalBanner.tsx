import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coupon } from "@/models/payment";
import { Check, CheckCircle, Loader2, Clock } from "lucide-react";
import { useState } from "react";

interface PromotionalBannerProps {
  coupon: Coupon;
  onApply: () => Promise<void>;
  applied: boolean;
}

export function PromotionalBanner({
  coupon,
  onApply,
  applied,
}: PromotionalBannerProps) {
  const [loading, setLoading] = useState(false);
  const timesRedeemed = coupon.timesRedeemed || 0;
  const maxRedemptions = coupon.maxRedemptions || 0;
  const remainingRedemptions = maxRedemptions - timesRedeemed;

  if (maxRedemptions && timesRedeemed && remainingRedemptions <= 0) {
    return null;
  }

  const urgencyText =
    remainingRedemptions > 0
      ? remainingRedemptions === 1
        ? "Last chance! Only 1 offer left"
        : `Hurry! Only ${remainingRedemptions} offers left`
      : "";

  return (
    <div className="w-fit bg-secondary p-4 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-2xl mr-2">{coupon.emoji}</span>
        <div className="flex flex-col text-secondary-foreground">
          <span className="font-medium">
            Use the code <strong>{coupon.name}</strong> for{" "}
            <strong>{coupon.percentOff}%</strong> off this month only.
          </span>
          {urgencyText && (
            <span className="text-sm mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {urgencyText}
            </span>
          )}
        </div>
      </div>
      <Button
        onClick={() => {
          setLoading(true);
          onApply().finally(() => {
            setLoading(false);
          });
        }}
        variant={applied ? "outline" : "default"}
        disabled={loading}
        className={cn("ml-4")}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : applied ? (
          <div className="flex items-center text-green-500">
            <CheckCircle className="w-4 h-4" />
            <span className="ml-2 font-bold">Saved {coupon.percentOff}%</span>
          </div>
        ) : (
          `Claim Now`
        )}
      </Button>
    </div>
  );
}
