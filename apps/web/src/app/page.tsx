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
      <section className="w-full pt-4 pb-8 sm:py-20 px-4 relative overflow-clip">
        <div className="-z-10 absolute bottom-0 right-1/2 translate-1/2 size-1/2 bg-accent/20 rounded-full blur-3xl"/>
        <div className="-z-10 absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/4 size-1/2 bg-lines-grid [mask-image:radial-gradient(ellipse_at_center,red,transparent)]"/>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 max-sm:text-balance">
            Discover <br className="md:hidden"/> Real Products, <br className="lg:hidden"/> <span className="bg-white bg-gradient-to-br from-accent to-accent/60 bg-clip-text text-transparent">No AI Slop</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-neutral-500 font-light max-md:text-balance">
            OGHUNT filters out AI-generated products from{" "}
            <Link href="https://producthunt.com">Product Hunt</Link>, helping you discover genuine
            innovation and creativity.
          </p>
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link className="text-white hover:text-black" href="/list">
                View Today's Launches
              </Link>
            </Button>
            <Button variant="outline" className="backdrop-blur">
              <Link href="#newsletter">Get Daily Updates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full px-4 border-t border-neutral-500/40 pt-16 relative">
        <div className="-z-10 absolute top-0 left-1/2 -translate-1/2 w-1/2 h-64 bg-accent/5 rounded-full blur-3xl"/>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Today's Top 3 Launches</h2>
          <div className="flex flex-col gap-10 md:gap-4">
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
            <Button asChild>
              <Link href="/list" className="text-white hover:text-black">
                View all launches →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
