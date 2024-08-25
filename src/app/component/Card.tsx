import { UpArrow } from "./icons/UpArrow";
import Image from "next/image";
import { ProductPost } from "../types";
import { Pill } from "./Pill";

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
      className="group flex cursor-pointer flex-col items-center gap-8 rounded-2xl p-4 duration-300 hover:bg-neutral-300/50 md:flex-row md:p-8 dark:hover:bg-neutral-900"
    >
      {!homie && (
        <div className="hidden flex-row items-center justify-center gap-4 pb-2 md:flex">
          <div className="rounded-lg border border-neutral-700 p-4 text-xl">#{index + 1}</div>
        </div>
      )}

      {post.thumbnailUrl &&
        (homie ? (
          <img src={post.thumbnailUrl} height={100} width={100} className="rounded-lg" alt="logo" />
        ) : (
          <Image
            src={post.thumbnailUrl}
            height={100}
            width={100}
            className="rounded-lg"
            alt="logo"
          />
        ))}
      <div className="flex flex-col items-start gap-2">
        <h2 className="line-clamp-3 max-w-[69ch] text-2xl font-bold duration-300 group-hover:translate-x-2 group-hover:underline md:text-4xl">
          {post.name}
        </h2>
        <p className="max-w-[69ch] text-base opacity-60 md:text-lg">{post.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {post.topics &&
            post.topics.map(({ id, name }) => <Pill key={`${id}${post.id}`} name={name} />)}
        </div>
        <p className="line-clamp-3 max-w-[69ch] text-base md:text-lg">{post.description}</p>
      </div>

      {!homie && (
        <div className="ml-auto hidden flex-col items-center rounded-lg border border-neutral-700 px-4 py-2 md:flex">
          <UpArrow className="h-12 w-12 stroke-0" gradient />
          <p className="font-bold">{post.votesCount}</p>
        </div>
      )}
    </a>
  );
};
