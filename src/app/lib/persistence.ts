import {
  convertPostToProductPost,
  getAllPost as getAllDailyPostRightNow,
} from "./data";
import db from "../db";
import { hasAi } from "../utils/string";

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

// NOTE: this will get all the posts and persist the data to the database
export async function fetchAndUpdateDatabase() {
  const posts = await getAllDailyPostRightNow();

  // TODO: we can use lodash to make this more efficient and only get changed/new items

  // TODO: handle errors?
  await Promise.allSettled(
    posts.map((post) =>
      db.post.upsert({
        where: {
          id: post.id,
        },
        update: {
          votesCount: post.votesCount,
          name: post.name,
          description: post.description,
          tagline: post.tagline,
          url: post.url,
          thumbnailUrl: post.thumbnail.url,
          topics: {
            connectOrCreate: post.topics.nodes.map(
              ({ id, description, name }) => ({
                where: {
                  id,
                },
                create: {
                  id,
                  description,
                  name,
                },
              }),
            ),
          },
        },
        create: {
          id: post.id,
          votesCount: post.votesCount,
          name: post.name,
          description: post.description,
          tagline: post.tagline,
          url: post.url,
          hasAi: hasAi(convertPostToProductPost(post)),
          thumbnailUrl: post.thumbnail.url,
          topics: {
            connectOrCreate: post.topics.nodes.map(
              ({ id, description, name }) => ({
                where: {
                  id,
                },
                create: {
                  id,
                  description,
                  name,
                },
              }),
            ),
          },
        },
      }),
    ),
  );

  return posts;
}
