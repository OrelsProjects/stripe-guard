"use client";

import { PremiumDialog } from "@/components/premium-dialog";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/hooks/redux";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const setDidShowPromotion = () => {
  localStorage.setItem("didShowPromotion", "true");
};

const cleanDidShowPromotion = () => {
  localStorage.removeItem("didShowPromotion");
};

const getDidShowPromotion = () => {
  return localStorage.getItem("didShowPromotion");
};

export default function PromotionProvider() {
  const { user } = useAppSelector(state => state.auth);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if ((user?.settings?.plan?.tokensLeft || 0) > 0) {
      cleanDidShowPromotion();
    }
  }, [user]);

  const settings = useMemo(() => user?.settings, [user]);
  const shouldShowPromotion = useMemo(
    () => !getDidShowPromotion() && open,
    [open],
  );
  if (settings && (!settings.plan || settings.plan.tokensLeft <= 0)) {
    return (
      <AnimatePresence mode="popLayout">
        {shouldShowPromotion && (
          <motion.div
            key="promotion"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed top-16 h-16 w-full bg-secondary text-secondary-foreground flex flex-row items-center justify-center gap-4 z-40"
          >
            <p className="text-sm">
              It appears you have no tokens left. Get some to protect your
              revenue!{" "}
            </p>
            {
              <PremiumDialog text="Protect your webhooks">
                <Button className="rounded-full">Get Tokens</Button>
              </PremiumDialog>
            }
            <Button
              variant="link"
              className="absolute right-4"
              onClick={() => {
                setOpen(false);
                setDidShowPromotion();
              }}
            >
              <X className="h-7 w-7 text-secondary-foreground" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}
