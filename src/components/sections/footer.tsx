import Image from "next/image";
import React from "react";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;

const Footer = () => {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex flex-row gap-1 items-center">
              <Image src="/logo.png" alt={APP_NAME} width={32} height={32} />
              <h3 className="text-xl font-bold">{APP_NAME}</h3>
            </div>
            <p className="mt-4 text-gray-400">
              Building exceptional digital experiences with dedication and
              expertise.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#why-me"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Why Me
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#flow"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Flow
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Contact</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-gray-400">orelsmail@gmail.com</li>
              <li className="text-gray-400">Schedule a call</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
