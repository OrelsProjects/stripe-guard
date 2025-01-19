import axios from "axios";
import { Logger } from "@/logger";
import {
  CouponResponse,
  ProductsResponse,
  stripeCouponToCoupon,
} from "@/models/payment";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { setCoupon, setProducts } from "@/lib/features/products/productsSlice";
import { useRef } from "react";
import { updateUserSettings } from "@/lib/features/auth/authSlice";
import { freePlan } from "@/models/user";

const stripePromise = () =>
  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function usePayments() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const loadingProducts = useRef(false);

  const getProducts = async (
    shouldGetLaunch?: boolean,
  ): Promise<ProductsResponse | null> => {
    try {
      if (loadingProducts.current) {
        return null;
      }
      loadingProducts.current = true;
      const response = await axios.get<ProductsResponse>(
        `/api/stripe/products?shouldGetLaunch=${shouldGetLaunch}`,
      );
      dispatch(setProducts(response.data.products));
      dispatch(setCoupon(response.data.coupon));
      return response.data;
    } catch (error: any) {
      Logger.error("Error getting products", { error });
      throw error;
    } finally {
      loadingProducts.current = false;
    }
  };

  const getCoupon = async (couponId: string) => {
    try {
      const response = await axios.get<CouponResponse>("/api/stripe/coupon", {
        params: { couponId },
      });
      const coupon = stripeCouponToCoupon(response.data.coupon);
      return coupon;
    } catch (error: any) {
      Logger.error("Error getting coupon", { error });
      throw error;
    }
  };

  const goToCheckout = async (
    priceId: string,
    productId: string,
    discountApplied: boolean,
  ) => {
    try {
      const response = await axios.post<{ sessionId: string }>(
        "/api/stripe/checkout",
        { priceId, productId, discountApplied },
      );
      const stripe = await stripePromise();
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

  const cancelSubscription = async () => {
    try {
      if (!user) {
        throw new Error("No subscription found");
      }
      await axios.post("/api/subscription/cancel");
      dispatch(
        updateUserSettings({
          plan: {
            ...user.settings.plan,
            isActive: false,
          },
        }),
      );
    } catch (error: any) {
      Logger.error("Error cancelling subscription", { error });
      throw error;
    }
  };

  const reactivateSubscription = async () => {
    try {
      if (!user) {
        throw new Error("No subscription found");
      }
      await axios.post("/api/subscription/reactivate");
      dispatch(
        updateUserSettings({
          plan: { ...user.settings.plan, isActive: true },
        }),
      );
    } catch (error: any) {
      Logger.error("Error reactivating subscription", { error });
      throw error;
    }
  };

  return {
    getCoupon,
    getProducts,
    goToCheckout,
    cancelSubscription,
    reactivateSubscription,
  };
}
