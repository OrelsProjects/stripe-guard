"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ui/loader";
import { toast } from "react-toastify";
import { useAppSelector } from "@/lib/hooks/redux";
import usePayments from "@/lib/hooks/usePayments";
import { motion } from "framer-motion";

export function PremiumTable() {
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
  }, [getProducts, products.length]);

  const handleCheckout = async (priceId: string, productId: string) => {
    if (loadingCheckout) {
      return;
    }
    setLoadingCheckout(true);
    try {
      await goToCheckout(priceId, productId);
    } catch (error) {
      toast.error("Something went wrong. Try again :)");
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <div className="mx-auto py-12 px-4 w-[90%] space-y-20">
      <h1 className="text-3xl md:text-5xl font-extrabold  mb-6 text-center text-secondary">
        Don&apos;t lose revenue to failed webhooks
      </h1>
      <div className="overflow-hidden border border-muted rounded-lg">
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
                          "Buy Plan"
                        )}
                      </Button>
                    </td>
                  </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
