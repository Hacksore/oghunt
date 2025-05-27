import prisma from "@/app/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    // Extract the ID from the slug (format: "id-product-name")
    const id = (await params).slug.split("-")[0];

    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
