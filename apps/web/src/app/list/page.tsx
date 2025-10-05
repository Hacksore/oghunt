import { getTodaysLaunches, getTodaysLaunchesPaginated, getLaunchesForDate, getLaunchesForDateAll } from "../lib/launches";
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
  searchParams: Promise<{ page?: string | undefined; date?: string | undefined }>;
}) {
  const { page, date } = await searchParams;

  const pageNumber = page ? Number.parseInt(page, 10) : 1;
  const pageSize = 10;

  // Parse the date parameter or default to today
  let targetDate: Date;
  if (date) {
    // Parse YYYY-MM-DD format
    const [year, month, day] = date.split('-').map(Number);
    targetDate = new Date(year, month - 1, day); // month is 0-indexed
  } else {
    targetDate = new Date();
  }
  
  // Validate the date
  if (isNaN(targetDate.getTime())) {
    // If invalid date, redirect to today
    return <ListPageClient posts={[]} aiPostsCount={0} nonAiPostsCount={0} totalPages={0} currentPage={1} selectedDate={new Date()} />;
  }

  // Get posts for the selected date
  const allAiPosts = await getLaunchesForDateAll(targetDate, true);
  const allPosts = await getLaunchesForDateAll(targetDate, false);

  // Get paginated posts for the list
  const { posts, totalPages } = await getLaunchesForDate({
    date: targetDate,
    hasAi: false,
    page: pageNumber,
    pageSize,
  });

  return (
    <ListPageClient
      posts={posts}
      aiPostsCount={allAiPosts.length}
      nonAiPostsCount={allPosts.length}
      totalPages={totalPages}
      currentPage={pageNumber}
      selectedDate={targetDate}
    />
  );
}
