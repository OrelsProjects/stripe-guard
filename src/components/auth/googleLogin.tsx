import React from "react";
import useAuth from "@/lib/hooks/useAuth";
import { InvalidCredentialsError } from "@/models/errors/InvalidCredentialsError";
import { toast } from "react-toastify";
import { UnknownUserError } from "@/models/errors/UnknownUserError";
import UserAlreadyExistsError from "@/models/errors/UserAlreadyExistsError";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { EventTracker } from "@/eventTracker";

interface GoogleLoginProps {
  className?: string;
  signInTextPrefix?: string;
}

export default function GoogleLogin({
  className,
  signInTextPrefix,
}: GoogleLoginProps) {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      EventTracker.track("google_sign_in_attempt");
      await toast.promise(signInWithGoogle(), {
        pending: "Signing in...",
      });
      EventTracker.track("google_sign_in_success");
    } catch (error: any) {
      if (error instanceof InvalidCredentialsError) {
        EventTracker.track("google_sign_in_error", { type: "invalid_credentials" });
        toast.error("Invalid credentials");
      } else if (error instanceof UnknownUserError) {
        EventTracker.track("google_sign_in_error", { type: "unknown_user" });
        toast.error("Unknown user");
      } else if (error instanceof UserAlreadyExistsError) {
        EventTracker.track("google_sign_in_error", { type: "user_exists" });
        toast.error("User already exists");
      } else {
        EventTracker.track("google_sign_in_error", { type: "unknown" });
        toast.error("Unknown error");
      }
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
      <Button
        onClick={handleGoogleLogin}
        className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-3 py-6"
      >
        {loading && <Loader />}
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          fill
          className="!relative !w-5 !h-5"
        />
        Continue with Google
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}
