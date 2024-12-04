/* eslint-disable react-hooks/exhaustive-deps */
import { signIn, signOut as signOutAuth } from "next-auth/react";
import { useCallback, useState } from "react";
import {
  clearUser,
  setError,
  updateUserSettings as updateUserSettingsAction,
} from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { EventTracker } from "@/eventTracker";
import { Logger } from "@/logger";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { UserSettings } from "@/models/user";

const useAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    try {
      let redirect = "/dashboard";
      if (searchParams.has("ft")) {
        redirect = "/premium";
      }
      setLoading(true);
      await signIn("google", {
        redirect: true,
        callbackUrl: redirect,
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

  const updateUserSettings = useCallback(
    async (settings: Partial<UserSettings>) => {
      try {
        await axios.patch("/api/user/settings", settings);
        dispatch(updateUserSettingsAction(settings));
      } catch (error: any) {
        Logger.error("Error updating user settings", { error });
        dispatch(setError("Failed to update settings"));
        throw error;
      }
    },
    [],
  );

  return {
    authenticateWithStripe,
    signInWithGoogle,
    signInWithApple,
    signUpWithEmail,
    updateUserSettings,
    deleteUser,
    signOut,
    loading,
  };
};

export default useAuth;
