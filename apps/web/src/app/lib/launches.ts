"use server";

import db from "../db";
import { getStartAndEndOfDayInUTC } from "../utils/date";

export async function getYesterdaysLaunches() {
  // Get current date in UTC
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const { startOfDayUTC, endOfDayUTC } = getStartAndEndOfDayInUTC(yesterday);

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

interface GetTodaysLaunchesParams {
  hasAi?: boolean;
  page?: number;
  pageSize?: number;
}

export async function getTodaysLaunches({ hasAi, page = 1, pageSize = 10 }: GetTodaysLaunchesParams = {}) {
  const { startOfDayUTC, endOfDayUTC } = getStartAndEndOfDayInUTC();
  
  // Get total count first
  const totalCount = await db.post.count({
    where: {
      createdAt: {
        gte: startOfDayUTC,
        lt: endOfDayUTC,
      },
      deleted: false,
      ...(hasAi !== undefined && { hasAi }),
    },
  });

  const posts = (
    await db.post.findMany({
      where: {
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
      skip: (page - 1) * pageSize,
      take: pageSize,
    })
  ).map((post) => ({
    ...post,
    topics: post.topics.map((topic) => topic.Topic),
  }));

  // TODO: why dont we sort in the db?
  const sortedPosts = posts.sort((a, b) => b.votesCount - a.votesCount);

  return {
    posts: sortedPosts,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
}
