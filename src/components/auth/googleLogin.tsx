import React from "react";
import useAuth from "@/lib/hooks/useAuth";
import { InvalidCredentialsError } from "@/models/errors/InvalidCredentialsError";
import { toast } from "react-toastify";
import { UnknownUserError } from "@/models/errors/UnknownUserError";
import UserAlreadyExistsError from "@/models/errors/UserAlreadyExistsError";
import Image from "next/image";
import CustomLink from "@/components/customLink";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

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
      toast.promise(signInWithGoogle(), {
        pending: "Signing in...",
      });
    } catch (error: any) {
      if (error instanceof InvalidCredentialsError) {
        toast.error("Invalid credentials");
      } else if (error instanceof UnknownUserError) {
        toast.error("Unknown user");
      } else if (error instanceof UserAlreadyExistsError) {
        toast.error("User already exists");
      } else {
        toast.error("Unknown error");
      }
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
