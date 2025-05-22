import Image from "next/image";
import type { ProductPost } from "../types";
import { UpArrow } from "./icons/up-arrow";
import { Pill } from "./pill";

interface CardProps {
  post: ProductPost;
  index: number;
  homie?: boolean;
}

export const Card = ({ post, index, homie = false }: CardProps) => {
  const link = new URL(post.url);
  return (
    <a
      href={`${link.origin}${link.pathname}?ref=oghunt&utm_source=oghunt.com`}
      key={post.id}
      target="_blank"
      className="group flex w-full cursor-pointer flex-row items-center gap-8 rounded-2xl p-8 duration-300 hover:bg-neutral-300/50 dark:hover:bg-primary/90"
      rel="noreferrer"
    >
      {!homie && (
        <div className="flex flex-row items-center justify-center gap-4 pb-2">
          <div className="rounded-lg p-4 text-3xl">#{index + 1}</div>
        </div>
      )}

      <div className="flex self-start lg:self-center">
        <div className="relative size-10 object-contain lg:size-24">
          {post.thumbnailUrl && (
            <Image
              src={post.thumbnailUrl}
              fill
              className="rounded-lg"
              sizes="(max-width: 768px) 40px, 96px"
              alt={`${post.name} logo - ${post.tagline}`}
              loading={index < 3 ? "eager" : "lazy"}
              priority={index < 3}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-start gap-2">
        <div className="flex gap-2">
          <h2 className="line-clamp-3 max-w-[69ch] text-2xl font-bold md:text-4xl">
            {post.name}
          </h2>
        </div>

        <p className="max-w-[69ch] text-base opacity-60 md:text-lg">{post.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {post.topics?.map(({ id, name }) => (
            <Pill key={`${id}${post.id}`} name={name} />
          ))}
        </div>
        <p className="line-clamp-3 max-w-[69ch] text-base md:text-lg">{post.description}</p>
      </div>

      {!homie && (
        <div className="ml-auto flex flex-col items-center rounded-lg px-4 py-2">
          <UpArrow className="h-20 w-20 stroke-0" gradient />
          <p className="font-bold">{post.votesCount}</p>
        </div>
      )}
    </a>
  );
};
