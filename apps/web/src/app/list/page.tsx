import { getLaunchesForDate, getLaunchesForDateAll } from "../lib/launches";
import { generateOGHuntMetadata } from "../metadata";
import { getCurrentDateInPST, parsePSTDate } from "../utils/date";
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

  // Parse the date parameter or default to today - ALWAYS in PST
  let targetDate: Date;
  if (date) {
    // Parse YYYY-MM-DD format as PST date
    targetDate = parsePSTDate(date);
  } else {
    // Default to today in PST if no date parameter
    targetDate = getCurrentDateInPST();
  }

  // Validate the date - if invalid, default to today in PST
  if (Number.isNaN(targetDate.getTime())) {
    targetDate = getCurrentDateInPST();
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
