import { generateSitemapIndex, STATIC_PAGES } from "../lib/sitemap-helpers";
import { generateSitemaps } from "../sitemap";

export async function GET(): Promise<Response> {
  try {
    // Get sitemap chunks using shared function
    const sitemapChunks = await generateSitemaps();
    const chunks = sitemapChunks.length;

    // Convert static pages to sitemap entries format
    const staticEntries = STATIC_PAGES.map((page) => ({
      loc: page.url,
      lastmod: page.lastModified.toISOString(),
      priority: page.priority,
    }));

    // Create sitemap entries for dynamic chunks
    const dynamicEntries = Array.from({ length: chunks }, (_, i) => ({
      loc: `https://oghunt.com/sitemap/${i}.xml`,
      lastmod: new Date().toISOString(),
      priority: 0.5, // Default priority for dynamic sitemap chunks
    }));

    // Combine all sitemap entries (static first, then dynamic)
    const allEntries = [...staticEntries, ...dynamicEntries];

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
    const fallbackStaticEntries = STATIC_PAGES.map((page) => ({
      loc: page.url,
      lastmod: page.lastModified.toISOString(),
      priority: page.priority,
    }));

    const fallbackEntries = [
      ...fallbackStaticEntries,
      {
        loc: "https://oghunt.com/sitemap/0.xml",
        lastmod: new Date().toISOString(),
        priority: 0.5, // Default priority for dynamic sitemap chunks
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
