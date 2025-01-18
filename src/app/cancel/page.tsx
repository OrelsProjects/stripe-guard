"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { useEffect } from "react";

export default function CancelStripe() {
  const router = useCustomRouter();
  const { state } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (state === "authenticated") {
      router.push("/dashboard", { preserveQuery: true });
    } else {
      router.push("/");
    }
  }, [state]);
}
