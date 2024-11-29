import axios from "axios";
import { Logger } from "@/logger";
import { Product } from "@/models/payment";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function usePayments() {
  const getProducts = async () => {
    try {
      const response = await axios.get<Product[]>("/api/stripe/products");
      return response.data;
    } catch (error: any) {
      Logger.error("Error getting products", { error });
      throw error;
    }
  };

  const goToCheckout = async (priceId: string, productId: string) => {
    try {
      const response = await axios.post<{ sessionId: string }>(
        "/api/stripe/checkout",
        { priceId, productId },
      );
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        Logger.error("Error redirecting to checkout", { error });
        throw error;
      }
    } catch (error: any) {
      Logger.error("Error starting checkout", { error });
      throw error;
    }
  };

  return {
    getProducts,
    goToCheckout,
  };
}
