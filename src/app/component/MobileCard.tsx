import { ProductPost } from "../types";
import { Pill } from "./Pill";

export const MobileCard = ({ post }: { post: ProductPost }) => {
  const link = new URL(post.url);
  return (
    <a
      href={`${link.origin}${link.pathname}?utm_source=oghunt.com`}
      key={post.id}
      target="_blank"
      className="group cursor-pointer flex-col items-center gap-8 rounded-2xl p-4 duration-300 hover:bg-neutral-300/50 dark:hover:bg-neutral-900"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="flex gap-2">
          <div className="transition-transform duration-300 group-hover:translate-x-2">
            {post.thumbnailUrl && (
              <img src={post.thumbnailUrl} className="size-8 rounded-lg" alt="logo" />
            )}
          </div>
          <h2 className="line-clamp-3 max-w-[69ch] text-2xl font-bold duration-300 group-hover:translate-x-2 group-hover:underline">
            {post.name}
          </h2>
        </div>

        <p className="max-w-[69ch] text-base opacity-60">{post.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {post.topics &&
            post.topics.map(({ id, name }) => <Pill key={`${id}${post.id}`} name={name} />)}
        </div>
        <p className="line-clamp-3 max-w-[69ch] text-base">{post.description}</p>
      </div>
    </a>
  );
};
