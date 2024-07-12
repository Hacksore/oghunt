const GET_ALL_POSTS = `
query {
  posts {
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
    }
  },
}
`;

interface Post {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  createdAt: string;
}

export default async function Home() {
  const response = (await fetch("https://api.producthunt.com/v2/api/graphql", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    method: "POST",
    body: JSON.stringify({
      query: GET_ALL_POSTS,
    }),
  }).then((res) => res.json())) as {
    data: {
      posts: {
        nodes: Post[];
      };
    };
  };

  const posts = response.data.posts.nodes.filter((post) => {
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

    return true;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Sites on ProductHunt without AI</h1>
      {posts.map((post) => {
        return (
          <div
            key={post.id}
            className="flex flex-col items-center justify-between p-8"
          >
            <a href={post.url}><h2 className="text-4xl font-bold">{post.name}</h2></a>
            <p className="text-lg">{post.tagline}</p>
            <p className="text-lg">{post.description}</p>
          </div>
        );
      })}
    </main>
  );
}
