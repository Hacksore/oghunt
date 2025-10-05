import type { NextRequest } from "next/server";
import prisma from "@/app/db";
import env from "@/app/env";
import { getYesterdaysLaunches } from "@/app/lib/launches";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}` && env.NODE_ENV === "production") {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const launches = await getYesterdaysLaunches();
  const topThree = launches.slice(0, 3);

  // Map the launches to the required event properties schema
  const eventProperties = topThree.reduce(
    (acc, launch, index) => {
      const num = index + 1;
      acc[`product_${num}.title`] = launch.name;
      acc[`product_${num}.desc`] = launch.description;
      acc[`product_${num}.url`] = launch.url;
      return acc;
    },
    {} as Record<string, string>,
  );

  // TODO: what if this list gets bigger we might have to offload this some queue
  const _users = await prisma.emailList.findMany({
    where: {
      dailyEmails: true,
    },
    select: {
      email: true,
    },
  });

  // TODO: figure out how to send the daily email to the whole list

  return Response.json({ eventProperties });
}
