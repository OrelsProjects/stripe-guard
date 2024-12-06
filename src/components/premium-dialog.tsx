import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { PremiumTable } from "../app/(authenticated)/premium/premiumTable";
import { PremiumFAQ } from "../app/(authenticated)/premium/premiumFAQ";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function PremiumDialog({
  text,
  children,
}: {
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild className="h-fit">
        {children || (
          <Button className="text-lg font-semibold tracking-wide px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            {text}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        hideCloseButton
        className="h-[95%] w-full max-w-7xl mx-auto space-y-8 overflow-auto"
      >
        <DialogClose className="absolute top-4 right-4 z-30">
          <X className="h-7 w-7 text-muted-foreground" />
        </DialogClose>
        <div className="space-y-16">
          <PremiumTable />
          <PremiumFAQ />
        </div>
      </DialogContent>
    </Dialog>
  );
}
