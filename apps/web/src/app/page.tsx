import { Analytics } from "@vercel/analytics/react";
import { Card } from "./component/card.tmp";
import { GithubStar } from "./component/github-star";
import { JsonLd } from "./component/json-ld";
import { MobileCard } from "./component/mobile-card";
import ScrollToTop from "./component/scroll-to-top";
import { SlopMeterSection } from "./component/slop-meter-section";
import { getTodaysLaunches } from "./lib/persistence";
import { generateOGHuntMetadata } from "./metadata";

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

        <GithubStar />

        <SlopMeterSection aiPostsCount={aiPosts.length} nonAiPostsCount={posts.length} />
      </header>

      <section className="max-w-2xl mx-auto my-6 text-left" id="about-oghunt">
        <h2 className="text-xl font-semibold mb-2">About OGHUNT</h2>
        <p>
          OGHUNT is a platform that filters{" "}
          <a
            href="https://www.producthunt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary hover:text-primary"
          >
            Product Hunt
          </a>{" "}
          launches to show you only non-AI projects. Our mission is to help you discover innovative
          products without the clutter of AI-generated content.
        </p>
      </section>

      <section>
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
      </section>
      <ScrollToTop />
      <Analytics />
    </main>
  );
}
