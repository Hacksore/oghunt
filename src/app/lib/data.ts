const GET_ALL_POSTS = `
query GetAllPosts (
    $first: Int
    $last: Int
    $before: String
    $after: String
) {
    posts (
        first: $first
        last: $last
        before: $before
        after: $after
    ) {
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

export interface PageInfo {
    hasNextPage: boolean | undefined
    endCursor: string | undefined
}
export async function getAllPost(endCursor?: string | null) {
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
                after: endCursor
            }
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
};

export const filterPosts = (nodes: Post[]) => {
    return nodes.filter((post) => {
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
}