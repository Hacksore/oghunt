import env from "../env";
import type { Post, PostResponse, ProductPost } from "../types";
import { getStartAndEndOfDayInUTC } from "../utils/date";

const buildGetAllPostsVotes = (keys: string[]) => `
query {
  ${keys
    .map(
      (key) => `
    post${key}: post(id: ${key}) {
      votesCount
    }
  `,
    )
    .join("")}
}
`;

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

const printRateLimitInfo = (headers: Headers) => {
  console.log("Product Hunt API Rate Limit:", {
    limit: headers.get("X-Rate-Limit-Limit"),
    remaining: headers.get("X-Rate-Limit-Remaining"),
    resetIn: `${headers.get("X-Rate-Limit-Reset")} seconds`
  });
};

export async function getAllPost(): Promise<Post[]> {
  // Get the current UTC date and time based on PST day
  const [postedAfter, postedBefore] = Object.values(getStartAndEndOfDayInUTC());
  console.log({ postedAfter, postedBefore });
  let hasNextPage = true;
  let after = null;
  const allPosts: Post[] = [];

  while (hasNextPage) {
    const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.PH_API_KEY}`,
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
      cache: "no-cache",
    });
    const result: PostResponse = await response.json();
    printRateLimitInfo(response.headers);

    if (!result.data) {
      console.log("No data received from API");
    }

    const data = result.data?.posts;
    allPosts.push(...(data?.nodes || []));
    after = data.pageInfo.endCursor;
    hasNextPage = data.pageInfo.hasNextPage;
  }

  return allPosts;
}

export async function getAllPostsVotesMoarBetter(
  ids: string[],
): Promise<Record<string, { votesCount: number }>> {
  const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.PH_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      query: buildGetAllPostsVotes(ids),
    }),
    cache: "no-cache",
  });

  const result = await response.json();
  printRateLimitInfo(response.headers);
  return result.data;
}

export const convertPostToProductPost = (post: Post): ProductPost => {
  return {
    deleted: false,
    id: post.id,
    createdAt: new Date(post.createdAt),
    url: post.url,
    hasAi: false,
    name: post.name,
    tagline: post.tagline,
    description: post.description,
    votesCount: post.votesCount,
    topics: post.topics.nodes.map((node) => {
      return {
        id: node.id,
        name: node.name,
        description: node.description,
        postId: post.id,
      };
    }),
    thumbnailUrl: post.thumbnail.url,
  };
};
