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

export const dynamic = "force-dynamic";
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
  const aiVotes = aiPosts.reduce((acc, post) => acc + post.votesCount, 0);
  const nonAIVotes = posts.reduce((acc, post) => acc + post.votesCount, 0);

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-8 pt-10">
      <header className="flex flex-col gap-4 pb-10">
        <h1 className="bg-gradient-to-r mb-4 from-pink-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-pink-300 dark:to-orange-300">
          Product Hunt with ZERO AI Slop™
        </h1>
        <div className="w-full">
          <h2 className="text-mg pb-2 font-bold md:text-lg">SlopMeter™</h2>
          <div className="mx-auto w-full overflow-hidden rounded-lg">
            <SlopMeter
              propA={aiPosts.length}
              propB={posts.length}
              nameA="AI"
              nameB="No AI"
              height={32}
            />
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-mg pb-2 font-bold md:text-lg">AI HypeMeter™</h2>
          <div className="mx-auto w-full overflow-hidden rounded-lg">
            <SlopMeter
              propA={aiVotes}
              propB={nonAIVotes}
              nameA="AI Votes"
              nameB="No AI Votes"
              height={32}
            />
          </div>
          <div className="pt-2 opacity-60">Out of projects launched today</div>
        </div>
      </header>

      <div>
        <div className="flex flex-col gap-8 overflow-hidden">
          {posts.map((post, index) => {
            const link = new URL(post.url);
            return (
              <a
                href={`${link.origin}${link.pathname}?utm=oghunt`}
                key={post.id}
                target="_blank"
                className="group flex cursor-pointer flex-col items-center gap-8 rounded-2xl p-4 duration-300 hover:bg-neutral-300/50 md:flex-row md:p-8 dark:hover:bg-neutral-900"
              >
                <div className="hidden flex-row items-center justify-center gap-4 pb-2 md:flex">
                  <div className="rounded-lg border border-neutral-700 p-4 text-xl">
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
                  <h2 className="line-clamp-3 max-w-[69ch] text-2xl font-bold duration-300 group-hover:translate-x-2 group-hover:underline md:text-4xl">
                    {post.name}
                  </h2>
                  <p className="max-w-[69ch] text-base opacity-60 md:text-lg">{post.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.topics &&
                      post.topics.map(({ id, name }) => (
                        <Pill key={`${id}${post.id}`} name={name} />
                      ))}
                  </div>
                  <p className="line-clamp-3 max-w-[69ch] text-base md:text-lg">
                    {post.description}
                  </p>
                </div>

                <div className="ml-auto hidden flex-col items-center rounded-lg border border-neutral-700 px-4 py-2 md:flex">
                  <UpArrow className="h-12 w-12 stroke-0" gradient />
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
