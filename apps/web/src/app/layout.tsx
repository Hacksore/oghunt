import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/app/providers";
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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
