import { PostSkeleton } from "./component/PostSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col p-4 md:p-24">
      <div className="mb-6 ml-8 h-10 w-4/5 animate-pulse rounded-full bg-neutral-700 md:mb-20 dark:bg-gray-700"></div>
      <div className="flex animate-pulse flex-col items-center">
        <div className="mb-8 mt-4 flex w-full flex-col justify-start gap-2">
          <div className="mb-8 ml-8 flex w-full flex-col justify-start gap-2">
            <div className="mb-4 h-6 w-3/5 rounded-full bg-neutral-700 dark:bg-gray-700"></div>
            <div className="mb-4 h-3 w-2/5 rounded-full bg-neutral-700 dark:bg-gray-700"></div>
          </div>

          {new Array(5).fill("").map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
