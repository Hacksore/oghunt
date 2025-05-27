"use server";

import type { Prisma } from "@prisma/client";
import db from "../db";
import type { Post as PostType } from "../types";
import { getStartAndEndOfDayInUTC } from "../utils/date";
import { PRODUCT_HUNT_NAME } from "../utils/string";
import { analyzePosts } from "./ai-analyzer";
import {
  convertPostToProductPost,
  getAllPost as getAllDailyPostRightNow,
  getAllPostsVotesMoarBetter,
} from "./data";

export async function getYesterdaysLaunches() {
  // Get current date in UTC
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  console.log('Today:', today.toISOString());
  console.log('Yesterday:', yesterday.toISOString());
  
  const { startOfDayUTC, endOfDayUTC } = getStartAndEndOfDayInUTC(yesterday);

  console.log('Query time range:', {
    startOfDayUTC,
    endOfDayUTC,
    startDate: new Date(startOfDayUTC).toISOString(),
    endDate: new Date(endOfDayUTC).toISOString()
  });

  const posts = await db.post.findMany({
    where: {
      createdAt: {
        gte: startOfDayUTC,
        lt: endOfDayUTC,
      },
      deleted: false,
      hasAi: false,
    },
    orderBy: {
      votesCount: "desc",
    },
  });

  console.log('Found posts:', posts.length);
  return posts;
}

export async function getTodaysLaunches(hasAi?: boolean) {
  const { startOfDayUTC, endOfDayUTC } = getStartAndEndOfDayInUTC();
  const posts = (
    await db.post.findMany({
      where: {
        // only get the posts that are the same day as today
        createdAt: {
          gte: startOfDayUTC,
          lt: endOfDayUTC,
        },
        deleted: false,
        ...(hasAi !== undefined && { hasAi }),
      },
      include: {
        topics: {
          select: {
            Topic: true,
          },
        },
      },
    })
  ).map((post) => ({
    ...post,
    topics: post.topics.map((topic) => topic.Topic),
  }));

  // TODO: why dont we stort in the db?
  return posts.sort((a, b) => b.votesCount - a.votesCount);
}

async function generateDBPost(
  post: PostType,
  isAiRelated: boolean,
): Promise<Prisma.PostCreateManyInput> {
  return {
    id: post.id,
    votesCount: post.votesCount,
    name: post.name,
    description: post.description,
    tagline: post.tagline,
    url: post.url,
    hasAi: isAiRelated,
    thumbnailUrl: post.thumbnail.url,
    deleted: false,
  };
}

// NOTE: this will get all the posts and persist the data to the database
export async function fetchAndUpdateDatabase() {
  const MAX_PARTITION_SIZE = 50;
  const MAX_CONCURRENCY = 5;

  const postsToCreate = [];
  const postsToUpdate: PostType[] = [];
  const partitionedCreatePosts = [];

  const rawPots = await getAllDailyPostRightNow();
  const allVotes = await getAllPostsVotesMoarBetter(rawPots.map((post) => post.id));

  const posts: PostType[] = [];
  // NOTE : fix the fucking graphql api
  for (const post of rawPots) {
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

  // TODO: handle errors?
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
        toAdd.map((post) => generateDBPost(post, postAiResults.get(post.id) ?? false)),
      ),
      skipDuplicates: true,
    });
  }

  await db.topic.createMany({
    data: allTopics,
    skipDuplicates: true,
  });

  const promises = [];

  const updatedPostsCount = postsToUpdate.length;

  async function runPostUpdateQueue() {
    while (postsToUpdate.length) {
      const post = postsToUpdate.pop();
      if (!post) break;
      await db.post.update({
        where: {
          id: post.id,
        },
        data: await generateDBPost(post, postAiResults.get(post.id) ?? false),
      });
    }
  }

  for (let i = 0; i < MAX_CONCURRENCY; ++i) promises.push(runPostUpdateQueue());

  await Promise.all(promises);

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

  const totalProjects = posts.length;
  let totalVotes = 0;

  let aiProjects = 0;
  let aiVotes = 0;

  for (const post of posts) {
    totalVotes += post.votesCount;
    if (postAiResults.get(post.id)) {
      ++aiProjects;
      aiVotes += post.votesCount;
    }
  }

  const aiVotesPercentage = aiVotes / totalVotes;
  const aiProjectsPercentage = aiProjects / totalProjects;

  await db.metric.create({
    data: {
      totalProjects,
      totalVotes,
      aiVotesPercentage,
      aiProjectsPercentage,
    },
  });

  return {
    newPosts,
    updatedPostsCount,
    totalProjects,
    totalVotes,
    aiProjects,
    aiVotes,
    aiVotesPercentage,
    aiProjectsPercentage,
  };
}

