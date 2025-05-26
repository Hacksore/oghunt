import { Analytics } from "@vercel/analytics/react";
import { Card } from "../../components/card";
import { MobileCard } from "../../components/mobile-card";
import { getTodaysLaunches } from "../lib/persistence";
import { generateOGHuntMetadata } from "../metadata";
import { SlopMeterSection } from "@/components/slop-meter-section";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export const generateMetadata = generateOGHuntMetadata({
  title: "Today's Top Launches | OGHUNT",
  description: "Discover today's top product launches on Product Hunt, filtered to show only real innovative products.",
});

export default async function ListPage() {
  const posts = await getTodaysLaunches(false);
  const aiPosts = await getTodaysLaunches(true);

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <section className="max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Today's Top Launches</h1>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-700">
            Showing {posts.length} real products out of {posts.length + aiPosts.length} total launches today
          </p>
        </div>

      {/* Stats Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <SlopMeterSection aiPostsCount={aiPosts.length} nonAiPostsCount={posts.length} />
        </div>
      </section>

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

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No launches found for today. Check back later!</p>
          </div>
        )}
      </section>
      <Analytics />
    </main>
  );
} 