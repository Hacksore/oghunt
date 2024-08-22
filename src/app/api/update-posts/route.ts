import { fetchAndUpdateDatabase } from "../../lib/persistence";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// NOTE: this is called on cron job
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  await fetchAndUpdateDatabase();

  return Response.json({ success: true });
}
