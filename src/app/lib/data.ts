import { getStartAndEndOfDayInUTC } from "../utils/date";
import { Post, PostResponse } from "../types";

// NOTE: use the graph explorer to build new queries
const GET_ALL_POSTS = `
query GetAllPosts($first: Int, $last: Int, $before: String, $after: String, $postedAfter: DateTime, $postedBefore: DateTime) {
  posts(first: $first, last: $last, before: $before, after: $after, postedAfter: $postedAfter, postedBefore: $postedBefore) {
    totalCount
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      createdAt
      url
      name
      tagline
      description
      votesCount
      topics {
        nodes {
          id
          description
          name
        }
      }
      thumbnail {
        url
      }
    }
  }
}`;

export async function getAllPost(): Promise<Post[]> {
  // Get the current UTC date and time based on PST day
  const [postedAfter, postedBefore] = Object.values(getStartAndEndOfDayInUTC());
  let hasNextPage = true;
  let after = null;
  const allPosts: Post[] = [];

  while (hasNextPage) {
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PH_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        query: GET_ALL_POSTS,
        variables: {
          first: 100,
          after: after,
          postedAfter: postedAfter,
          postedBefore: postedBefore,
        },
      }),
    });
    const result: PostResponse = await response.json();

    const data = result.data?.posts;
    allPosts.push(...data?.nodes);
    after = data.pageInfo.endCursor;
    hasNextPage = data.pageInfo.hasNextPage;
  }

  return allPosts;
}
