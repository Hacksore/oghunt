import { getTodaysLaunchesPaginated } from "../lib/launches";
import { generateOGHuntMetadata } from "../metadata";
import { ListPageClient } from "./page.client";

export const dynamic = "force-dynamic";

export const generateMetadata = generateOGHuntMetadata({
  title: "oghunt | AI Slop Launches",
  description: "Discover today's AI slop launches on Product Hunt",
  skipOgImage: true,
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
  const { posts, totalPages } = await getTodaysLaunchesPaginated({
    hasAi: true,
    page: pageNumber,
    pageSize,
  });

  return <ListPageClient posts={posts} totalPages={totalPages} currentPage={pageNumber} />;
}
