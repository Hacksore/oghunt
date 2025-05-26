import prisma from "@/app/db";
import { getStartAndEndOfDayInUTC } from "@/app/utils/date";

export async function GET(_request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  // Extract the ID from the slug (assuming format is "id-product-name")
  const id = slug.split("-")[0];

  const post = await prisma.post.findFirst({
    where: {
      id: id,
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
