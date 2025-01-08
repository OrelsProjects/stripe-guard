"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/hooks/redux";
import usePayments from "@/lib/hooks/usePayments";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { Logger } from "@/logger";
import { Product } from "@/models/payment";
import { PromotionalBanner } from "@/app/(authenticated)/premium/promotionalBanner";

export interface PremiumTableProps {
  buyText?: string;
  onCheckout?: (priceId: string, productId: string) => void;
  onDiscountEnabled?: () => void;
}

export function PremiumTable({
  onCheckout,
  buyText,
  onDiscountEnabled,
}: PremiumTableProps) {
  const { getProducts, goToCheckout } = usePayments();
  const { products, coupon } = useAppSelector(state => state.products);
  const [loading, setLoading] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (loadingRef.current) {
        return;
      }
      loadingRef.current = true;
      setLoading(true);
      try {
        if (products.length === 0) await getProducts();
      } catch (error: any) {
        Logger.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    fetchProducts();
  }, []);

  const handleCheckout = async (priceId: string, productId: string) => {
    if (onCheckout) {
      onCheckout(priceId, productId);
      return;
    }

    if (loadingCheckout) {
      return;
    }
    setLoadingCheckout(true);
    try {
      await goToCheckout(priceId, productId, discountApplied);
    } catch (error: any) {
      toast.error("Something went wrong. Try again :)");
      Logger.error("Error starting checkout:", error);
    } finally {
      setLoadingCheckout(false);
    }
  };

  const applyDiscount = async () => {
    if (!coupon) return;
    if (discountApplied) return;
    setApplyingDiscount(true);
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulating API call
    setDiscountApplied(true);
    setApplyingDiscount(false);
    if (onDiscountEnabled) {
      onDiscountEnabled();
    }
  };

  const calculateDiscountedPrice = (price: number) => {
    if (!discountApplied || !coupon) return price;
    return price - (price * coupon.percentOff) / 100;
  };

  const renderPriceColumn = (product: Product) => {
    const originalPrice = product.priceStructure.price;
    const discountedPrice = calculateDiscountedPrice(originalPrice);

    return (
      <td className="p-8 text-center font-bold">
        {discountApplied ? (
          <>
            <span className="text-gray-500 line-through">${originalPrice}</span>{" "}
            <span className="text-primary">${discountedPrice.toFixed(2)}</span>{" "}
            <span className="text-green-500 text-sm">
              save ${(originalPrice - discountedPrice).toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-primary">${originalPrice}</span>
        )}
      </td>
    );
  };

  return (
    <div className="rounded-lg">
      {coupon && (
        <div className="w-full flex justify-center">
          <PromotionalBanner
            coupon={coupon}
            onApply={applyDiscount}
            applied={discountApplied}
          />
        </div>
      )}
      <div className="hidden md:block border border-card rounded-lg overflow-hidden">
        {" "}
        {/* Desktop view */}
        <table className="w-full table-auto text-center">
          <thead className="bg-card text-card-foreground">
            <tr>
              <th className="p-4 font-medium">PROTECTED WEBHOOK</th>
              <th className="p-4 font-medium text-center">PRICE</th>
              <th className="p-4 font-medium text-center">PER WEBHOOK</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading || applyingDiscount ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full mt-2" />
                  <Skeleton className="h-24 w-full mt-2" />
                </td>
              </tr>
            ) : (
              [...products]
                .sort((a, b) => b.priceStructure.price - a.priceStructure.price)
                .map((product, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={product.id}
                    className="text-lg md:text-xl text-center border-b border-card/80"
                  >
                    <td className="p-8 font-bold text-foreground">
                      {new Intl.NumberFormat("en-US").format(
                        product.priceStructure.tokens,
                      )}
                    </td>
                    {renderPriceColumn(product)}
                    <td className="p-8 text-center text-card-foreground">
                      $
                      {(
                        calculateDiscountedPrice(product.priceStructure.price) /
                        product.priceStructure.tokens
                      ).toFixed(4)}
                    </td>
                    <td className="p-8">
                      <Button
                        className="text-lg font-bold"
                        onClick={() =>
                          handleCheckout(product.priceStructure.id, product.id)
                        }
                        disabled={loadingCheckout}
                      >
                        {loadingCheckout ? (
                          <Loader className="text-foreground" />
                        ) : (
                          buyText || "Buy Plan"
                        )}
                      </Button>
                    </td>
                  </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-6 md:hidden">
        {" "}
        {/* Mobile view */}
        {loading || applyingDiscount ? (
          <div className="p-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full mt-4" />
            <Skeleton className="h-48 w-full mt-4" />
          </div>
        ) : (
          [...products]
            .sort((a, b) => b.priceStructure.price - a.priceStructure.price)
            .map((product, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={product.id}
                className="p-4 border-b border-card/80 last:border-b-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-card-foreground">
                    PROTECTED WEBHOOK
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {new Intl.NumberFormat("en-US").format(
                      product.priceStructure.tokens,
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-card-foreground">
                    PRICE
                  </span>
                  <span className="text-lg font-bold">
                    {discountApplied ? (
                      <>
                        <span className="text-gray-500 line-through">
                          ${product.priceStructure.price}
                        </span>{" "}
                        <span className="text-primary">
                          $
                          {calculateDiscountedPrice(
                            product.priceStructure.price,
                          ).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-primary">
                        ${product.priceStructure.price}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-card-foreground">
                    PER WEBHOOK
                  </span>
                  <span className="text-sm text-card-foreground">
                    $
                    {(
                      calculateDiscountedPrice(product.priceStructure.price) /
                      product.priceStructure.tokens
                    ).toFixed(4)}
                  </span>
                </div>
                <Button
                  className="w-full text-base font-bold"
                  onClick={() =>
                    handleCheckout(product.priceStructure.id, product.id)
                  }
                  disabled={loadingCheckout}
                >
                  {loadingCheckout ? (
                    <Loader className="text-foreground" />
                  ) : (
                    buyText || "Buy Plan"
                  )}
                </Button>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
}
