import { generateSitemaps } from "../sitemap";
import { generateSitemapIndex } from "../lib/sitemap-helpers";

export async function GET(): Promise<Response> {
  try {
    // Get sitemap chunks using shared function
    const sitemapChunks = await generateSitemaps();
    const chunks = sitemapChunks.length;

    // Create sitemap entries for dynamic chunks
    const dynamicEntries = Array.from({ length: chunks }, (_, i) => ({
      loc: `https://oghunt.com/sitemap${i}.xml`,
      lastmod: new Date().toISOString(),
    }));

    // Create sitemap entry for static pages
    const staticEntry = {
      loc: "https://oghunt.com/sitemap-static.xml",
      lastmod: new Date().toISOString(),
    };

    // Combine all sitemap entries
    const allEntries = [staticEntry, ...dynamicEntries];

    // Generate sitemap index XML using helper
    const sitemapIndex = generateSitemapIndex(allEntries);

    return new Response(sitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Sitemap index generation error:", error);

    // Return minimal sitemap index if database fails
    const fallbackEntries = [
      {
        loc: "https://oghunt.com/sitemap-static.xml",
        lastmod: new Date().toISOString(),
      },
      {
        loc: "https://oghunt.com/sitemap0.xml",
        lastmod: new Date().toISOString(),
      },
    ];

    const fallbackSitemapIndex = generateSitemapIndex(fallbackEntries);

    return new Response(fallbackSitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, s-maxage=300", // Shorter cache for fallback
      },
    });
  }
}
