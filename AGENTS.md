# AGENTS.md

This repository contains one Next.js app in `apps/web`.

- `pnpm dev` starts the site on port 3000.
- `pnpm check` runs Biome.
- `pnpm build` creates the production build.
- Local environment variables are loaded from the repository-root `.env`.
- The realtime F counter uses Upstash Redis and requires `UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN`.
