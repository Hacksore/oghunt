import { GoogleAnalytics } from "@next/third-parties/google";

import { Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { cn } from "./utils/tw";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*  can i not drive this via the theme somehow */}
      <body
        className={cn(
          inter.className,
          "bg-white",
          "dark:bg-primary",
          "text-black",
          "dark:text-white",
        )}
      >
        <Header />
        {children}
        <Footer />
        <GoogleAnalytics gaId="G-KBEFKRX31G" />
      </body>
    </html>
  );
}
