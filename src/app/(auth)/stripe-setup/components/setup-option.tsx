import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

interface SetupOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  variant?: "default" | "outline";
  iconClassName?: string;
  delay?: number;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function SetupOption({
  icon: Icon,
  title,
  description,
  buttonText,
  loading,
  variant = "default",
  iconClassName = "bg-primary/10",
  delay = 0,
  onClick,
  disabled,
}: SetupOptionProps) {
  return (
    <motion.div
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className="h-full flex flex-col justify-between bg-card rounded-2xl shadow-lg shadow-primary/5 p-8 border border-border/50"
    >
      <div className="space-y-6 mb-4">
        <div className={`${iconClassName} p-4 rounded-xl inline-block`}>
          <Icon className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-xl font-semibold text-foreground">{title}</h2>

        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button
        variant={variant}
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2"
        disabled={loading || disabled}
      >
        {loading && <Loader className="text-foreground" />}
        {buttonText}
      </Button>
    </motion.div>
  );
}
