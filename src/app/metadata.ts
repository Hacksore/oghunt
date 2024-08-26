import type { Metadata } from "next";

export const OG_URL =
  process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "https://oghunt.com";

export const tagline = "Product Hunt with ZERO AI Slop™";

// TODO: this should just programmatically update when the data is refetched
const OG_CACHE_KEY = "v3";

export const baseMetadata: Metadata = {
  metadataBase: new URL(OG_URL),
  title: {
    default: "OGHUNT",
    template: "%s",
  },
  robots: {
    index: true,
    follow: true,
  },
  description: tagline,
  openGraph: {
    title: "OGHUNT",
    description: tagline,
    siteName: "OGHUNT",
    images: [
      {
        url: `${OG_URL}/api/og?c=${OG_CACHE_KEY}`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    title: "OGHUNT",
    card: "summary_large_image",
    images: [
      {
        url: `${OG_URL}/api/og?c=${OG_CACHE_KEY}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    shortcut: "/favicon.ico",
  },
};

const buildMeta = ({
  ogImageUrl,
  description,
  title,
}: {
  ogImageUrl: string;
  description?: string;
  title?: string;
}): Metadata => {
  baseMetadata.openGraph!.images = ogImageUrl;
  baseMetadata.twitter!.images = ogImageUrl;

  if (description) {
    baseMetadata.description = description;
    baseMetadata.twitter!.description = description;
    baseMetadata.openGraph!.description = description;
  }

  if (title) {
    baseMetadata.title = title;
    baseMetadata.twitter!.title = title;
    baseMetadata.openGraph!.title = title;
  }

  return baseMetadata;
};

/** Helper to build opengraph metadata with defaults, you should call this in generateMetadata() next function */
export const createMeta = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}): Metadata => {
  return buildMeta({
    ogImageUrl: `${OG_URL}/api/og?c=${OG_CACHE_KEY}`,
    title,
    description,
  });
};

export default baseMetadata;
