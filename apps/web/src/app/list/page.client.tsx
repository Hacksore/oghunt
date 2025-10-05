"use client";

import type { ProductPost } from "@/app/types";
import { Card } from "@/components/card";
import { DateSelector } from "@/components/date-selector";
import { MobileCard } from "@/components/mobile-card";
import Scroll from "@/components/scroll";
import { SlopMeterSection } from "@/components/slop-meter-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  
  // Format the date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Create URL with current search params but update specific parameter
  const createUrl = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(param, value);
    return `/list?${params.toString()}`;
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <Scroll />
      <section className="max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Best of {formatDate(selectedDate)}
        </h1>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Scope/Frequency Tabs */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-red-500 border-b-2 border-red-500 rounded-none px-2 py-1"
            >
              <Link href={createUrl('scope', 'daily')}>Daily</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              <Link href={createUrl('scope', 'weekly')}>Weekly</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              <Link href={createUrl('scope', 'monthly')}>Monthly</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              <Link href={createUrl('scope', 'yearly')}>Yearly</Link>
            </Button>
          </div>

          {/* Content Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-red-500 border-b-2 border-red-500 rounded-none px-2 py-1"
            >
              <Link href={createUrl('filter', 'featured')}>Featured</Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              <Link href={createUrl('filter', 'all')}>All</Link>
            </Button>
          </div>
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <DateSelector currentDate={selectedDate} />
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
              href={createUrl('page', String(currentPage - 1))}
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
              href={createUrl('page', String(currentPage + 1))}
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
