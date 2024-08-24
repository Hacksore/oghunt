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
          <div className="flex items-center justify-center bg-gradient-to-r from-pink-400 to-orange-400 p-2 text-center text-xs font-bold text-black md:text-sm dark:from-pink-300 dark:to-orange-300 dark:text-neutral-800">
            <div className="relative h-[24px] w-[24px] md:mr-2">
              <Image src="/logo-128.png" alt="logo" fill sizes="24px" />
            </div>
            We're live on Product Hunt today! Click to show your support!
          </div>
        </a>
        <a
          href="https://www.linkedin.com/in/rosslitzenberger?utm=oghunt"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 p-4 underline duration-300 hover:font-bold dark:text-white"
        >
          <img width="50" height="50" src="/pizza2.jpeg" alt="pizza" className="rounded-full" />

          <span>🚨 Our lead developer, Ross, is looking for a job. Please hire him! 🚨</span>
        </a>

        {children}
        <Footer />
      </body>
    </html>
  );
}
