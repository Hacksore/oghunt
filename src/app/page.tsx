import { Metadata } from "next";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/react";
import { filterPosts } from "./utils/string";
import { Pill } from "./component/Pill";
import { getTodaysLaunches } from "./lib/persistence";
import { UpArrow } from "./component/icons/UpArrow";
import ScrollToTop from "./component/ScrollToTop";
import { SlopMeter } from "./component/SlopMeter";

const META_INFO = {
  title: "OGHUNT - ZERO AI Slop™",
  description: "Sites on Product Hunt with ZERO AI Slop™",
  site: "https://oghunt.vercel.app",
};

export const revalidate = 300; // TODO: fix this for launch to be 1 hour, revalidate at most every hour

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
  const allPosts = await getTodaysLaunches();
  const posts = filterPosts(allPosts);
  const aiPosts = filterPosts(allPosts, true);

  return (
    <main className="flex min-h-screen flex-col items-center px-8 pt-8 md:pt-20 w-full">
      <header className="flex flex-col gap-8 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 dark:from-pink-300 dark:to-orange-300 bg-clip-text text-transparent">
          Product Hunt with ZERO AI Slop™
        </h1>
        {/* <div className="flex flex-col gap-2"> */}
        {/*   <div className="text-3xl font-bold">{`${posts.length} products without AI launched today`}</div> */}
        {/*   <div className="text-xl"> */}
        {/*     {aiPosts.length} AI Slop™ projects launched today */}
        {/*   </div> */}
        {/* </div> */}
        <div className="w-full">
          <h2 className="text-mg md:text-lg font-bold pb-2">SlopMeter™</h2>
          <div className="mx-auto rounded-lg overflow-hidden w-full">
            <SlopMeter
              propA={aiPosts.length}
              propB={posts.length}
              nameA="AI"
              nameB="No AI"
              height={32}
            />
          </div>
        </div>
      </header>

      <div>
        <div className="flex flex-col gap-8 overflow-hidden">
          {posts.map((post, index) => {
            return (
              <a
                href={post.url}
                key={post.id}
                target="_blank"
                className="flex flex-col md:flex-row items-center gap-8 p-4 md:p-8 group hover:bg-neutral-300/50 dark:hover:bg-neutral-900 rounded-2xl duration-300 cursor-pointer"
              >
                <div className="hidden md:flex flex-row items-center justify-center pb-2 gap-4">
                  <div className="border rounded-lg p-4 border-neutral-700 text-xl">
                    #{index + 1}
                  </div>
                </div>

                {post.thumbnailUrl && (
                  <Image
                    src={post.thumbnailUrl}
                    height={100}
                    width={100}
                    className="rounded-lg"
                    alt="logo"
                  />
                )}
                <div className="flex flex-col items-start gap-2">
                  <h2 className="text-2xl line-clamp-3 max-w-[69ch] md:text-4xl font-bold group-hover:underline duration-300 group-hover:translate-x-2">
                    {post.name}
                  </h2>
                  <p className="text-base md:text-lg max-w-[69ch] opacity-60">
                    {post.tagline}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.topics &&
                      post.topics.map(({ id, name }) => (
                        <Pill key={`${id}${post.id}`} name={name} />
                      ))}
                  </div>
                  <p className="line-clamp-3 text-base md:text-lg max-w-[69ch]">
                    {post.description}
                  </p>
                </div>

                <div className="hidden md:flex ml-auto flex-col items-center border border-neutral-700 rounded-lg px-4 py-2">
                  <UpArrow className="stroke-0 h-12 w-12" gradient />
                  <p className="font-bold">{post.votesCount}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <ScrollToTop />
      <Analytics />
    </main>
  );
}
