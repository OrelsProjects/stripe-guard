/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  selectAuth,
  setUser as setUserAction,
} from "@/lib/features/auth/authSlice";
import { usePathname } from "next/navigation";
import Loading from "@/components/ui/loading";
import { setUserEventTracker } from "@/eventTracker";
import { setUserLogger } from "@/logger";
import { useSession } from "next-auth/react";
import AppUser from "@/models/appUser";
import { useAppDispatch } from "@/lib/hooks/redux";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import axios from "axios";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useCustomRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useSelector(selectAuth);
  const { data: session, status } = useSession();

  const loading = useRef(false);

  const setUser = (user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    userId?: string | null;
  }) => {
    try {
      const appUser: AppUser = {
        displayName: user?.name || null,
        email: user?.email || "",
        photoURL: user?.image || null,
        userId: user?.userId || "",
        settings: {
          showNotifications: true,
        },
      };
      dispatch(setUserAction(appUser));
    } catch (error: any) {
      console.error(error);
      dispatch(setUserAction(null));
    }
  };

  const handleUserAuthentication = async () => {
    if (loading.current) {
      return;
    }
    const isInOnboarding = pathname.includes("api-key");

    if (!isInOnboarding) {
      loading.current = true;
    }

    if (session?.user) {
      setUser(session.user);
      try {
        const isUserOnboarded = await axios.get<boolean>(
          "/api/stripe/user/onboarded",
        ); // Did the user provide Stripe details

        if (!isUserOnboarded.data) {
          if (!isInOnboarding) {
            router.push("/stripe-setup");
          }
        } else {
          router.push("/dashboard");
        }
      } catch (error: any) {
        console.error(error);
        router.push("/stripe-setup");
      } finally {
        loading.current = false;
      }
    }
  };

  useEffect(() => {
    switch (status) {
      case "authenticated":
        handleUserAuthentication();
        break;
      case "loading":
        break;
      case "unauthenticated":
        setUser(undefined);
        break;
      default:
        break;
    }
  }, [status]);

  useEffect(() => {
    setUserEventTracker(currentUser);
    setUserLogger(currentUser);
  }, [currentUser]);

  if (
    (status === "loading" &&
      !pathname.includes("login") &&
      !pathname.includes("stripe-setup")) ||
    loading.current
  ) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading className="w-20 h-20" />
      </div>
    );
  }

  return children;
}
