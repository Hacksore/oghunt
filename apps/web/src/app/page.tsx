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
    "Product Hunt with ZERO AI Slop which uses AI to filter out AI products. You no longer have to worry about AI products cluttering your feed",
});

export default async function Page() {
  const posts = await getTodaysLaunches(false);
  const aiPosts = await getTodaysLaunches(true);

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <JsonLd posts={posts} />

      <section className="max-w-3xl mx-auto my-6 text-left" id="about-oghunt">
        <p className="text-2xl pb-4">
          OGHUNT filters daily launches from{" "}
          <Link href="https://www.producthunt.com" className="font-bold">
            Product Hunt
          </Link>{" "}
          that contain AI so you can discover real innovative products
        </p>
        <p className="text-2xl pb-4">
          We made this because more than half of the launches on Product Hunt contain AI slop,
          OGHUNT fixes this!
        </p>

        <div className="mt-4 text-center">
          <Link href="#newsletter" className="text-lg font-bold hover:underline">
            Get daily email updates on new products with our newsletter
          </Link>
        </div>

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
          <p className="text-2xl">Now that you viewed all the non AI products</p>
          <Link href="/homies" className="pt-2 text-xl">
            Click here to view the Homies Products
          </Link>
        </div>
      </section>
      <section className="flex flex-col items-center pt-8 text-center" id="newsletter">
        <EmailSignUpForm />
      </section>
      <ScrollToTop />
      <Analytics />
    </main>
  );
}
