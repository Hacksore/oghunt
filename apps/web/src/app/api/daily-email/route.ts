import prisma from "@/app/db";
import env from "@/app/env";
import { getYesterdaysLaunches } from "@/app/lib/launches";
import { LoopsClient } from "loops";
import type { NextRequest } from "next/server";

const loops = new LoopsClient(env.LOOPS_API_KEY);

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
      acc[`product_${num}.title`] = launch.name || `Test${num}`;
      acc[`product_${num}.desc`] = launch.description || "something cool";
      return acc;
    },
    {} as Record<string, string>,
  );

  // TODO: what if this list gets bigger we might have to offload this some queue
  const users = await prisma.emailList.findMany({
    where: {
      dailyEmails: true,
    },
  });

  for (const user of users) {
    try {
    await loops.sendEvent({
      email: user.email,
        eventName: "daily_launches",
        eventProperties,
      });
    } catch (error) {
      console.error("Failed to send event to user:", error);
    }
  }

  return Response.json({ eventProperties, event });
}
