"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/hooks/redux";
import usePayments from "@/lib/hooks/usePayments";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

export interface PremiumTableProps {
  buyText?: string;
  onCheckout?: (priceId: string, productId: string) => void;
}

export function PremiumTable({ onCheckout, buyText }: PremiumTableProps) {
  const { getProducts, goToCheckout } = usePayments();
  const { products } = useAppSelector(state => state.products);
  const [loading, setLoading] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
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
      } catch (error) {
        console.error("Error fetching products:", error);
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
      await goToCheckout(priceId, productId);
    } catch (error) {
      toast.error("Something went wrong. Try again :)");
      console.log("Error starting checkout:", error);
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="overflow-hidden border border-muted rounded-lg">
      <div className="hidden md:block">
        {" "}
        {/* Desktop view */}
        <table className="w-full table-auto text-center">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">PROTECTED WEBHOOK</th>
              <th className="p-4 font-medium text-center">PRICE</th>
              <th className="p-4 font-medium text-center">PER WEBHOOK</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
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
                    className="text-lg md:text-xl text-center border-b border-muted/80"
                  >
                    <td className="p-8 font-bold text-foreground">
                      {new Intl.NumberFormat("en-US").format(
                        product.priceStructure.tokens,
                      )}
                    </td>
                    <td className="p-8 text-center font-bold text-primary">
                      ${product.priceStructure.price}
                    </td>
                    <td className="p-8 text-center text-muted-foreground">
                      $
                      {(
                        product.priceStructure.price /
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

      <div className="md:hidden">
        {" "}
        {/* Mobile view */}
        {loading ? (
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
                className="p-4 border-b border-muted/80 last:border-b-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    PROTECTED WEBHOOK
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    {new Intl.NumberFormat("en-US").format(
                      product.priceStructure.tokens,
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    PRICE
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ${product.priceStructure.price}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    PER WEBHOOK
                  </span>
                  <span className="text-sm text-muted-foreground">
                    $
                    {(
                      product.priceStructure.price /
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
