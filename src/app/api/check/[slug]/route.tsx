import prisma from "@/app/db";
import { getStartAndEndOfDayInUTC } from "@/app/utils/date";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  const post = await prisma.post.findFirst({
    where: {
      name: {
        equals: slug,
        mode: "insensitive",
      },
    },
  });

  if (!post) {
    return Response.json({
      error: "Post not found",
    });
  }

  const { postedBefore, postedAfter } = getStartAndEndOfDayInUTC();
  const wouldShowToday =
    post.createdAt > new Date(postedAfter) && post.createdAt < new Date(postedBefore);

  return Response.json({
    ...post,
    wouldShowToday,
  });
}
