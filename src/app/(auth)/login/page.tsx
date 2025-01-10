"use client";

import SecurityFeatures from "@/app/(auth)/login/components/security-features";
import GoogleLogin from "@/components/auth/googleLogin";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/ui/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { EventTracker } from "@/eventTracker";
import usePayments from "@/lib/hooks/usePayments";
import { cn } from "@/lib/utils";
import { Coupon } from "@/models/payment";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const Login = () => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const { getCoupon } = usePayments();
  const searchParams = useSearchParams();
  const couponId = searchParams.get("promo");

  useEffect(() => {
    setLoadingCoupon(!!couponId);
    if (couponId) {
      getCoupon(couponId)
        .then(setCoupon)
        .catch(() => {
          EventTracker.track("coupon_error");
        })
        .finally(() => {
          setLoadingCoupon(false);
        });
    }
  }, [couponId]);

  const CouponComponent = () =>
    loadingCoupon ? (
      <Skeleton className="h-8 w-1/3" />
    ) : coupon ? (
      <Badge variant="success" className="text-sm bg-green-300 text-green-900">
        {coupon.title || coupon.name}
      </Badge>
    ) : (
      <></>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg h-fit flex flex-col items-center justify-center gap-2"
      >
        <CouponComponent />
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-fit bg-card rounded-2xl shadow-lg shadow-primary/5 p-8 border border-border/50 backdrop-blur-sm flex flex-col items-center justify-center gap-16"
        >
          <Logo textClassName="text-2xl" imageClassName="w-12 h-12"/>

          <div className="w-full flex flex-col items-center justify-center gap-2.5 mt-auto">
            <GoogleLogin />
            <SecurityFeatures />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
