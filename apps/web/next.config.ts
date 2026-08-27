import { config } from "dotenv";
import type { NextConfig } from "next";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(appDirectory, "../..");

// Next scopes dotenv loading to apps/web by default. This monorepo keeps local configuration at
// the repository root; dotenv does not overwrite values already provided by the host environment.
config({ path: resolve(repositoryRoot, ".env"), quiet: true });

const nextConfig: NextConfig = {};

export default nextConfig;
