# AGENTS.md

## Cursor Cloud specific instructions

This is a pnpm + Turborepo monorepo (`oghunt`). The only deployable app is `apps/web`
(Next.js 15 / React 19, Prisma + PostgreSQL). `packages/email` is a `jsx-email` preview tool
and `packages/typescript-config` is build-time only. Standard commands live in the root
`package.json`, `apps/web/package.json`, and `README.md` — reference those instead of duplicating.

### Services
- **PostgreSQL** (required): runs via `docker compose up -d` (container `oghunt-db`, port 5432,
  user/pass `dev`/`dev`, db `oghunt`). The Docker daemon does not auto-start in this environment —
  run `sudo service docker start` first if `docker ps` fails to connect.
- **Next.js web app** (required): `pnpm dev` serves it on port 3000. Note `pnpm dev` runs the
  whole turbo `dev` pipeline, so it ALSO starts the `email` preview server (port ~55420). That is
  expected; the product under test is on port 3000.

### Environment files (non-obvious)
- `apps/web/src/app/env.ts` calls `envSchema.parse(process.env)` at import time, so the app
  **crashes on boot** unless `PH_API_KEY`, `DATABASE_URL`, `CRON_SECRET`, and `GEMINI_API_KEY`
  are all set (non-empty). Use placeholder strings for `PH_API_KEY`/`GEMINI_API_KEY` when not
  doing live ingestion.
- `prisma/schema.prisma` also requires `DIRECT_URL` to be set (point it at the same local DB as
  `DATABASE_URL`), or `prisma db push`/`generate` fail validation.
- Env files (`.env` at repo root and `apps/web/.env`) are gitignored. The root `.env` is consumed
  by the `dotenv -e .env` db scripts; Next.js loads `apps/web/.env`. Both should contain the same
  values for local dev.

### Seeding data without API keys
- `pnpm db:push` (once) syncs the schema, then `pnpm db:seed` inserts 4000 fake posts via faker —
  no Product Hunt / Gemini keys needed. This is the fastest way to get a populated UI.
- Live ingestion instead uses `GET /api/ingest-posts` with header `Authorization: Bearer <CRON_SECRET>`
  and requires real `PH_API_KEY` + `GEMINI_API_KEY`.

### Lint / build
- Lint/format is Biome: `pnpm check` (root) → `biome check src` in `apps/web`.
- `pnpm build` builds the web app; the `email#build` "no output files found" turbo warning is benign.
