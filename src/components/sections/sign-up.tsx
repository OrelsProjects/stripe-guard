import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MontserratAlternates } from "@/lib/utils/fonts";
import { motion } from "framer-motion";
import { ArrowRight } from 'lucide-react';
import Link from "next/link";

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
      {/* Heading and Description */}
      <motion.h2
        className={cn("text-4xl md:text-5xl font-bold mb-6 text-center text-primary")}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Ready to Transform Your Payment Operations?
      </motion.h2>
      <motion.p
        className={cn(
          "text-xl text-muted-foreground mb-10 text-center max-w-2xl px-4",
          MontserratAlternates.className,
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Join the growing community of businesses that have optimized their webhook monitoring. 
        Experience the difference in your payment processing and cash flow today.
      </motion.p>

      {/* CTA Button */}
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
          <Link href="/login">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.div>

      {/* Additional Information */}
      <motion.p
        className={cn(
          "mt-8 text-sm text-muted-foreground text-center",
          MontserratAlternates.className,
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Join satisfied users worldwide. No credit card required. 14-day free trial. Cancel anytime.
      </motion.p>
    </motion.div>
  );
}

