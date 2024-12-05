"use client";

import { CheckCircle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NewTokensProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const success = useMemo(() => searchParams.has("success"), [searchParams]);
  const total = useMemo(() => searchParams.get("total"), [searchParams]);
  const tokens = useMemo(() => searchParams.get("tokens"), [searchParams]);

  const handleOpenCheckout = (open: boolean) => {
    if (!open) {
      router.push(pathname);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenCheckout} open={success}>
      <DialogContent>
        <DialogHeader>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <DialogTitle className="text-3xl font-bold">
            <p className="text-2xl">Purchase successful!</p>
          </DialogTitle>
        </DialogHeader>
        {success && (
          <DotLottieReact
            src="/celebration.lottie"
            autoplay
            loop={false}
            className="absolute inset-0 !w-full !h-full mx-auto mb-4 z-20"
          />
        )}
        <p className="text-lg">
          You&apos;ve successfully purchased{" "}
          {new Intl.NumberFormat("en-US").format(parseInt(tokens || "0"))}{" "}
          tokens.
          <br />
          Your total is{" "}
          {new Intl.NumberFormat("en-US").format(parseInt(total || "0"))}.
        </p>
        <DialogFooter className="relative flex justify-center z-20">
          <Button
            size="lg"
            className="w-fit sm:w-auto"
            onClick={() => handleOpenCheckout(false)}
          >
            Let&apos;s Go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
