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
  },
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
  },
);

export async function generateSitemaps() {
  try {
    // Get total count of non-deleted posts with caching
    const totalPosts = await getCachedPostCount();

    // Calculate number of sitemap chunks needed (50k per chunk for better performance)
    // Google's limit is 50,000 URLs per sitemap, so we can safely use this
    const CHUNK_SIZE = 50000;
    const totalChunks = Math.ceil(totalPosts / CHUNK_SIZE);

    // Always return at least one chunk (for static pages), plus additional chunks for posts
    const chunks = Math.max(1, totalChunks);
    return Array.from({ length: chunks }, (_, i) => ({ id: i }));
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return at least one sitemap chunk if database fails
    return [{ id: 0 }];
  }
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const CHUNK_SIZE = 50000;

  try {
    // Get posts for this chunk using cached query
    const posts = await getCachedPosts(id, CHUNK_SIZE);

    // Create sitemap entries for posts with optimized URL generation
    const postUrls = posts.map((post) => ({
      url: `https://oghunt.com/view/${post.id}-${escapeXml(post.name.toLowerCase().replace(/\s+/g, "-"))}`,
      lastModified: post.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    // All chunks now only contain posts (static pages are in separate sitemap)
    return postUrls;
  } catch (error) {
    console.error("Sitemap generation error:", error);
    // Return empty sitemap if database fails (static pages are handled separately)
    return [];
  }
}
