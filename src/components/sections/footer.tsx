import Image from "next/image";
import React from "react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;

const Footer = () => {
  return (
    <footer className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-1">
              <Image src="/logo.png" alt={APP_NAME} width={32} height={32} />
              <h3 className="text-xl font-bold">{APP_NAME}</h3>
            </div>
            <p className="mt-4 text-muted-foreground">
              Get notified when your Stripe webhooks fail in real time.
            </p>
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
              <li>
                <a
                  href="#analytics"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Analytics
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold">Contact</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="mailto:orelsmail@gmail.com"
                  className="text-muted-foreground hover:underline"
                >
                  orelsmail@gmail.com
                </a>
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
