import { unstable_cache } from "next/cache";
import { getTodaysLaunches } from "../../lib/persistence";
import { filterPosts } from "@/app/utils/string";

export const dynamic = "force-dynamic";


const getTodaysLaunchesCached = unstable_cache(()=>getTodaysLaunches(), ["todaylaunches"], {
  revalidate: 900
});

export async function GET() {
  const allPosts = await getTodaysLaunchesCached();
  const posts = filterPosts(allPosts);
  const aiPosts = filterPosts(allPosts, true);

  return Response.json({
    noAiPostCount: posts.length,
    aiPostCount: aiPosts.length,
    allPostCount: allPosts.length,
  });
}
