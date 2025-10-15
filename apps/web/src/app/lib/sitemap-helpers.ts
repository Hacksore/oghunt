// Helper functions for generating XML sitemaps

export interface SitemapEntry {
  loc: string;
  lastmod: string;
}

export interface StaticPage {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
}

// Generate XML for a single sitemap entry
export function generateSitemapEntry(entry: SitemapEntry): string {
  return `  <sitemap>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </sitemap>`;
}

// Generate XML for a single URL entry
export function generateUrlEntry(page: StaticPage): string {
  return `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
}

// Generate complete sitemap index XML
export function generateSitemapIndex(entries: SitemapEntry[]): string {
  const sitemapEntries = entries.map(generateSitemapEntry).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
}

// Generate complete sitemap XML for URLs
export function generateSitemap(pages: StaticPage[]): string {
  const urlEntries = pages.map(generateUrlEntry).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

// Static pages configuration
export const STATIC_PAGES: StaticPage[] = [
  {
    url: "https://oghunt.com",
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 1,
  },
  {
    url: "https://oghunt.com/list",
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 1,
  },
  {
    url: "https://oghunt.com/ai",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: "https://oghunt.com/homies",
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
];
