"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import type { ProductPost } from "@/app/types";
import { Card } from "@/components/card";
import { FiltersSection } from "@/components/filters-section";
import { MobileCard } from "@/components/mobile-card";
import Scroll from "@/components/scroll";
import { SlopMeterSection } from "@/components/slop-meter-section";
import { Button } from "@/components/ui/button";
import { getCurrentDateInPST } from "../utils/date";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update URL to include date parameter if not present
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (!dateParam) {
      // Format the selected date as YYYY-MM-DD using PST timezone
      const pstDate = getCurrentDateInPST(selectedDate);
      const year = pstDate.getUTCFullYear();
      const month = String(pstDate.getUTCMonth() + 1).padStart(2, "0");
      const day = String(pstDate.getUTCDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // Update URL without causing a page reload
      const newParams = new URLSearchParams(searchParams);
      newParams.set("date", dateStr);
      router.replace(`/list?${newParams.toString()}`, { scroll: false });
    }
  }, [selectedDate, searchParams, router]);

  // Create pagination URL with date parameter preserved
  const createPaginationUrl = (page: number) => {
    const pstDate = getCurrentDateInPST(selectedDate);
    const year = pstDate.getUTCFullYear();
    const month = String(pstDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(pstDate.getUTCDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return `/list?date=${dateStr}&page=${page}`;
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <Scroll />
      <section className="max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Top Real Launches</h1>
          
          {/* Filters Section - Right Aligned */}
          <FiltersSection selectedDate={selectedDate} />
        </div>

        {/* Stats Section */}
        <section className="w-full px-4 my-8">
          <div className="max-w-4xl mx-auto">
            <SlopMeterSection aiPostsCount={aiPostsCount} nonAiPostsCount={nonAiPostsCount} />
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
            <p className="text-xl text-gray-600">No launches found for today. Check back later!</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              href={createPaginationUrl(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
