import { GoogleAnalytics } from "@next/third-parties/google";

import { Inter } from "next/font/google";
import "./globals.css";

import { Footer } from "./component/footer";
import { Header } from "./component/header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        <GoogleAnalytics gaId="G-KBEFKRX31G" />
      </body>
    </html>
  );
}
