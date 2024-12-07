"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import * as toast from "react-toastify";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      defaultTheme="light"
      {...props}
    >
      <div className="relative z-[51]">
        <toast.ToastContainer
          stacked
          newestOnTop
          // theme={resolvedTheme === "dark" ? "light" : "dark"}
          theme="light"
          autoClose={2500}
          draggablePercent={60}
          className="!mb-16 z-[51]"
        />
      </div>
      {children}
    </NextThemesProvider>
  );
}
