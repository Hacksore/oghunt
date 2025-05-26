"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      {children}
      <Analytics />
      <GoogleAnalytics gaId="G-KBEFKRX31G" />
    </ThemeProvider>
  );
}
