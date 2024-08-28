import prisma from "@/app/db";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
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

  return Response.json(post);
}
