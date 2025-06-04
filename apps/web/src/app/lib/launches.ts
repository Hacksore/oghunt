"use server";

import db from "../db";
import { getDayRange } from "../utils/date";

export async function getYesterdaysLaunches() {
  // Get current date in UTC
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const { startOfDayUTC, endOfDayUTC } = getDayRange(yesterday);

  const posts = await db.post.findMany({
    where: {
      createdAt: {
        gte: new Date(startOfDayUTC),
        lt: new Date(endOfDayUTC),
      },
      deleted: true,
      hasAi: false,
    },
    orderBy: {
      votesCount: "desc",
    },
  });

  return posts;
}

export async function getTodaysLaunches(hasAi?: boolean) {
  const { startOfDayUTC, endOfDayUTC } = getDayRange(new Date());
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
