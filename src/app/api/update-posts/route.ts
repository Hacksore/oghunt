import type { NextRequest } from "next/server";
import { fetchAndUpdateDatabase } from "../../lib/persistence";

export const dynamic = "force-dynamic";

// NOTE: this is called on cron job
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const response = await fetchAndUpdateDatabase();
  console.log(response);

  return Response.json({ success: true, ...response });
}
