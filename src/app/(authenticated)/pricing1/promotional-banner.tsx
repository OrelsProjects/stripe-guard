import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coupon } from "@/models/payment";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Timer, Gift, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface PromotionalBannerProps {
  coupon: Coupon;
  onApply: () => Promise<void>;
  onApplyFreeCoupons: (couponId: string) => Promise<void>;
  showPromotionLaunch?: boolean;
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

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: timeLeft === 0 };
}

export function PromotionalBanner({
  coupon,
  onApply,
  onApplyFreeCoupons,
  showPromotionLaunch,
  applied,
}: PromotionalBannerProps) {
  const [loading, setLoading] = useState(false);
  const [loadingFreeCoupons, setLoadingFreeCoupons] = useState(false);
  const timesRedeemed = coupon.timesRedeemed || 0;
  const maxRedemptions = coupon.maxRedemptions || 0;
  const remainingRedemptions = maxRedemptions - timesRedeemed;
  const redeemBy = coupon.redeemBy ? new Date(coupon.redeemBy).getTime() : null;
  const freeTokens = coupon.freeTokens || 0;
  const hasFreeTokens = freeTokens > 0;
  const hasPercentOff = coupon.percentOff > 0;

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
        ? "Last chance! Only 1 offer remaining"
        : `Hurry! Only ${remainingRedemptions} offers remaining`
      : "";

  const getOfferText = () => {
    if (hasFreeTokens) {
      return (
        <span className="text-primary text-lg font-light">
          Get <span className="font-bold">{freeTokens.toLocaleString()}</span>{" "}
          webhook{freeTokens > 1 ? "s" : ""}{" "}
          <span className="font-bold">for free</span>
        </span>
      );
    }
    if (hasPercentOff) {
      return ``;
    }
    return "Special offer";
  };

  const getOfferIcon = () => {
    if (hasFreeTokens) {
      return <Gift className="w-6 h-6 text-primary" />;
    }
    return null;
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      transition={{
        duration: 0.3,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{
        once: true,
      }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl border border-primary/10 shadow-lg">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        {countdown && !countdown.expired && showPromotionLaunch && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            className="absolute top-0 w-full flex justify-center"
          >
            <div className="bg-orange-100 px-4 py-1 rounded-b-lg shadow-sm w-80 flex justify-center items-center">
              <div className="flex items-center text-sm font-medium text-orange-600">
                <Timer className="w-4 h-4 mr-1 animate-pulse" />
                <span className="text-sm font-light">
                  {countdown.days > 0 &&
                    `${countdown.days} day${countdown.days > 1 ? "s" : ""}`}
                  {countdown.hours > 0 &&
                    ` ${countdown.hours} hour${countdown.hours > 1 ? "s" : ""}`}
                  {countdown.minutes > 0 &&
                    ` ${countdown.minutes} min${countdown.minutes > 1 ? "s" : ""}`}
                </span>
                {countdown.seconds > 0 && (
                  <span className="ml-2 text-sm font-bold text-orange-500">
                    {countdown.seconds} second{countdown.seconds > 1 ? "s" : ""}{" "}
                    left!
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="p-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {getOfferIcon() && (
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full">
                {getOfferIcon()}
              </div>
            )}

            <div className="flex flex-col">
              {!hasFreeTokens && (
                <h3 className="text-lg flex items-center gap-2">
                  <span className="text-3xl">{coupon.emoji}</span>Use the code{" "}
                  <strong>{coupon.name}</strong>to save
                  <strong>{coupon.percentOff}%</strong>on your order
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </h3>
              )}

              <p className="text-muted-foreground flex flex-col items-start">
                <span className="font-bold text-primary">{getOfferText()}</span>
                {urgencyText && (
                  <span className="text-sm text-orange-500 font-medium">
                    • {urgencyText}
                  </span>
                )}
              </p>
            </div>
          </div>

          <Button
            onClick={() => {
              if (hasFreeTokens) {
                setLoadingFreeCoupons(true);
                onApplyFreeCoupons(coupon.id).catch(() => {
                  setLoadingFreeCoupons(false);
                });
              } else {
                setLoading(true);
                onApply().finally(() => {
                  setLoading(false);
                });
              }
            }}
            variant={applied ? "outline" : "default"}
            disabled={loading || loadingFreeCoupons}
            className={cn(
              "min-w-[140px] transition-all",
              applied && "bg-green-50 border-green-200 text-green-600",
            )}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : applied ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Claimed!</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                {hasFreeTokens ? (
                  <>
                    {loadingFreeCoupons ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Gift className="w-4 h-4" />
                    )}
                    <span>Claim Now</span>
                  </>
                ) : (
                  <span>Apply discount</span>
                )}
              </span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
