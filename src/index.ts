import { GetUserContributionsQuery, GetUserContributions } from "./__generated/graphql";
import { githubClient } from "./client";

export async function getUserContributions({ user }: { user: string }) {
  const result = await githubClient().query<GetUserContributionsQuery>({
    query: GetUserContributions,
    variables: {
      login: user,
    },
  });

  return result;
}

