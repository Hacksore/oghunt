import { Star } from "@/components/icons/star";
import { ProductHunt } from "@/components/product-hunt";
import { Button } from "@/components/ui/button";
import { Card } from "../components/card";
import { JsonLd } from "../components/json-ld";
import { Link } from "../components/link";
import { MobileCard } from "../components/mobile-card";
import { getTodaysLaunchesPaginated } from "./lib/launches";
import { generateOGHuntMetadata } from "./metadata";

export const dynamic = "force-dynamic";
export const revalidate = 300; // TODO: fix this for launch to be 1 hour, revalidate at most every hour

export const generateMetadata = generateOGHuntMetadata({
  title: "oghunt | Product Hunt with ZERO AI Slop Powered By AI",
  description:
    "Product Hunt with ZERO AI Slop which uses AI to filter out AI products. You no longer have to worry about AI products cluttering your feed",
  skipOgImage: true,
});

export default async function Page() {
  const { posts } = await getTodaysLaunchesPaginated({ hasAi: false, page: 1, pageSize: 3 });

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <JsonLd posts={posts} />

      {/* Hero Section */}
      <section className="w-full pt-4 pb-8 sm:py-20 px-4 relative overflow-clip">
        <div className="-z-10 absolute bottom-0 right-1/2 translate-1/2 size-1/2 bg-accent/20 rounded-full blur-3xl" />
        {/* no -skew-x-12 because @Hacksore said we're straight 🏳️‍🌈 */}
        <div className="-z-10 absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/4 size-1/2 bg-lines-grid [mask-image:radial-gradient(ellipse_at_center,red,transparent)]" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-[1px] mx-auto bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full w-fit mb-5">
            <div className="bg-white dark:bg-black bg-gradient-to-r from-indigo-400/40 to-blue-400/40 rounded-full flex gap-1 items-center px-2 text-sm py-0.5">
              <Star className="text-blue-800 dark:text-indigo-200" />
              <span className="bg-gradient-to-r from-indigo-800 to-blue-800 dark:from-indigo-200 dark:to-blue-200 bg-clip-text text-transparent">
                Now Using AI
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 max-sm:text-balance">
            Discover <br className="md:hidden" /> Real Products, <br className="lg:hidden" />{" "}
            <span className="bg-white bg-gradient-to-br from-accent to-accent/60 bg-clip-text text-transparent">
              No AI Slop
            </span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-neutral-500 dark:text-neutral-400 max-md:text-balance">
            oghunt filters out AI-generated products from{" "}
            <Link href="https://producthunt.com">Product Hunt</Link>, helping you discover genuine
            innovation and creativity.
          </p>
          {/* TODO: enable for launch on product hunt */}
          {/* <div className="flex justify-center mb-8"> */}
          {/*   <ProductHunt /> */}
          {/* </div> */}
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button href="/list">View REAL Launches</Button>
            <Button href="/ai" variant="outline">
              View AI Slop Launches
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full px-4 border-t border-neutral-500/40 pt-16 relative bg-neutral-100 dark:bg-neutral-950 pb-12 rounded-b-3xl">
        <div className="-z-10 absolute top-0 left-1/2 -translate-1/2 w-1/2 h-64 bg-accent/5 rounded-full blur-3xl" />
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
              <Link href="/list">View all launches →</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
