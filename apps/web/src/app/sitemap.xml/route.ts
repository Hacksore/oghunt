import { generateSitemaps } from "../sitemap";

export async function GET(): Promise<Response> {
  try {
    // Get sitemap chunks using shared function
    const sitemapChunks = await generateSitemaps();
    const chunks = sitemapChunks.length;

    // Generate sitemap index XML
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(
  { length: chunks },
  (_, i) => `  <sitemap>
    <loc>https://oghunt.com/sitemap-posts-${i}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`,
).join("\n")}
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Sitemap index generation error:", error);

    // Return minimal sitemap index if database fails
    const fallbackSitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://oghunt.com/sitemap-posts-0.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new Response(fallbackSitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300, s-maxage=300", // Shorter cache for fallback
      },
    });
  }
}
