import { ProductPost } from "../types";

// NOTE: this only works on the Post type and not the db type
export const hasAi = (post: ProductPost, showAi = false): boolean => {
  const excludedTerms = [
    "ai",
    "gpt",
    "artificial intelligence",
    "machine learning",
  ];

  const containsExcludedTerm = (text: string): boolean =>
    excludedTerms.some((term) => text.toLowerCase().includes(term));

  if (
    containsExcludedTerm(post.name) ||
    containsExcludedTerm(post.tagline) ||
    containsExcludedTerm(post.description)
  ) {
    return showAi;
  }

  if (
    post.topics.some(
      (t) =>
        containsExcludedTerm(t.name) ||
        containsExcludedTerm(t.description),
    )
  ) {
    return showAi;
  }

  return !showAi;
};

// NOTE: this only works on the Post type and not the db type
export const filterPosts = (posts: ProductPost[], showAi = false): ProductPost[] => {
  return posts.filter((post) => hasAi(post, showAi));
};
