import { Analytics } from "@vercel/analytics/react";
import { Card } from "./component/Card";
import { MobileCard } from "./component/MobileCard";
import ScrollToTop from "./component/ScrollToTop";
import { SlopMeter } from "./component/SlopMeter";
import { getTodaysLaunches } from "./lib/persistence";
import { generateOGHuntMetadata } from "./metadata";
import { JsonLd } from "./component/JsonLd";

export const dynamic = "force-dynamic";
export const revalidate = 300; // TODO: fix this for launch to be 1 hour, revalidate at most every hour

export const generateMetadata = generateOGHuntMetadata({
  title: "OGHUNT | Product Hunt with ZERO AI Slop Powered By AI™",
  description:
    "Product Hunt with ZERO AI Slop™ which uses AI to filter out AI projects. You no longer have to worry about AI projects cluttering your feed",
});

export default async function Page() {
  const posts = await getTodaysLaunches(false);
  const aiPosts = await getTodaysLaunches(true);

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <JsonLd posts={posts} />
      <header className="flex flex-col gap-4 pb-10">
        <h1 className="mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-pink-300 dark:to-orange-300">
          Product Hunt with ZERO AI Slop™
        </h1>

        <a
          href="https://github.com/Hacksore/oghunt"
          target="_blank"
          rel="noopener noreferrer"
          className="relative mx-auto h-[50px] w-[300px] max-w-full overflow-hidden rounded-[50px] bg-neutral-100 text-center text-white dark:bg-black"
        >
          <div className="absolute inset-0 z-10 flex items-center justify-center text-[1.25rem] font-bold text-black dark:text-white">
            ✨ Star on Github
          </div>
          <div className="absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 animate-[rotate_2s_linear_infinite] bg-[conic-gradient(at_top,#fda4af_0%_25%,#fb923c_75%_100%)]" />
          <div className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] rounded-[inherit] bg-[inherit]" />
        </a>

        <div className="w-full">
          <h2 className="text-mg pb-2 font-bold md:text-lg">SlopMeter™</h2>
          <div className="mx-auto w-full">
            <SlopMeter
              propA={aiPosts.length}
              propB={posts.length}
              nameA="AI"
              nameB="No AI"
              height={32}
            />
          </div>
          <div className="pt-2 opacity-60">projects launched today</div>
        </div>
      </header>

      <div>
        <div className="flex flex-col gap-10 overflow-hidden md:gap-4">
          {posts.map((post, index) => (
            <div key={post.id}>
              <div className="hidden md:flex">
                <Card post={post} index={index} />
              </div>
              <div className="md:hidden">
                <MobileCard post={post} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center pt-8 text-center">
          <p className="text-2xl">Now that you viewed all the non AI projects</p>
          <a
            className="border-b border-[var(--background-start-rgb)] bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text pt-2 text-xl text-transparent duration-150 hover:border-black dark:border-black dark:from-pink-300 dark:to-orange-300 dark:hover:border-white"
            href="/homies"
            rel="noopener noreferrer"
          >
            Click here to view the Homies Projects
          </a>
        </div>
      </div>
      <ScrollToTop />
      <Analytics />
    </main>
  );
}
