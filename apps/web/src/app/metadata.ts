import type { Metadata } from "next";
import env from "./env";

export const OG_URL =
  env.NODE_ENV !== "production" ? "http://localhost:3000" : "https://oghunt.com";

type OpenGraphFunction = () => Promise<Metadata>;

export function generateOGHuntMetadata({
  title,
  description,
  skipOgImage = false,
}: {
  title: string;
  description?: string;
  skipOgImage?: boolean;
}): OpenGraphFunction {
  return async () => {
    const CACHE_DELAY = 30 * 1000;
    const CACHE_INTERVAL = 15 * 60 * 1000;

    const cacheKey = Math.floor((Date.now() - CACHE_DELAY) / CACHE_INTERVAL).toString(16);

    return {
      metadataBase: new URL(OG_URL),
      title,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      description: description,
      keywords: [
        "Product Hunt",
        "AI Projects",
        "Tech Products",
        "Startup Products",
        "Product Discovery",
      ],
      authors: [{ name: "oghunt" }],
      openGraph: {
        title,
        description: description,
        siteName: "oghunt",
        ...(skipOgImage
          ? {}
          : {
              images: [
                {
                  url: `${OG_URL}/api/og/${cacheKey}.png`,
                  width: 1200,
                  height: 630,
                  alt: "oghunt - Product Hunt with ZERO AI Slop",
                },
              ],
            }),
        locale: "en-US",
        type: "website",
        url: OG_URL,
      },
      twitter: {
        card: "summary_large_image",
        title: "oghunt",
        description: description,
        creator: "@oghunt",
        ...(skipOgImage
          ? {}
          : {
              images: [
                {
                  url: `${OG_URL}/api/og/${cacheKey}.png`,
                  width: 1200,
                  height: 630,
                  alt: "oghunt - Product Hunt with ZERO AI Slop",
                },
              ],
            }),
      },
      icons: {
        icon: [
          { url: "/favicon.ico", sizes: "any" },
          { url: "/icon.png", type: "image/png", sizes: "32x32" },
          { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
          { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
        ],
      },
    };
  };
}
