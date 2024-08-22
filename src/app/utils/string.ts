import { ProductPost } from "../types";



// NOTE: this only works on the API Post type and not the db type
export const hasAi = (post: ProductPost, showOnlyAi: boolean): boolean => {
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
    return showOnlyAi;
  }

  if (
    post.topics.some(
      (t) =>
        containsExcludedTerm(t.name) ||
        containsExcludedTerm(t.description),
    )
  ) {
    return showOnlyAi;
  }

  return !showOnlyAi;
};

// NOTE: git either the posts that have no api or the posts that are all ai
export const filterPosts = (posts: ProductPost[], showOnlyAi = false): ProductPost[] => {
  return posts.filter((post) => hasAi(post, showOnlyAi));
};
