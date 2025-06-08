import { Analytics } from "@vercel/analytics/react";
import { getTodaysLaunches, getTodaysLaunchesPaginated } from "../lib/launches";
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
  searchParams: Promise<{ page?: string | undefined }>;
}) {
  const { page } = await searchParams;

  const pageNumber = page ? Number.parseInt(page, 10) : 1;
  const pageSize = 10;

  // Get paginated posts for the list
  const { posts, totalPages, totalCount } = await getTodaysLaunchesPaginated({
    hasAi: true,
    page: pageNumber,
    pageSize,
  });

  return (
    <>
      <ListPageClient
        posts={posts}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={pageNumber}
      />
      <Analytics />
    </>
  );
}
