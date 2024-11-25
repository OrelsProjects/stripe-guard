"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import * as toast from "react-toastify";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" {...props}>
      <div className="relative z-[51]">
        <toast.ToastContainer
          stacked
          newestOnTop
          theme={resolvedTheme}
          autoClose={2500}
          draggablePercent={60}
          className="!mb-16 z-[51]"
          transition={toast.Flip}
          position="bottom-center"
          pauseOnHover={false}
        />
      </div>
      {children}
    </NextThemesProvider>
  );
}
