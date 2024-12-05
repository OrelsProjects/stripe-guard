"use client";

import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import { useEffect } from "react";

export default function CancelStripe() {
  const router = useCustomRouter();
  useEffect(() => {
    router.push("/dashboard", { preserveQuery: true });
  }, []);
}
