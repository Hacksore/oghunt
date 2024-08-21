import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client/core";

export function phClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    link: new HttpLink({
      uri: "https://api.producthunt.com/v2/api/graphql",
      headers: {
        authorization: `token ${process.env.PH_API_KEY}`,
      },
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
