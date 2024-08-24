import { ProductPost } from "../types";

export const hasAi = (post: ProductPost, showOnlyAi = false): boolean => {
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
