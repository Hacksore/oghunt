import { Redis } from "@upstash/redis";
import { getServerEnvironment } from "@/lib/server-env";

const COUNTER_KEY = "oghunt:f-count";
const GET_CACHE_CONTROL = "public, max-age=0, s-maxage=2, stale-while-revalidate=8";

let redis: Redis | undefined;

function getRedis() {
  const { upstashRedisRestToken: token, upstashRedisRestUrl: url } = getServerEnvironment();

  redis ??= new Redis({ url, token });
  return redis;
}

function unavailable(error: unknown) {
  console.error("F counter is unavailable", error);

  return Response.json(
    { error: "Counter unavailable" },
    {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = (await getRedis().get<number>(COUNTER_KEY)) ?? 0;

    return Response.json(
      { count },
      {
        headers: { "Cache-Control": GET_CACHE_CONTROL },
      },
    );
  } catch (error) {
    return unavailable(error);
  }
}

export async function POST() {
  try {
    const count = await getRedis().incr(COUNTER_KEY);

    return Response.json(
      { count },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return unavailable(error);
  }
}
