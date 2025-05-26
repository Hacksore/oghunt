import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/app/providers";
import { EmailSignUpForm } from "@/components/email-sign-up-form";
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
          {/* Newsletter Section */}
          <section className="w-full py-8 px-4" id="newsletter">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="opacity-60 mb-8">
                Get daily email updates on new products, filtered to show only real innovation.
              </p>
              <EmailSignUpForm />
            </div>
          </section>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
