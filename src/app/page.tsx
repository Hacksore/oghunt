import PostList from "./component/PostList";
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
    <main className="flex min-h-screen flex-col p-24">
      <h1 className="text-4xl md:text-5xl font-bold pb-20 px-8 bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent">Sites on ProductHunt without AI</h1>
      <PostList initPosts={posts} initPageInfo={response.data.posts.pageInfo}  />
    </main>
  );
}
