import type { ProductPost } from "@/app/types";
import { getStartAndEndOfDayInUTC } from "@/app/utils/date";
import { filterPosts } from "@/app/utils/string";
import { toZonedTime } from "date-fns-tz";
import { unstable_cache } from "next/cache";
import { getTodaysLaunches } from "../../lib/launches";

export const dynamic = "force-dynamic";

interface AllCachedPosts {
  allPosts: ProductPost[];
  cache: "HIT" | "MISS";
}

async function getTodaysLaunchesCached(): Promise<AllCachedPosts> {
  const allPosts = await unstable_cache(() => getTodaysLaunches(), ["todaylaunches"], {
    revalidate: 300, // 5 mins to limit db queries
  })();

  if (!allPosts) {
    return {
      allPosts: await getTodaysLaunches(),
      cache: "MISS",
    };
  }

  return {
    allPosts,
    cache: "HIT",
  };
}

export async function GET() {
  const { cache, allPosts } = await getTodaysLaunchesCached();
  const posts = await filterPosts(allPosts);
  const aiPosts = await filterPosts(allPosts, true);

  const { startOfDayUTC, endOfDayUTC } = getStartAndEndOfDayInUTC();
  return Response.json({
    noAiPostCount: posts.length,
    aiPostCount: aiPosts.length,
    allPostCount: allPosts.length,
    timeRange: {
      gte: startOfDayUTC,
      lt: endOfDayUTC,
    },
    currentTimeUtc: toZonedTime(new Date(), "UTC").toISOString(),
    currentTimePST: toZonedTime(new Date(), "America/Los_Angeles").toISOString(),
    currentTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cache,
  });
}
