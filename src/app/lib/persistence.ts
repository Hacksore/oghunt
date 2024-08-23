import {
  convertPostToProductPost,
  getAllPost as getAllDailyPostRightNow,
} from "./data";
import db from "../db";
import { hasAi } from "../utils/string";
import { Post as PostType } from "../types";
import { Prisma } from "@prisma/client";

export async function getTodaysLaunches() {
  const posts = await db.post.findMany({
    where: {
      // only get the posts that are the same day as today
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
    include: {
      topics: true,
    },
  });

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
  }
}

// NOTE: this will get all the posts and persist the data to the database
export async function fetchAndUpdateDatabase() {
  const MAX_PARTITION_SIZE = 50;
  const MAX_CONCURRENCY = 5;

  const postsToCreate = [];
  const postsToUpdate: PostType[] = [];
  const partitioned_create_posts = [];

  const posts = await getAllDailyPostRightNow();

  const existingPosts = (await db.post.findMany({
    select: {
      id: true
    }
  })).reduce((acc, post) => {
    acc[post.id] = true;
    return acc;
  }, {

  } as {
    [key: string]: boolean;
  })

  // TODO: handle errors?

  const allTopics = posts.flatMap(post => post.topics.nodes);





  for (const post of posts) {
    if (existingPosts[post.id]) postsToUpdate.push(post);
    else postsToCreate.push(post)
  }



  while (postsToCreate.length) {
    partitioned_create_posts.push(postsToCreate.splice(0, MAX_PARTITION_SIZE));
  }


  while (partitioned_create_posts.length) {
    const toAdd = partitioned_create_posts.pop();
    if (!toAdd) break;
    await db.post.createMany({
      data: toAdd.map(generateDBPost),
    })
  }




  await db.topic.createMany({

    data: allTopics,
    skipDuplicates: true,
  })



  async function runPostUpdateQueue() {
    while (postsToUpdate.length) {
      const post = postsToUpdate.pop();
      if (!post) break;
      await db.post.update({
        where: {
          id: post.id
        },
        data: generateDBPost(post)
      });
    }

  }


  for (let i = 0; i < MAX_CONCURRENCY; ++i) runPostUpdateQueue();


  const topicPosts = posts.flatMap(post => post.topics.nodes.map(topic => ({
    postId: post.id,
    topicId: topic.id
  })));


  await db.topicPost.createMany({
    data: topicPosts,
    skipDuplicates: true
  })


  return posts;
}
