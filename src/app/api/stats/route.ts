import { unstable_cache } from "next/cache";
import { getTodaysLaunches } from "../../lib/persistence";
import { filterPosts } from "@/app/utils/string";

export const dynamic = "force-dynamic";

async function getTodaysLaunchesCached() {
  const cachedVal = await unstable_cache(() => getTodaysLaunches(), ["todaylaunches"], {
    revalidate: 900, // 15 minutes
  })();

  if (!cachedVal) return await getTodaysLaunches();
  return cachedVal;
}

export async function GET() {
  const allPosts = await getTodaysLaunchesCached();
  const posts = filterPosts(allPosts);
  const aiPosts = filterPosts(allPosts, true);

  return Response.json({
    noAiPostCount: posts.length,
    aiPostCount: aiPosts.length,
    allPostCount: allPosts.length,
    timeRange: {
      gte: new Date(new Date().setHours(0, 0, 0, 0)),
      lt: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });
}
