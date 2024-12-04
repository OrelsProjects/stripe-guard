"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function NewSubscriberProvider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const shouldShowWelcome = useMemo(
    () => searchParams.has("welcome"),
    [searchParams],
  );

  const name = useMemo(() => searchParams.get("name"), [searchParams]);

  const handleOpenCheckout = (open: boolean) => {
    if (!open) {
      router.push(pathname);
    }
  };

  return (
    <Dialog open={shouldShowWelcome} onOpenChange={handleOpenCheckout}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <DialogTitle className="text-2xl font-bold">
            Welcome Aboard!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {name ? `Hi ${name},` : "Hello,"} thank you for subscribing! We’re
            thrilled to have you on board.
            <br />
            From now on, you should never worry about a failed webhook.
            <br />
            We got you covered.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mt-6 flex flex-col items-center sm:justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button
            size="lg"
            className="w-fit sm:w-auto"
            onClick={() => {
              handleOpenCheckout(false);
            }}
          >
            Let&apos;s Go!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
