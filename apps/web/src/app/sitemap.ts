import type { MetadataRoute } from "next";
import db from "./db";

// Function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all non-deleted projects from the database
  const projects = await db.post.findMany({
    where: {
      deleted: false,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  // Create sitemap entries for each project
  const projectUrls = projects.map((project) => ({
    url: `https://oghunt.com/view/${project.id}-${escapeXml(project.name.toLowerCase().replace(/\s+/g, "-"))}`,
    lastModified: project.createdAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Add static pages
  return [
    {
      url: "https://oghunt.com",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: "https://oghunt.com/homies",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...projectUrls,
  ];
}
