import { getAllPost } from "@/app/lib/data";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const GET_POST = `query {
  post(id:482982) {
    name,
    votesCount
  }
}`;

// NOTE: this is called on cron job
export async function GET(request: NextRequest) {
  const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.PH_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      query: GET_POST,
    }),
  }).then((res) => res.json());

  const allPosts = await getAllPost();

  return Response.json({ success: true, post: response, allPosts });
}
