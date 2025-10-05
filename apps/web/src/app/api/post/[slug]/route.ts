import { NextResponse } from "next/server";
import prisma from "@/app/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
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
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
