"use client";

import { Loader } from "@/components/ui/loader";
import { useAppSelector } from "@/lib/hooks/redux";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import usePayments from "@/lib/hooks/usePayments";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProviderProps {
  children: React.ReactNode;
}

export default function FreeTrialProvider({ children }: ProviderProps) {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products } = useAppSelector(state => state.products);
  const { user } = useAppSelector(state => state.auth);

  const [loading, setLoading] = useState(true);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const { getProducts, goToCheckout } = usePayments();

  useEffect(() => {
    if (!user) {
      return;
    }
    const isFreeTrial = searchParams.has("ft") && !user?.settings.plan;
    setIsFreeTrial(isFreeTrial);
    setLoading(isFreeTrial);
    if (!isFreeTrial) {
      router.push(pathname, {
        preserveQuery: true,
        paramsToRemove: ["ft"],
      });
      return;
    }
    if (isFreeTrial && products.length === 0) {
      getProducts().then(products => {
        const product = products?.find(
          product =>
            product.noCreditCard && product.priceStructure.interval === "year",
        );
        if (product) {
          goToCheckout(product.priceStructure.id, product.id).finally(() => {
            setLoading(false);
          });
        }
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-2">
        <Loader className="w-20 h-20" />
        {isFreeTrial && <p>Getting your plan ready...</p>}
      </div>
    );
  }

  return children;
}
