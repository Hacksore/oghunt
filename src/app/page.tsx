import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { filterPosts, Post } from "./lib/data";

const META_INFO = {
  title: "OGHUNT - ZERO AI Slop™",
  description: "Sites on Product Hunt with ZERO AI Slop™",
  site: "https://oghunt.vercel.app",
};

export const revalidate = 3600; // revalidate at most every hour

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

export default async function Page() {
  const results: Post[] = await fetch(
    "https://pub-3db3ed9313c4427fadfa81f0323b18f8.r2.dev/latest.json",
  ).then((res) => res.json());

  const posts = filterPosts(results)

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-24">
      <h1 className="text-4xl md:text-5xl font-bold pb-6 md:pb-20 px-8 bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent">
        Product Hunt with ZERO AI Slop™
      </h1>
      <div className="flex flex-col items-center">
        <div className="flex justify-start w-full pl-8 mb-8 ">
          <div className="text-3xl">{`${posts.length} products without AI launched today`}</div>
        </div>
        {posts.map((post, index) => {
          return (
            <a
              href={post.url}
              key={post.id}
              target="_blank"
              className="flex flex-col items-start p-8 w-full group hover:bg-neutral-900 rounded-2xl duration-300 cursor-pointer"
            >
              <h2 className="text-4xl font-bold mb-2 group-hover:underline duration-300 group-hover:translate-x-2">
                {index + 1}. {post.name}
              </h2>
              <p className="text-lg max-w-[69ch] mb-2 opacity-60">
                {post.tagline}
              </p>
              <p>
                {post.topics &&
                  post.topics.nodes.map(({ name }) => name).join(" | ")}
              </p>
              <p className="line-clamp-3 text-lg max-w-[69ch]">
                {post.description}
              </p>
            </a>
          );
        })}
      </div>
      <Analytics />
    </main>
  );
}
