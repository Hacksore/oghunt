import Link from "next/link";
import type { ProductPost } from "../app/types";
import { generatePostSlug } from "../app/utils/string";
import { Pill } from "./pill";

export const MobileCard = ({ post, url }: { post: ProductPost; url?: string }) => {
  return (
    <Link
      href={url ? url : `/view/${generatePostSlug(post)}`}
      key={post.id}
      className="items-cener group w-full cursor-pointer flex-col gap-8 rounded-2xl duration-300 hover:bg-neutral-300/50 dark:hover:bg-neutral-900"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <div className="transition-transform duration-300 group-hover:translate-x-2">
            {post.thumbnailUrl && (
              <img
                src={post.thumbnailUrl}
                className="size-10 rounded-lg object-contain"
                alt="logo"
              />
            )}
          </div>
          <h2 className="max-w-[min(69ch,calc(100vw-4.5rem))] truncate text-lg font-bold duration-300 group-hover:translate-x-2 group-hover:underline md:text-2xl ">
            {post.name}
          </h2>
        </div>

        <p className="line-clamp-2 max-w-[69ch] text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
          {post.tagline}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.topics?.map(({ id, name }) => (
            <Pill key={`${id}${post.id}`} name={name} />
          ))}
        </div>
        <p className="line-clamp-3 max-w-[69ch] text-left text-sm md:text-base">
          {post.description}
        </p>
      </div>
    </Link>
  );
};
