import { Analytics } from "@vercel/analytics/react";
import { Card } from "../components/card";
import { EmailSignUpForm } from "../components/email-sign-up-form";
import { JsonLd } from "../components/json-ld";
import { Link } from "../components/link";
import { MobileCard } from "../components/mobile-card";
import ScrollToTop from "../components/scroll-to-top";
import { SlopMeterSection } from "../components/slop-meter-section";
import { getTodaysLaunches } from "./lib/persistence";
import { generateOGHuntMetadata } from "./metadata";

export const dynamic = "force-dynamic";
export const revalidate = 300; // TODO: fix this for launch to be 1 hour, revalidate at most every hour

export const generateMetadata = generateOGHuntMetadata({
  title: "OGHUNT | Product Hunt with ZERO AI Slop Powered By AI",
  description:
    "Product Hunt with ZERO AI Slop which uses AI to filter out AI projects. You no longer have to worry about AI projects cluttering your feed",
});

export default async function Page() {
  const posts = await getTodaysLaunches(false);
  const aiPosts = await getTodaysLaunches(true);

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <JsonLd posts={posts} />
      <div className="flex flex-col gap-4">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Product Hunt with ZERO AI Slop</h1>
      </div>

      <section className="max-w-3xl mx-auto my-6 text-left" id="about-oghunt">
        <p className="text-2xl">
          OGHUNT is a platform that filters{" "}
          <Link href="https://www.producthunt.com" className="font-bold">
            Product Hunt
          </Link>{" "}
          launches to show you only non-AI projects. Our mission is to help you discover innovative
          products without the clutter of AI-generated content.
        </p>

        <SlopMeterSection aiPostsCount={aiPosts.length} nonAiPostsCount={posts.length} />
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
          <Link href="/homies" className="pt-2 text-xl">
            Click here to view the Homies Projects
          </Link>
        </div>
      </section>
      <section className="flex flex-col items-center pt-8 text-center">
        <EmailSignUpForm />
      </section>
      <ScrollToTop />
      <Analytics />
    </main>
  );
}
