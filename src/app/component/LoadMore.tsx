'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { PageInfo } from '../lib/data';

export default function LoadMore({ pageInfo }: { pageInfo: PageInfo }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageInfo: PageInfo) => {
    if (!pageInfo.endCursor || !pageInfo.hasNextPage) return undefined;
    const params = new URLSearchParams(searchParams);
    params.set('endCursor', pageInfo.endCursor.toString());
    return `${pathname}?${params.toString()}`;
  };


  return (
    <div>
      <a href={createPageURL(pageInfo)}>
        <button>Load More</button>
      </a>
    </div>
  );
}
