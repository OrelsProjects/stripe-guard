"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Shield, ThumbsUp } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useCustomRouter } from "@/lib/hooks/useCustomRouter";
import Confetti from "react-confetti";

export const LAUNCH_PROMO_PARAM = "launch_promo";
export const LAUNCH_PROMO_COMPLETED_PARAM = "launch_promo_completed";

export default function LaunchPromoProvider() {
  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAppSelector(state => state.auth);

  const [openLaunchPromo, setOpenLaunchPromo] = useState(false);
  const [openLaunchPromoCompleted, setOpenLaunchPromoCompleted] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const launchPromo = searchParams.get(LAUNCH_PROMO_PARAM) === "true";
  const launchPromoCompleted =
    searchParams.get(LAUNCH_PROMO_COMPLETED_PARAM) === "true";

  useEffect(() => {
    const isConnected = user?.settings.connected || user?.settings.stripeApiKey;
    const tokens = user?.settings.plan?.tokensLeft;
    if (launchPromo && !isConnected && tokens) {
      setOpenLaunchPromo(true);
    }
  }, [launchPromo, user]);

  useEffect(() => {
    if (launchPromoCompleted) {
      setOpenLaunchPromoCompleted(true);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [launchPromoCompleted]);

  const handleSetupStripe = () => {
    setOpenLaunchPromo(false);
    router.push("/stripe-setup/api-key", {
      preserveQuery: true,
    });
  };

  const handleCloseCompletedDialog = (open?: boolean) => {
    if (open) {
      return;
    }
    setOpenLaunchPromoCompleted(false);
    setShowConfetti(false);
    router.push(pathname, {
      paramsToRemove: [LAUNCH_PROMO_COMPLETED_PARAM],
    });
  };

  return (
    <>
      <Dialog open={openLaunchPromo} onOpenChange={setOpenLaunchPromo}>
        <DialogContent closeOnOutsideClick={false}>
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col gap-8 text-3xl">
                <Logo />
                Welcome!
              </div>
            </DialogTitle>
            <DialogDescription className="text-base">
              You&apos;re one step away from protecting your webhooks.
              <br />
              To get started, you need to set up your Stripe account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSetupStripe}>
              <Shield className="w-4 h-4 mr-2" />
              Set up stripe account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openLaunchPromoCompleted}
        onOpenChange={handleCloseCompletedDialog}
      >
        <DialogContent closeOnOutsideClick={false}>
          {showConfetti && (
            <Confetti
              recycle={false}
              numberOfPieces={600}
              gravity={0.2}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col gap-8 text-3xl">
                {/* <Logo /> */}
                You&apos;re All Set!
              </div>
            </DialogTitle>
            <DialogDescription className="text-base">
              Fantastic! Now your webhooks are protected.
              <br /> You can kick back and relax. If anything goes wrong,
              we&apos;ll let you know right away.
              <br />
              <br />
              <p className="text-sm">
                <strong>P.S.</strong>
                <br />
                You can come back to see your webhooks statistics any time.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => handleCloseCompletedDialog(false)}>
              <ThumbsUp className="w-4 h-4" />
              <span>Got it</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
