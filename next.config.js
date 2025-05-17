/** @type {import('next').NextConfig} */
const config = {
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default config;
