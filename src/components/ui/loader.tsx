import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className={cn("w-8 h-8 animate-spin text-primary", className)} />
    </div>
  );
}
