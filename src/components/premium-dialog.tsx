import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { PremiumTable } from "../app/(authenticated)/premium/premiumTable";
import { PremiumFAQ } from "../app/(authenticated)/premium/premiumFAQ";
import { Button } from "@/components/ui/button";

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
          <Button className="text-lg font-extrabold tracking-wide px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            {text}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-[95%] w-full max-w-7xl mx-auto space-y-8 overflow-auto">
        <div className="space-y-16">
          <PremiumTable />
          <PremiumFAQ />
        </div>
      </DialogContent>
    </Dialog>
  );
}
