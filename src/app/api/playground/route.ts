import { getAllPost, getAllPostsVotesMoarBetter } from "@/app/lib/data";

export const dynamic = "force-dynamic";

// NOTE: this is called on cron job
export async function GET() {
  const allPosts = await getAllPost();
  const allVotes = await getAllPostsVotesMoarBetter(allPosts.map((post) => post.id));

  allPosts.forEach((post) => {
    post.votesCount = allVotes["post" + post.id].votesCount;
  });

  return Response.json({ success: true, allPosts });
}
