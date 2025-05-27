import Image from "next/image";
import type { ProductPost } from "../app/types";
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
      className="group flex w-full cursor-pointer flex-row items-center gap-8 rounded-2xl p-8 duration-300 dark:hover:bg-neutral-900 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 active:duration-75 active:scale-98 active:origin-bottom active:shadow-none"
      rel="noreferrer"
    >
      <div className="flex self-start lg:self-center">
        <div className="relative size-10 object-contain lg:size-24 group-hover:-translate-y-1/2 duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:drop-shadow-2xl">
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
          <h2 className="line-clamp-3 max-w-[69ch] text-2xl font-bold md:text-4xl">{post.name}</h2>
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
        <div className="ml-auto flex flex-col items-center rounded-lg px-4 py-2 relative">
          <UpArrow className="absolute h-16 w-16 stroke-0 group-hover:-translate-y-1/2 group-hover:opacity-0 duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" gradient />
          <UpArrow className="h-16 w-16 stroke-0 translate-y-1/2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]" gradient />
          <p className="font-bold">{post.votesCount}</p>
        </div>
      )}
    </a>
  );
};
