import { GetAllPosts, GetAllPostsQuery, Post, PostEdge } from "@/__generated/graphql";
import { phClient } from "@/client";

// Function to get the current date in PST (UTC-8)
// ProductHunt is in PST
function getCurrentDateInPST() {
  const currentUTCDate = new Date();

  // Get the UTC offset for PST (UTC-8)
  const pstOffset = 8 * 60 * 60 * 1000;

  // Convert the current date to PST by subtracting the PST offset
  const pstDate = new Date(currentUTCDate.getTime() - pstOffset);

  // Return the PST date object
  return pstDate;
}

// Function to get the start and end of the current day in PST
// Then convert to UTC ISO-8601 strings
function getStartAndEndOfDayInUTC() {
  const currentPSTDate = getCurrentDateInPST();

  // Get the PST date components
  const year = currentPSTDate.getUTCFullYear();
  const month = currentPSTDate.getUTCMonth();
  const day = currentPSTDate.getUTCDate();

  // Set to the start of the day (12:00 AM) in PST
  const startOfDayPST = new Date(Date.UTC(year, month, day, 0, 0, 0));

  // Set to the end of the day (11:59 PM) in PST
  const endOfDayPST = new Date(Date.UTC(year, month, day, 23, 59, 59));

  // Convert PST times to UTC ISO-8601 format
  const startOfDayUTC = startOfDayPST.toISOString();
  const endOfDayUTC = endOfDayPST.toISOString();

  // Return the start and end of the day in UTC ISO-8601 format
  return {
    postedAfter: startOfDayUTC,
    postedBefore: endOfDayUTC,
  };
}

export async function getAllPost(): Promise<(Post[] | Array<Error>)> {
  const { postedAfter, postedBefore } = getStartAndEndOfDayInUTC();
  let hasNextPage = true;
  let after: string | null = null;
  const allPosts: Post[] = [];

  while (hasNextPage) {
    const res = await phClient().query<GetAllPostsQuery>({ 
      query: GetAllPosts,
      variables: {
        first: 100,
        after,
        postedAfter,
        postedBefore,
      },
    });

    if (res.errors) {
      return res.errors;
    }

    allPosts.push(...res.data.posts.edges.map((edge: PostEdge) => edge.node));

    after = res.data.posts.pageInfo.endCursor;
    hasNextPage = res.data.posts.pageInfo.hasNextPage;
  }

  return allPosts;
}

export const filterPosts = (posts: Post[], showAi = false): Post[] => {
  const excludedTerms = [
    "ai",
    "gpt",
    "artificial intelligence",
    "machine learning",
  ];

  const containsExcludedTerm = (text?: string | null): boolean => {
    return excludedTerms.some(term => text ?? ''.toLowerCase().includes(term));
  }

  return posts.filter(post => {
    if (
      containsExcludedTerm(post.name) ||
      containsExcludedTerm(post.tagline) ||
      containsExcludedTerm(post.description)
    ) {
      return showAi;
    }

    if (
      post.topics.edges.some(
        i => 
          containsExcludedTerm(i.node.name) ||
          containsExcludedTerm(i.node.description)
      )
    ) {
      return showAi;
    }

    return !showAi;
  });
};
