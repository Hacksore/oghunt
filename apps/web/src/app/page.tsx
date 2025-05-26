import { Button } from "@/components/ui/button";
import { Card } from "../components/card";
import { JsonLd } from "../components/json-ld";
import { Link } from "../components/link";
import { MobileCard } from "../components/mobile-card";
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

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <JsonLd posts={posts} />

      {/* Hero Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Discover Real Products, <span className="text-accent">No AI Slop</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            OGHUNT filters out AI-generated products from{" "}
            <Link href="https://producthunt.com">Product Hunt</Link>, helping you discover genuine
            innovation and creativity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link className="text-inherit hover:text-black" href="/list">
                View Today's Launches
              </Link>
            </Button>
            <Button variant="outline">
              <Link href="#newsletter">Get Daily Updates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center">Today's Top 3 Launches</h2>
          <div className="flex flex-col gap-10 overflow-hidden md:gap-4">
            {posts.slice(0, 3).map((post, index) => (
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
          <div className="text-center mt-8">
            <Button>View all launches →</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
