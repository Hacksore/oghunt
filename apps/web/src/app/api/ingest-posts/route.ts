import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import db from "../../db";
import { analyzePosts } from "../../lib/ai-analyzer";
import { convertPostToProductPost, getAllPost, getAllPostsVotesMoarBetter } from "../../lib/data";
import { PRODUCT_HUNT_NAME } from "../../utils/string";

import env from "@/app/env";
import { toZonedTime } from "date-fns-tz";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}` && env.NODE_ENV === "production") {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const MAX_PARTITION_SIZE = 50;
  const postsToCreate = [];
  const postsToUpdate = [];
  const partitionedCreatePosts = [];

  // TODO: rate limit bypass?
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

  // Analyze all posts in one batch
  const postsToAnalyze = posts.map((post) => ({
    ...convertPostToProductPost(post),
    id: post.id,
  }));

  const aiAnalysisResults = await analyzePosts(postsToAnalyze);

  // Create a map of post IDs to their AI analysis results
  const postAiResults = new Map(
    posts.map((post) => [post.id, aiAnalysisResults.get(post.id) ?? false]),
  );

  const existingPostsList = await db.post.findMany({
    select: {
      id: true,
    },
  });

  const existingPosts = existingPostsList.reduce(
    (acc, post) => {
      acc[post.id] = true;
      return acc;
    },
    {} as {
      [key: string]: boolean;
    },
  );

  const allTopics = posts.flatMap((post) => post.topics.nodes);

  for (const post of posts) {
    if (existingPosts[post.id]) postsToUpdate.push(post);
    else postsToCreate.push(post);
  }

  const newPosts = postsToCreate.length;

  while (postsToCreate.length) {
    partitionedCreatePosts.push(postsToCreate.splice(0, MAX_PARTITION_SIZE));
  }

  while (partitionedCreatePosts.length) {
    const toAdd = partitionedCreatePosts.pop();
    if (!toAdd) break;
    await db.post.createMany({
      data: await Promise.all(
        toAdd.map((post) => ({
          id: post.id,
          votesCount: post.votesCount,
          name: post.name,
          description: post.description,
          tagline: post.tagline,
          url: post.url,
          hasAi: postAiResults.get(post.id) ?? false,
          thumbnailUrl: post.thumbnail.url,
          deleted: false,
          createdAt: new Date(post.createdAt),
        })),
      ),
      skipDuplicates: true,
    });
  }

  await db.topic.createMany({
    data: allTopics,
    skipDuplicates: true,
  });

  // Update posts in batches
  const BATCH_SIZE = 50;
  for (let i = 0; i < postsToUpdate.length; i += BATCH_SIZE) {
    const batch = postsToUpdate.slice(i, i + BATCH_SIZE);
    await db.$transaction(
      batch.map((post) =>
        db.post.update({
          where: { id: post.id },
          data: {
            votesCount: post.votesCount,
            name: post.name,
            description: post.description,
            tagline: post.tagline,
            url: post.url,
            hasAi: postAiResults.get(post.id) ?? false,
            thumbnailUrl: post.thumbnail.url,
            deleted: false,
          },
        }),
      ),
    );
  }

  const updatedPostsCount = postsToUpdate.length;

  const topicPosts = posts.flatMap((post) =>
    post.topics.nodes.map((topic) => ({
      postId: post.id,
      topicId: topic.id,
    })),
  );

  await db.topicPost.createMany({
    data: topicPosts,
    skipDuplicates: true,
  });

  await db.post.updateMany({
    where: {
      name: {
        not: PRODUCT_HUNT_NAME,
      },
      id: {
        notIn: posts.map((post) => post.id),
      },
      deleted: false,
    },
    data: {
      deleted: true,
    },
  });

  revalidatePath("/api/list");

  return Response.json({
    success: true,
    newPosts,
    updatedPostsCount,
  });
}
