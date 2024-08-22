import { NextApiRequest, NextApiResponse } from "next";
import { fetchAndUpdateDatabase } from "../../lib/persistence";

export const dynamic = "force-dynamic";

// NOTE: this is called on cron job
export async function GET(request: NextApiRequest, response: NextApiResponse) {
  // const authHeader = request.headers.authorization;
  // // TODO: disable in dev?
  // if (
  //   !process.env.CRON_SECRET ||
  //   authHeader !== `Bearer ${process.env.CRON_SECRET}`
  // ) {
  //   return response.status(401).json({ success: false });
  // }

  await fetchAndUpdateDatabase();

  return Response.json({ success: true });
}
