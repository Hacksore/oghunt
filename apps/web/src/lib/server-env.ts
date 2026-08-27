import "server-only";

type ServerEnvironment = {
  upstashRedisRestToken: string;
  upstashRedisRestUrl: string;
};

export function getServerEnvironment(): ServerEnvironment {
  // biome-ignore lint/style/noProcessEnv: Server environment access is centralized in this module.
  const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
  // biome-ignore lint/style/noProcessEnv: Server environment access is centralized in this module.
  const upstashRedisRestToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashRedisRestUrl || !upstashRedisRestToken) {
    throw new Error("Upstash Redis environment variables are not configured");
  }

  return { upstashRedisRestToken, upstashRedisRestUrl };
}
