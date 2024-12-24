"use client";

import { useEffect, useRef } from "react";
import usePayments from "@/lib/hooks/usePayments";
import { useSearchParams } from "next/navigation";

export default function InitiatePlanFromLandingProvider() {
  const searchParams = useSearchParams();
  const { goToCheckout } = usePayments();
  const loadingRedirect = useRef(false);

  const productId = searchParams.get("pro_id");
  const priceId = searchParams.get("pri_id");

  useEffect(() => {
    if (productId && priceId) {
      if (loadingRedirect.current) return;
      loadingRedirect.current = true;
      goToCheckout(priceId, productId).finally(() => {
        loadingRedirect.current = false;
      });
    }
  }, [productId, priceId]);

  return null;
}
