import { getTodaysLaunches } from "@/app/lib/persistence";
import { filterPosts } from "@/app/utils/string";

export async function GET() {
  const allPosts = await getTodaysLaunches();
  const posts = filterPosts(allPosts);

  return Response.json(posts);
}
