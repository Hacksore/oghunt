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
      topics {
        nodes {
          description
          name
        }
      }
    }
  }
}`;

export interface Post {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  createdAt: string;
  topics: Topic;
}

export interface Topic {
  nodes: Node[];
}

export interface Node {
  description: string;
  name: string;
}

export interface PageInfo {
  hasNextPage: boolean | undefined;
  endCursor: string | undefined;
}

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

export async function getAllPost(endCursor?: string | null) {
  // Get the current UTC date and time based on PST day
  const [postedAfter, postedBefore] = Object.values(getStartAndEndOfDayInUTC());

  return (await fetch("https://api.producthunt.com/v2/api/graphql", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    method: "POST",
    body: JSON.stringify({
      query: GET_ALL_POSTS,
      variables: {
        first: 100,
        after: endCursor,
        postedAfter: postedAfter,
        postedBefore: postedBefore,
      },
    }),
  }).then((res) => res.json())) as {
    data: {
      posts: {
        nodes: Post[];
        pageInfo: PageInfo;
        totalCount: number;
      };
    };
  };
}

export const filterPosts = (posts: Post[]) => {
  return posts.filter((post) => {
    // if the name, description or tagline contains "AI", "GPT", "artificial intelligence" or "machine learning" skip it
    if (
      post.name.toLowerCase().includes("ai") ||
      post.tagline.toLowerCase().includes("ai") ||
      post.description.toLowerCase().includes("ai") ||
      post.name.toLowerCase().includes("gpt") ||
      post.tagline.toLowerCase().includes("gpt") ||
      post.description.toLowerCase().includes("gpt") ||
      post.name.toLowerCase().includes("artificial intelligence") ||
      post.tagline.toLowerCase().includes("artificial intelligence") ||
      post.description.toLowerCase().includes("artificial intelligence") ||
      post.name.toLowerCase().includes("machine learning") ||
      post.tagline.toLowerCase().includes("machine learning") ||
      post.description.toLowerCase().includes("machine learning")
    ) {
      return false;
    }

    if (
      post.topics.nodes.some(
        (node) =>
          node.name.toLowerCase().includes("ai") ||
          node.description.toLowerCase().includes("ai") ||
          node.name.toLowerCase().includes("gpt") ||
          node.description.toLowerCase().includes("gpt") ||
          node.name.toLowerCase().includes("artificial intelligence") ||
          node.description.toLowerCase().includes("artificial intelligence") ||
          node.name.toLowerCase().includes("machine learning") ||
          node.description.toLowerCase().includes("machine learning")
      )
    ) {
      return false;
    }

    return true;
  });
};
