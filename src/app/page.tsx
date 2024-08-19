import LoadMore from "./component/LoadMore";
import { filterPosts, getAllPost } from "./lib/data";

 
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    endCursor?: string;
  };
}) {
  const response = await getAllPost(searchParams?.endCursor)
  const posts = filterPosts(response.data.posts.nodes);

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
      <LoadMore pageInfo={response.data.posts.pageInfo} />
    </main>
  );
}
