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

export async function generateSitemaps() {
  // Get total count of non-deleted posts with optimized query
  const totalPosts = await db.post.count({
    where: {
      deleted: false,
    },
  });

  // Calculate number of sitemap chunks needed (50k per chunk for better performance)
  // Google's limit is 50,000 URLs per sitemap, so we can safely use this
  const CHUNK_SIZE = 50000;
  const totalChunks = Math.ceil(totalPosts / CHUNK_SIZE);

  // Return array of sitemap IDs
  return Array.from({ length: totalChunks }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const CHUNK_SIZE = 50000;
  const skip = id * CHUNK_SIZE;

  // Optimized query - only select minimal fields needed for sitemap
  const posts = await db.post.findMany({
    where: {
      deleted: false,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc", // Most recent first
    },
    skip,
    take: CHUNK_SIZE,
  });

  // Create sitemap entries for posts with optimized URL generation
  const postUrls = posts.map((post) => ({
    url: `https://oghunt.com/view/${post.id}-${escapeXml(post.name.toLowerCase().replace(/\s+/g, "-"))}`,
    lastModified: post.createdAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // For the first sitemap (id: 0), include static pages
  if (id === 0) {
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
      {
        url: "https://oghunt.com/slop",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: "https://oghunt.com/ai",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
      ...postUrls,
    ];
  }

  // For other chunks, only return posts
  return postUrls;
}
