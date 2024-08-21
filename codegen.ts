import "dotenv/config";
import type { CodegenConfig } from "@graphql-codegen/cli";

const __dirname = new URL(".", import.meta.url).pathname;

const config: CodegenConfig = {
  overwrite: true,
  documents: `${__dirname}/src/query/**/*.gql`,
  schema: "./producthunt.graphql",
  generates: {
    [`${__dirname}src/__generated/graphql.ts`]: {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-resolvers",
        "typescript-document-nodes",
      ],
    },
  },
};

export default config;
