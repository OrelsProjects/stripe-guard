import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MontserratAlternates } from "@/lib/utils/fonts";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      // Simulate API call
      await axios.post("/api/registerUser", { interestedUser: email });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error registering user", { error });
      toast.error("Something went wrong... 🤔 try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      id="sign-up"
      className="w-full py-48 bg-muted/50 flex flex-col items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {/* Heading and Description */}
      <motion.h1
        className={cn("text-6xl font-bold mb-4 text-primary")}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Get Hooked Now!
      </motion.h1>
      <motion.p
        className={cn(
          "text-lg text-muted-foreground mb-8 text-center max-w-md",
          MontserratAlternates.className,
        )}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Be the first to know when our product launches! <br />
        Sign up for exclusive updates and special deals.
      </motion.p>

      {/* Sign-Up Form */}
      <motion.form
        className={cn(
          "w-96 flex flex-col gap-2",
          MontserratAlternates.className,
        )}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="flex-grow py-6 text-lg"
        />
        <Button
          disabled={isLoading || isSubmitted}
          className="bg-primary text-primary-foreground hover:bg-primary/70 py-5"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isSubmitted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Subscribed!
            </>
          ) : (
            "Register to Free Trial"
          )}
        </Button>
      </motion.form>
    </motion.div>
  );
}
