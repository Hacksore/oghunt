import { getTodaysLaunches } from "../../lib/persistence";
import { filterPosts } from "@/app/utils/string";

export const dynamic = "force-dynamic";

// TODO : needs caching
export async function GET() {
  const allPosts = await getTodaysLaunches();
  const posts = filterPosts(allPosts);
  const aiPosts = filterPosts(allPosts, true);

  return Response.json({
    noAiPostCount: posts.length,
    aiPostCount: aiPosts.length,
    allPostCount: allPosts.length,
  });
}
