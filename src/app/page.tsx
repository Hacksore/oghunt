import { Metadata } from "next";
import PostList from "./component/PostList";
import { filterPosts, getAllPost } from "./lib/data";

const META_INFO = {
  title: "oghunt",
  description: "Sites on ProductHunt with ZERO AI Slop™",
  site: "https://oghunt.vercel.app",
};

export const metadata: Metadata = {
  title: META_INFO.title,
  description: META_INFO.description,
  openGraph: {
    title: META_INFO.title,
    description: META_INFO.description,
    images: [`${META_INFO.site}/no-slop-og.png`],
    type: "website",
  },
  twitter: {
    title: META_INFO.title,
    description: META_INFO.description,
    images: [`${META_INFO.site}/no-slop-og.png`],
    card: "summary_large_image",
  },
};

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
