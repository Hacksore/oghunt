import { PostSkeleton } from "./component/PostSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col p-4 md:p-24">
      <div className="h-10 animate-pulse bg-neutral-700 rounded-full dark:bg-gray-700 ml-8 mb-6 md:mb-20 w-4/5"></div>
      <div className="flex flex-col items-center animate-pulse">
        <div className="flex flex-col justify-start gap-2 w-full mt-4 mb-8">
          <div className="flex flex-col justify-start gap-2 w-full mb-8 ml-8">
            <div className="h-6 bg-neutral-700 rounded-full dark:bg-gray-700 w-3/5 mb-4"></div>
            <div className="h-3 bg-neutral-700 rounded-full dark:bg-gray-700 w-2/5 mb-4"></div>
          </div>

          {new Array(5).fill("").map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}