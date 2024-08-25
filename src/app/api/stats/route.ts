import { unstable_cache } from "next/cache";
import { getTodaysLaunches } from "../../lib/persistence";
import { filterPosts } from "@/app/utils/string";
import { getStartAndEndOfDayInUTC } from "@/app/utils/date";

export const dynamic = "force-dynamic";

async function getTodaysLaunchesCached() {
  const cachedVal = await unstable_cache(() => getTodaysLaunches(), ["todaylaunches"], {
    revalidate: 900, // 15 minutes
  })();

  if (!cachedVal) return await getTodaysLaunches();
  return cachedVal;
}

export async function GET() {
  const allPosts = await getTodaysLaunches();
  const posts = filterPosts(allPosts);
  const aiPosts = filterPosts(allPosts, true);

  const { postedAfter, postedBefore } = getStartAndEndOfDayInUTC();
  return Response.json({
    noAiPostCount: posts.length,
    aiPostCount: aiPosts.length,
    allPostCount: allPosts.length,
    timeRange: {
      gte: postedAfter,
      lt: postedBefore,
    },
    currentTimeUtc: new Date().toUTCString(),
    currentTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}
