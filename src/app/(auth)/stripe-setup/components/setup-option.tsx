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
      className="bg-card rounded-2xl shadow-lg shadow-primary/5 p-8 border border-border/50"
    >
      <div className={`${iconClassName} p-4 rounded-xl inline-block mb-6`}>
        <Icon className="w-8 h-8 text-primary" />
      </div>

      <h2 className="text-xl font-semibold mb-4 text-foreground">{title}</h2>

      <p className="text-muted-foreground mb-6">{description}</p>

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
