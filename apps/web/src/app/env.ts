import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]), // I know we aren't testing but, just making sure types match
  PH_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  CRON_SECRET: z.string(),
  GEMINI_API_KEY: z.string(),
  LOOPS_FORM_ENDPOINT: z.string(),
  VERCEL_URL: z.string().optional(),
});

// biome-ignore lint/nursery/noProcessEnv: need to use process env here
const env = envSchema.parse(process.env);

export default env;

// Not really necessary due to forcing env export use but, just making sure ProcessEnv is aware of it
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
