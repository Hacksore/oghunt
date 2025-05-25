// TODO: use zod or t3 env for this
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    GEMINI_API_KEY: string;
    LOOPS_FORM_ENDPOINT: string;
  }
}
