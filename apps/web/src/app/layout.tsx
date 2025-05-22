import { GoogleAnalytics } from "@next/third-parties/google";

import { Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "./component/footer";
import { Header } from "./component/header";
import { cn } from "./utils/tw";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-primary")}>
        <Header />
        {children}
        <Footer />
        <GoogleAnalytics gaId="G-KBEFKRX31G" />
      </body>
    </html>
  );
}
