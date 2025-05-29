import { generateSitemaps } from "../sitemap";

export async function GET() {
  const sitemaps = await generateSitemaps();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
    .map(
      (sitemap) => `
  <sitemap>
    <loc>${sitemap.url}</loc>
    <lastmod>${sitemap.lastModified.toISOString()}</lastmod>
  </sitemap>`,
    )
    .join("")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
