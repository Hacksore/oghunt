import { z } from "zod";

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  PH_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  CRON_SECRET: optionalSecret,
  GEMINI_API_KEY: optionalSecret,
  VERCEL_URL: z.string().optional(),
});

// biome-ignore lint/style/noProcessEnv: we are using zod
const env = envSchema.parse(process.env);

export default env;

export function isCronRequestAuthorized(authorization: string | null) {
  if (env.NODE_ENV !== "production") return true;

  return Boolean(env.CRON_SECRET && authorization === `Bearer ${env.CRON_SECRET}`);
}

// Not really necessary due to forcing env export use but, just making sure ProcessEnv is aware of it
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
