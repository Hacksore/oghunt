import { Analytics } from "@vercel/analytics/react";
import { getTodaysLaunches } from "../lib/launches";
import { generateOGHuntMetadata } from "../metadata";
import { ListPageClient } from "./page.client";

export const dynamic = "force-dynamic";

export const generateMetadata = generateOGHuntMetadata({
  title: "oghunt | Today's Top Launches",
  description:
    "Discover today's top product launches on Product Hunt, filtered to show only real innovative products.",
});

export default async function ListPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
  const pageSize = 10;

  const { posts, totalPages } = await getTodaysLaunches({ hasAi: false, page, pageSize });
  const { posts: aiPosts } = await getTodaysLaunches({ hasAi: true, page, pageSize });

  return (
    <>
      <ListPageClient
        posts={posts}
        aiPosts={aiPosts}
        totalPages={totalPages}
        currentPage={page}
      />
      <Analytics />
    </>
  );
}
