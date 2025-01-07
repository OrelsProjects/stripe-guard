import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coupon } from "@/models/payment";
import { Check, CheckCircle, Loader2, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface PromotionalBannerProps {
  coupon: Coupon;
  onApply: () => Promise<void>;
  applied: boolean;
}

function useCountdown(targetDate: number) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const difference = targetDate - Date.now();
    return Math.max(0, difference);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = targetDate - Date.now();
      setTimeLeft(Math.max(0, difference));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, expired: timeLeft === 0 };
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
  const redeemBy = coupon.redeemBy ? new Date(coupon.redeemBy).getTime() : null;

  const countdown = redeemBy ? useCountdown(redeemBy) : null;

  if (maxRedemptions && timesRedeemed && remainingRedemptions <= 0) {
    return null;
  }

  if (redeemBy && countdown?.expired) {
    return null;
  }

  const urgencyText =
    remainingRedemptions > 0
      ? remainingRedemptions === 1
        ? "Last chance! Only 1 offer left"
        : `Hurry! Only ${remainingRedemptions} offers left`
      : "";

  return (
    <div className="w-fit flex flex-col items-center gap-0.5">
      {countdown && !countdown.expired && (
        <span className="flex items-center text-foreground text-lg border border-secondary rounded-lg py-1 px-4 tracking-tight font-bold">
          <span className="text-lg mr-1 font-extralight">Time left on the deal:</span>
          <Clock className="w-4 h-4 mr-1" />
          {String(countdown.hours).padStart(2, "0")}:
          {String(countdown.minutes).padStart(2, "0")}:
          {String(countdown.seconds).padStart(2, "0")}
        </span>
      )}
      <div className="w-fit bg-secondary p-4 rounded-lg mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{coupon.emoji}</span>
          <div className="flex flex-col text-secondary-foreground">
            <span className="font-medium">
              Use the code <strong>{coupon.name}</strong> for{" "}
              <strong>{coupon.percentOff}%</strong> off this month only.
            </span>
            <div className="flex items-center gap-4 text-sm mt-1">
              {urgencyText && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {urgencyText}
                </span>
              )}
            </div>
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
    </div>
  );
}
