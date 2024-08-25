import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { filterPosts } from "./utils/string";
import { getTodaysLaunches } from "./lib/persistence";
import ScrollToTop from "./component/ScrollToTop";
import { SlopMeter } from "./component/SlopMeter";
import { Card } from "./component/Card";

const META_INFO = {
  title: "OGHUNT - ZERO AI Slop™",
  description: "Sites on Product Hunt with ZERO AI Slop™",
  site: "https://oghunt.com",
};

export const dynamic = "force-dynamic";
export const revalidate = 300; // TODO: fix this for launch to be 1 hour, revalidate at most every hour

export const metadata: Metadata = {
  title: META_INFO.title,
  description: META_INFO.description,
  openGraph: {
    title: META_INFO.title,
    description: META_INFO.description,
    images: [`${META_INFO.site}/api/og`],
    type: "website",
  },
  twitter: {
    title: META_INFO.title,
    description: META_INFO.description,
    images: [`${META_INFO.site}/api/og`],
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
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <header className="flex flex-col gap-4 pb-10">
        <h1 className="mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-pink-300 dark:to-orange-300">
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
        <div className="flex flex-col gap-4 space-y-2 overflow-hidden md:gap-8 md:space-y-8">
          {posts.map((post, index) => (
            <>
              {index !== 0 && (
                <div className="flex h-0.5 w-full bg-neutral-300 md:hidden dark:bg-neutral-700" />
              )}
              <Card post={post} index={index} />
            </>
          ))}
        </div>
        <div className="flex flex-col items-center pt-8">
          <p className="text-2xl">Now that you viewed all the non AI projects</p>
          <a className="pt-2 text-xl text-blue-400" href="/homies" rel="noopener noreferrer">
            Click here to view the Homies Projects
          </a>
        </div>
      </div>
      <ScrollToTop />
      <Analytics />
    </main>
  );
}
