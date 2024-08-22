import { getAllPost as getAllDailyPostRightNow } from "./data";
import db from "../db";

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
    }
  });

  return posts.sort((a, b) => b.votesCount - a.votesCount);
}


// NOTE: this will get all the posts and persist the data to the database
export async function fetchAndUpdateDatabase() {
  const posts = await getAllDailyPostRightNow();

  // TODO: we can use lodash to make this more efficient and only get changed/new items

  await Promise.all(
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
          hasAi: false, // hasAi(post)
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
