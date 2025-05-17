import type { ProductPost } from "../types";
import { analyzePost } from "../services/ai-analyzer";

export const PRODUCT_HUNT_NAME = "OGHUNT";

export const shouldIncludePost = async (
  post: {
    name: ProductPost["name"];
    tagline: ProductPost["tagline"];
    description: ProductPost["description"];
    topics: ProductPost["topics"];
  },
  showOnlyAi = false,
): Promise<boolean> => {
  if (post.name === PRODUCT_HUNT_NAME) {
    return !showOnlyAi;
  }

  const isAiRelated = await analyzePost(post);
  return isAiRelated === showOnlyAi;
};

export const filterPosts = async (posts: ProductPost[], showOnlyAi = false): Promise<ProductPost[]> => {
  const results = await Promise.all(
    posts.map(async (post) => {
      const shouldInclude = await shouldIncludePost(post, showOnlyAi);
      return shouldInclude ? post : null;
    })
  );
  return results.filter((post): post is ProductPost => post !== null);
};

export const formatNumber = (num: number): string => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(num);
};
