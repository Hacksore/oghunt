import { ProductPost } from "../types";
import { Pill } from "./Pill";

export const MobileCard = ({ post }: { post: ProductPost }) => {
  const link = new URL(post.url);
  return (
    <a
      href={`${link.origin}${link.pathname}?utm_source=oghunt.com`}
      key={post.id}
      target="_blank"
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
          <h2 className="max-w-[69ch] truncate text-lg font-bold duration-300 group-hover:translate-x-2 group-hover:underline md:text-2xl">
            {post.name}
          </h2>
        </div>

        <p className="line-clamp-2 max-w-[69ch] text-sm opacity-60 md:text-base">{post.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {post.topics &&
            post.topics.map(({ id, name }) => <Pill key={`${id}${post.id}`} name={name} />)}
        </div>
        <p className="line-clamp-3 max-w-[69ch] text-left text-sm md:text-base">
          {post.description}
        </p>
      </div>
    </a>
  );
};
