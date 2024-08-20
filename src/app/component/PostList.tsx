'use client';

import { PageInfo, Post } from '../lib/data';
import { useCallback, useRef, useState } from 'react';

export default function PostList({ initPosts, initPageInfo }: { initPosts: Post[], initPageInfo: PageInfo }) {
  const [posts, setPosts] = useState<Post[]>(initPosts)
  const pageInfo = useRef(initPageInfo);

  const loadNextPage = useCallback(() => {
    fetch(`/api/posts?endCursor=${pageInfo.current.endCursor}`).then((res) => res.json()).then((response) => {
      setPosts((prev) => [...prev, ...response.data.posts.nodes]);
      pageInfo.current = response.data.posts.pageInfo;
    })
  }, [pageInfo.current]);

  return (
    <div className='flex flex-col items-center'>
      {posts.map((post, index) => {
        return (
          <a
            href={post.url}
            key={post.id}
            className="flex flex-col items-start p-8 w-full group hover:bg-neutral-900 rounded-2xl duration-300 cursor-pointer"
          >
            <h2 className="text-4xl font-bold mb-2 group-hover:underline duration-300 group-hover:translate-x-2">{index + 1}. {post.name}</h2>
            <p className="text-lg max-w-[69ch] mb-2 opacity-60">{post.tagline}</p>
            <p className="line-clamp-3 text-lg max-w-[69ch]">{post.description}</p>
          </a>
        );
      })}
      <button className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold text-xl mt-8 duration-300 hover:-translate-y-1 active:translate-y-0 active:duration-75 active:brightness-75" onClick={loadNextPage}>Load More</button>
    </div >
  );
}
