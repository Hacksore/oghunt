"use client";

import type { ProductPost } from "@/app/types";
import { Card } from "@/components/card";
import { FiltersSection } from "@/components/filters-section";
import { MobileCard } from "@/components/mobile-card";
import Scroll from "@/components/scroll";
import { SlopMeterSection } from "@/components/slop-meter-section";
import { Button } from "@/components/ui/button";

interface ListPageClientProps {
  posts: ProductPost[];
  totalPages: number;
  currentPage: number;
  aiPostsCount: number;
  nonAiPostsCount: number;
  selectedDate: Date;
}

export function ListPageClient({
  posts,
  totalPages,
  currentPage,
  aiPostsCount,
  nonAiPostsCount,
  selectedDate,
}: ListPageClientProps) {
  // Format the date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create pagination URL with date parameter preserved
  const createPaginationUrl = (page: number) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return `/list?date=${dateStr}&page=${page}`;
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <Scroll />
      <section className="max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Top Real Launches
        </h1>

        {/* Filters Section */}
        <FiltersSection selectedDate={selectedDate} />

        {/* Stats Section */}
        <section className="w-full px-4 my-8">
          <div className="max-w-4xl mx-auto">
            <SlopMeterSection
              aiPostsCount={aiPostsCount}
              nonAiPostsCount={nonAiPostsCount}
            />
          </div>
        </section>

        <div className="flex flex-col gap-10 md:gap-4">
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
            <p className="text-xl text-gray-600">
              No launches found for today. Check back later!
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              href={createPaginationUrl(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            >
              Prev
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              href={createPaginationUrl(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
