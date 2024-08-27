import { ProductPost } from "../types";

export const PRODUCT_HUNT_NAME = "OGHUNT";

export const hasAi = (
  post: {
    name: ProductPost["name"];
    tagline: ProductPost["tagline"];
    description: ProductPost["description"];
    topics: ProductPost["topics"];
  },
  showOnlyAi = false,
): boolean => {
  if (post.name === PRODUCT_HUNT_NAME) {
    return !showOnlyAi;
  }

  const excludedTerms = ["ai", "gpt", "artificial intelligence", "machine learning"];

  const containsExcludedTerm = (text: string): boolean =>
    excludedTerms.some((term) => text.toLowerCase().includes(term));

  if (
    containsExcludedTerm(post.name) ||
    containsExcludedTerm(post.tagline) ||
    containsExcludedTerm(post.description)
  ) {
    return showOnlyAi;
  }

  if (
    post.topics.some((t) => containsExcludedTerm(t.name) || containsExcludedTerm(t.description))
  ) {
    return showOnlyAi;
  }

  return !showOnlyAi;
};

export const filterPosts = (posts: ProductPost[], showOnlyAi = false): ProductPost[] => {
  return posts.filter((post) => hasAi(post, showOnlyAi));
};

export const formatNumber = (num: number): string => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(num);
};
