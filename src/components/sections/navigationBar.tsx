"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
const LOGO = "/logo.png";

export default function NavigationBar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex items-center h-14 justify-between">
        <motion.div
          className="flex items-center gap-2 mr-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image src={LOGO} alt={APP_NAME} width={32} height={32} />
          <span className="text-lg font-semibold">{APP_NAME}</span>
        </motion.div>
        <nav className="flex items-center gap-6 flex-1 justify-end">
          {["Features", "How it Works", "Analytics", "Sign up"].map(
            (item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className={cn({
                  "hidden sm:block":
                    item.toLowerCase() === "how it works" ||
                    item.toLowerCase() === "analytics",
                })}
              >
                <Link
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              </motion.div>
            ),
          )}
        </nav>
        {/* <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        > */}
        {/* <ModeToggle /> */}
        {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="mr-2">
              Log in
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button>Sign up</Button>
          </motion.div> */}
        {/* </motion.div> */}
      </div>
    </motion.header>
  );
}
