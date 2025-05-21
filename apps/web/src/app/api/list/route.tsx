import { getTodaysLaunches } from "@/app/lib/persistence";
import { filterPosts } from "@/app/utils/string";
import { unstable_cache } from "next/cache";

// NOTE: this function will try to cache the result for 15 minutes
// however, we can revalidate it from both the update-vote-count and ingest-posts routes
export async function GET() {
  const allPosts = await unstable_cache(() => getTodaysLaunches(), ["api-today-launches"], {
    // revalidate every 15 minutes
    revalidate: 900,
  })();
  const posts = await filterPosts(allPosts);

  return Response.json(posts);
}
