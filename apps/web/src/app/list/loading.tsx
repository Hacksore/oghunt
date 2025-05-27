import { PostSkeleton } from "@/components/post-skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen w-full animate-pulse flex-col items-center px-4 pt-10 md:px-8">
      <section className="max-w-4xl w-full mx-auto">
        <header className="flex w-full flex-col items-center justify-center gap-4">
          {/* Today's Top Launches */}
          <div className="h-10 w-3/4 rounded-full bg-[#88888820] md:w-1/2 lg:w-1/2" />
          <div className="h-10 w-3/5 rounded-full bg-[#88888820] md:hidden" />

          {/* Stats Section */}
          <section className="w-full px-4 my-8">
            {/* AI - No AI text */}
            <div className="flex w-full justify-between mb-1 px-1">
              <div className="h-7 w-3/11 rounded-full bg-[#88888820] md:w-1/6 lg:w-1/6" />
              <div className="h-7 w-3/11 rounded-full bg-[#88888820] md:w-1/6 lg:w-1/6" />
            </div>

            {/* SlopMeter */}
            <div className="h-8 mb-2 rounded-full bg-[#88888820]" />

            {/* SlopMeter TM */}
            <div className="flex justify-center w-full">
              <div className="h-5 w-2/6 rounded-full bg-[#88888820] md:w-1/6 lg:w-1/11" />
            </div>
          </section>
        </header>

        <div className="mx-auto w-full">
          <div className="flex flex-col gap-10 overflow-hidden md:gap-4">
            {Array.from({ length: 5 }).map(() => (
              <PostSkeleton key={`post-skeleton-${crypto.randomUUID()}`} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
