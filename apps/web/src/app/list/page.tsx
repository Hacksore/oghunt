import { getTodaysLaunches, getTodaysLaunchesPaginated } from "../lib/launches";
import { generateOGHuntMetadata } from "../metadata";
import { ListPageClient } from "./page.client";

export const dynamic = "force-dynamic";

export const generateMetadata = generateOGHuntMetadata({
  title: "oghunt | Today's Real Launches",
  description: "Discover today's REAL Product Hunt launches without AI slop",
});

export default async function ListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | undefined }>;
}) {
  const { page } = await searchParams;

  const pageNumber = page ? Number.parseInt(page, 10) : 1;
  const pageSize = 10;

  const allAiPosts = await getTodaysLaunches(true);
  const allPosts = await getTodaysLaunches(false);

  // Get paginated posts for the list
  const { posts, totalPages } = await getTodaysLaunchesPaginated({
    hasAi: false,
    page: pageNumber,
    pageSize,
  });

  return (
    <>
      <ListPageClient
        posts={posts}
        aiPostsCount={allAiPosts.length}
        nonAiPostsCount={allPosts.length}
        totalPages={totalPages}
        currentPage={pageNumber}
      />
    </>
  );
}
