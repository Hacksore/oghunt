/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";

import { Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "./component/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a href="#">
          <div className="text-neutral-800 p-2 font-bold text-center text-xs md:text-sm flex items-center justify-center bg-gradient-to-r from-pink-300 to-orange-300">
            <div className="relative h-[24px] w-[24px] md:mr-2">
              <Image src="/logo-128.png" alt="logo" fill sizes="24px" />
            </div>
            We're live on Product Hunt today! Click to show your support!
          </div>
        </a>
        {children}
      </body>
      <Footer />
    </html>
  );
}
