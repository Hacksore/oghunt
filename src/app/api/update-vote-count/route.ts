import type { NextRequest } from "next/server";
import { getAllPost, getAllPostsVotesMoarBetter } from "../../lib/data";
import db from "../../db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const rawPosts = await getAllPost();
  const allVotes = await getAllPostsVotesMoarBetter(rawPosts.map((post) => post.id));

  const posts = [];
  for (const post of rawPosts) {
    const maybePost = allVotes[`post${post.id}`];
    if (maybePost) {
      post.votesCount = allVotes[`post${post.id}`].votesCount;
      posts.push(post);
    }
  }

  let updatedCount = 0;
  for (const post of posts) {
    await db.post.update({
      where: {
        id: post.id,
      },
      data: {
        votesCount: post.votesCount,
      },
    });
    updatedCount++;
  }

  return Response.json({ 
    success: true, 
    updatedCount,
  });
} 