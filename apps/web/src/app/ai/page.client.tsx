"use client";

import type { ProductPost } from "@/app/types";
import { Card } from "@/components/card";
import { MobileCard } from "@/components/mobile-card";
import { Button } from "@/components/ui/button";

interface ListPageClientProps {
  posts: ProductPost[];
  totalPages: number;
  currentPage: number;
}

export function ListPageClient({ posts, totalPages, currentPage }: ListPageClientProps) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 pt-10 md:px-8">
      <section className="max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Top AI Launches</h1>

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
              href={`/ai?page=${currentPage - 1}`}
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
              href={`/ai?page=${currentPage + 1}`}
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
