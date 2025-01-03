import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MontserratAlternates } from "@/lib/utils/fonts";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

export default function SignUp() {
  return (
    <motion.div
      id="sign-up"
      className="w-full py-24 md:py-32 bg-gradient-to-b from-background to-muted/50 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      <motion.h2
        className={cn(
          "text-4xl md:text-5xl font-bold mb-6 text-center text-primary",
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Ready to Secure Your Revenue?
      </motion.h2>
      <motion.p
        className={cn(
          "text-xl text-muted-foreground mb-10 text-center max-w-2xl px-4",
          MontserratAlternates.className,
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Protect your revenue and keep your customers happy with {APP_NAME}.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
        >
          <Link href="/login?ft=true">
            Start Protecting Your Revenue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
