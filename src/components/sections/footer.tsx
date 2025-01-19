import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION as string;

const Footer = () => {
  return (
    <footer className="bg-muted-foreground/20 text-foreground relative flex flex-col">
      <div className="!text-xs absolute w-full flex justify-center items-center text-foreground/80 gap-1">
        Theme generated with:{" "}
        <Button variant="link" asChild className="!p-0 !text-xs">
          <Link href="https://www.shadcn.studio" target="_blank">
            ShadcnThemes
          </Link>
        </Button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-1">
              <Image src="/favicon.ico" alt={APP_NAME} width={32} height={32} />
              <h3 className="text-xl font-bold">{APP_NAME}</h3>
            </div>
            <p className="mt-4 text-muted-foreground">{APP_DESCRIPTION}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold">Contact</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="mailto:orelsmail@gmail.com"
                  className="text-muted-foreground hover:underline"
                >
                  Contact me
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Footer Bottom */}

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
