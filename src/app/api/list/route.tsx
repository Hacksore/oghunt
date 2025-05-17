import { getTodaysLaunches } from '@/app/lib/persistence';
import { filterPosts } from '@/app/utils/string';
import { unstable_cache } from 'next/cache';

export async function GET() {
  const allPosts = await unstable_cache(() => getTodaysLaunches(), ['api-today-launches'], {
    revalidate: 3600,
  })();
  const posts = filterPosts(allPosts);

  return Response.json(posts);
}
