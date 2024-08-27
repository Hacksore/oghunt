import {
  convertPostToProductPost,
  getAllPost as getAllDailyPostRightNow,
  getAllPostsVotesMoarBetter,
} from "./data";
import db from "../db";
import { hasAi, PRODUCT_HUNT_NAME } from "../utils/string";
import { Post as PostType } from "../types";
import { Prisma } from "@prisma/client";
import { getStartAndEndOfDayInUTC } from "../utils/date";

export async function getTodaysLaunches() {
  const { postedAfter, postedBefore } = getStartAndEndOfDayInUTC();
  const posts = (
    await db.post.findMany({
      where: {
        // only get the posts that are the same day as today
        createdAt: {
          gte: postedAfter,
          lt: postedBefore,
        },
        deleted: false,
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

  return posts.sort((a, b) => b.votesCount - a.votesCount);
}

function generateDBPost(post: PostType): Prisma.PostCreateManyInput {
  return {
    id: post.id,
    votesCount: post.votesCount,
    name: post.name,
    description: post.description,
    tagline: post.tagline,
    url: post.url,
    hasAi: hasAi(convertPostToProductPost(post)),
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
  rawPots.forEach((post) => {
    const maybePost = allVotes["post" + post.id];
    if (maybePost) {
      post.votesCount = allVotes["post" + post.id].votesCount;
      posts.push(post);
    }
  });

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
      data: toAdd.map(generateDBPost),
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
        data: generateDBPost(post),
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
        not: PRODUCT_HUNT_NAME
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

  posts.forEach((post) => {
    totalVotes += post.votesCount;
    if (
      hasAi(
        {
          ...post,
          topics: post.topics.nodes.map((topic) => ({
            id: topic.id,
            description: topic.description,
            name: topic.name,
            postId: post.id,
          })),
        },
        true,
      )
    ) {
      ++aiProjects;
      aiVotes += post.votesCount;
    }
  });

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
    productHuntApiPostsCount: posts.length,
    updatedPostsCount,
    postsToCreateCount: newPosts,
    topicPostsCount: topicPosts.length,
  };
}
