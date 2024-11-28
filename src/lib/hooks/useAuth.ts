/* eslint-disable react-hooks/exhaustive-deps */
import { signIn, signOut as signOutAuth } from "next-auth/react";
import { useCallback, useState } from "react";
import { clearUser, setError } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { EventTracker } from "@/eventTracker";
import { Logger } from "@/logger";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      await signIn("google", {
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error: any) {
      if (error?.name === "UserAlreadyAuthenticatedException") {
        EventTracker.track("User already authenticated");
        await signOut();
        return;
      }
      Logger.error("Error signing in with Google", { error });
      dispatch(setError("Failed to sign in"));
      throw error;
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    try {
      setLoading(true);
      await signIn("apple");
    } catch (error: any) {
      if (error?.name === "UserAlreadyAuthenticatedException") {
        EventTracker.track("User already authenticated");
        await signOut();
        return;
      }
      Logger.error("Error signing in with Apple", { error });
      dispatch(setError("Failed to sign in"));
      throw error;
    }
  }, []);

  const authenticateWithStripe = useCallback(async () => {
    try {
      const oauthLink = await axios.get<{ url: string }>(
        "/api/stripe/auth/link",
      );
      if (!oauthLink.data.url) {
        throw new Error("Failed to get oauth link");
      }
      router.push(oauthLink.data.url);
    } catch (error: any) {}
  }, []);

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      register?: boolean,
      displayName: string = "",
    ) => {
      setLoading(true);
      try {
        const result = await signIn("credentials", {
          email,
          password,
          displayName: displayName,
          isSignIn: !register,
          redirect: false,
        });
        if (!result?.ok) {
          throw new Error("Failed to sign in");
        }
      } catch (error: any) {
        Logger.error("Error signing in with email", { error });
        dispatch(setError("Failed to sign in"));
        throw error;
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      EventTracker.track("User signed out");
      await signOutAuth({ callbackUrl: "/" });
      dispatch(clearUser());
      localStorage.clear();
    } catch (error: any) {
      Logger.error("Error signing out", { error });
      dispatch(setError("Failed to sign out"));
      throw error;
    } finally {
      window.location.href = "/";
    }
  }, []);

  const deleteUser = useCallback(async () => {
    try {
      EventTracker.track("User deleted");
      await axios.delete("/api/user");
      await signOutAuth();
      dispatch(clearUser());
      localStorage.clear();
    } catch (error: any) {
      Logger.error("Error deleting user", { error });
      dispatch(setError("Failed to delete user"));
      throw error;
    } finally {
      window.location.href = "/";
    }
  }, []);

  return {
    authenticateWithStripe,
    signInWithGoogle,
    signInWithApple,
    signUpWithEmail,
    deleteUser,
    signOut,
    loading,
  };
};

export default useAuth;
