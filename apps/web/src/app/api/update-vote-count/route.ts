import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import env from "@/app/env";
import db from "../../db";
import { getAllPost } from "../../lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}` && env.NODE_ENV === "production") {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const posts = await getAllPost();

  let updatedCount = 0;
  const failedUpdates: { postId: string; error: string }[] = [];

  for (const post of posts) {
    try {
      await db.post.update({
        where: {
          id: post.id,
        },
        data: {
          votesCount: post.votesCount,
        },
      });
      updatedCount++;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        failedUpdates.push({
          postId: post.id,
          error: "Post not found in database",
        });
      } else {
        failedUpdates.push({
          postId: post.id,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }
  }

  // revalidate the /api/list path
  revalidatePath("/api/list");

  return Response.json({
    success: true,
    updatedCount,
    failedUpdates,
  });
}
