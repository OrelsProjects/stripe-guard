/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
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
import { useAppDispatch } from "@/lib/hooks/redux";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import axios from "axios";
import { AppUser, UserSettings } from "@/models/user";
import { Session } from "next-auth";

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
  const [loadingUser, setLoadingUser] = useState(false);

  const loading = useRef(false);

  const setUser = async (data?: Session) => {
    try {
      if (!data) {
        dispatch(setUserAction(null));
        return;
      }

      const settings = await axios.get<UserSettings>("/api/user/settings");

      const { user } = data;
      const appUser: AppUser = {
        id: user.userId,
        name: user.name,
        email: user.email,
        image: user.image,
        settings: settings.data,
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
      setLoadingUser(true);
    }
    if (session?.user) {
      setUser(session);
      try {
        if (pathname.includes("/login")) {
          router.push("/dashboard");
        }
      } catch (error: any) {
        console.error(error);
        router.push("/stripe-setup");
      } finally {
        loading.current = false;
        setLoadingUser(false);
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
        router.push("/");
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
    loadingUser
  ) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loading className="w-20 h-20" />
      </div>
    );
  }

  return children;
}
