import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Coupon } from "@/models/payment";
import { Check, CheckCircle, Loader2 } from "lucide-react";
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
  return (
    <div className="w-fit bg-secondary p-4 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="text-2xl mr-2">❄️</span>
        <span className="font-medium text-secondary-foreground">
          Use the code <strong> {coupon.name}</strong> for{" "}
          <strong>{coupon.percent_off}%</strong> off this month only.
        </span>
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
            <span className="ml-2 font-bold">Saved {coupon.percent_off}%</span>
          </div>
        ) : (
          `Get Deal`
        )}
      </Button>
    </div>
  );
}
