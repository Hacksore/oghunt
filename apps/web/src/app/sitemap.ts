import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
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

// Cached function to get total post count (6 hours cache)
const getCachedPostCount = unstable_cache(
  async () => {
    return await db.post.count({
      where: {
        deleted: false,
      },
    });
  },
  ["post-count"],
  {
    revalidate: 6 * 60 * 60, // 6 hours in seconds
    tags: ["posts"],
  }
);

// Cached function to get posts for a specific chunk (6 hours cache)
const getCachedPosts = unstable_cache(
  async (chunkId: number, chunkSize: number) => {
    const skip = chunkId * chunkSize;
    
    return await db.post.findMany({
      where: {
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: chunkSize,
    });
  },
  ["posts-chunk"],
  {
    revalidate: 6 * 60 * 60, // 6 hours in seconds
    tags: ["sitemap-posts"],
  }
);

export async function generateSitemaps() {
  // Get total count of non-deleted posts with caching
  const totalPosts = await getCachedPostCount();

  // Calculate number of sitemap chunks needed (50k per chunk for better performance)
  // Google's limit is 50,000 URLs per sitemap, so we can safely use this
  const CHUNK_SIZE = 50000;
  const totalChunks = Math.ceil(totalPosts / CHUNK_SIZE);

  // Return array of sitemap IDs
  return Array.from({ length: totalChunks }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const CHUNK_SIZE = 50000;

  // Get posts for this chunk using cached query
  const posts = await getCachedPosts(id, CHUNK_SIZE);

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
