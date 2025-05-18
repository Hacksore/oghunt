declare namespace NodeJS {
  interface ProcessEnv {
    OPENAI_API_KEY: string;
    NODE_ENV: "development" | "production" | "test";
    GEMINI_API_KEY: string;
  }
}
