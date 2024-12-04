"use client";

import React, { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";

export default function PurchaseConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useCustomRouter();
  const pathname = usePathname();

  const name = useMemo(
    () => decodeURI(searchParams.get("name") || ""),
    [searchParams],
  );

  const handleOpenCheckout = (open: boolean) => {
    if (!open) {
      router.push("/dashboard", {
        preserveQuery: true,
        paramsToRemove: ["welcome", "name"],
      });
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col gap-4 items-center justify-center p-4",
      )}
    >
      <Card className="w-full bg-muted max-w-md text-center relative shadow-lg shadow-primary/40">
        <DotLottieReact
          src="/celebration.lottie"
          autoplay
          loop={false}
          className="absolute inset-0 !w-full !h-full mx-auto mb-4 z-20"
        />
        <CardHeader>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">
            <p className="text-2xl">Welcome!</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-xl mb-4">
            {name ? `Hey ${name},` : "Hey there,"} thank you for joining!
            <br /> I&apos;m thrilled to have you.
          </p>
          <p className="text-gray-600 mb-6">
            From now on, you can kick back and forget about missing failed
            webhooks—You&apos;re covered. 🚀
          </p>
        </CardContent>
        <CardFooter className="relative flex justify-center z-20">
          <Button
            size="lg"
            className="w-fit sm:w-auto"
            onClick={() => handleOpenCheckout(false)}
          >
            Let&apos;s Go!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
