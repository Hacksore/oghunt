import { PostSkeleton } from "./component/post-skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen w-full animate-pulse flex-col items-center px-4 pt-10 md:px-8">
      <header className="flex w-full flex-col items-center gap-4 pb-10">
        <div className="mr-auto h-10 w-10/12 rounded-full bg-neutral-700 md:mb-4 lg:m-0 lg:mb-4 lg:w-8/12 2xl:w-2/6 dark:bg-gray-700" />
        <div className="mb-4 mr-auto h-10 w-7/12 rounded-full bg-neutral-700 md:hidden lg:m-0 dark:bg-gray-700" />

        <div className="mb-4 h-[50px] w-[300px] rounded-full bg-neutral-700 dark:bg-gray-700" />

        <div className="w-full md:w-11/12 lg:w-8/12 2xl:w-2/6">
          <div className="mb-4 h-5 w-3/12 rounded-full bg-neutral-700 dark:bg-gray-700" />
          <div className="w-full">
            <div className="mb-4 h-[32px] rounded-full bg-neutral-700 dark:bg-gray-700" />
          </div>
          <div className="mb-4 h-3 w-2/5 rounded-full bg-neutral-700 dark:bg-gray-700" />
        </div>
      </header>

      <div className="w-full md:w-11/12 2xl:w-[1129.65px]">
        <div className="flex flex-col gap-10 overflow-hidden md:gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <PostSkeleton key={`post-skeleton-${crypto.randomUUID()}`} />
          ))}
        </div>

        <div className="flex flex-col items-center pt-8">
          <div className="mb-4 h-4 w-11/12 rounded-full bg-neutral-700 md:w-5/12 dark:bg-gray-700" />
          <div className="mb-4 h-2 w-11/12 rounded-full bg-neutral-700 md:w-4/12 dark:bg-gray-700" />
        </div>
      </div>
    </main>
  );
}
