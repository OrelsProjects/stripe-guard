"use client";

import { CheckCircle, X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LottiePlayer from "@/components/lottiePlayer";
import { DialogClose } from "@radix-ui/react-dialog";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";

export default function NewTokensProvider() {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const error = useMemo(() => searchParams.has("error"), [searchParams]);
  const success = useMemo(() => searchParams.has("success"), [searchParams]);
  const total = useMemo(() => searchParams.get("total"), [searchParams]);
  const tokens = useMemo(() => searchParams.get("tokens"), [searchParams]);
  const shouldOnboard = useMemo(
    () => searchParams.has("onboard"),
    [searchParams],
  );

  const handleOpenCheckout = (open: boolean, checkSetup: boolean = true) => {
    if (!open) {
      if (checkSetup && shouldOnboard) {
        router.push("/stripe-setup/api-key");
      } else {
        router.push(pathname);
      }
    }
  };

  return (
    <Dialog
      onOpenChange={open => handleOpenCheckout(open, false)}
      open={success}
    >
      <DialogContent hideCloseButton closeOnOutsideClick={false}>
        <DialogClose className="absolute top-4 right-4 z-30">
          <X className="h-7 w-7 text-muted-foreground" />
        </DialogClose>
        <DialogHeader>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <DialogTitle className="text-3xl font-bold">
            <p className="text-2xl">Purchase successful!</p>
          </DialogTitle>
        </DialogHeader>
        {success && (
          <LottiePlayer
            src="/celebration.lottie"
            autoplay
            loop={false}
            className="absolute inset-0 !w-full !h-full mx-auto mb-4 z-20"
            hideAfterAnimation
          />
        )}
        <p className="text-lg">
          You&apos;ve successfully purchased{" "}
          <strong>
            {new Intl.NumberFormat("en-US").format(parseInt(tokens || "0"))}{" "}
          </strong>
          tokens.
          <br />
          Your total is{" "}
          <strong>
            {new Intl.NumberFormat("en-US").format(parseInt(total || "0"))}.
          </strong>
        </p>
        {shouldOnboard && <p>The last step is to settings up your account.</p>}
        <DialogFooter className="relative flex justify-center z-30">
          <Button
            size="lg"
            className="w-fit sm:w-auto"
            onClick={() => handleOpenCheckout(false)}
          >
            {!shouldOnboard ? "Let's Go!" : "Setup your account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
