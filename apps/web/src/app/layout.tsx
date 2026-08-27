import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goodbye from oghunt",
  description: "oghunt has shut down. The hunt continues at bidwatch.app.",
  openGraph: {
    title: "Goodbye from oghunt",
    description: "oghunt has shut down. The hunt continues at bidwatch.app.",
    type: "website",
    images: [
      {
        url: "/base-og.png",
        width: 1200,
        height: 630,
        alt: "Goodbye from oghunt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goodbye from oghunt",
    description: "oghunt has shut down. The hunt continues at bidwatch.app.",
    images: ["/base-og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
