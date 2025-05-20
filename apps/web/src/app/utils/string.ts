import type { ProductPost } from "../types";

export const PRODUCT_HUNT_NAME = "OGHUNT";

export const shouldIncludePost = async (
  post: {
    name: ProductPost["name"];
    tagline: ProductPost["tagline"];
    description: ProductPost["description"];
    topics: ProductPost["topics"];
    hasAi?: boolean;
  },
  showOnlyAi = false,
): Promise<boolean> => {
  if (post.name === PRODUCT_HUNT_NAME) {
    return !showOnlyAi;
  }

  return post.hasAi === showOnlyAi;
};

export const filterPosts = async (
  posts: ProductPost[],
  showOnlyAi = false,
): Promise<ProductPost[]> => {
  const results = await Promise.all(
    posts.map(async (post) => {
      const shouldInclude = await shouldIncludePost(post, showOnlyAi);
      return shouldInclude ? post : null;
    }),
  );
  return results.filter((post): post is ProductPost => post !== null);
};

export const formatNumber = (num: number): string => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(num);
};

/**
 * Removes JSON code fences (```json ... ```) from a string and attempts to parse the result as JSON.
 *
 * @param {string} input The string to process, which may or may not contain JSON code fences.
 * @returns {object | null} Returns the parsed JSON object if successful, or null if the input is not valid JSON (after removing fences).
 * Returns null if input is not a string.
 */
export const parseJsonWithCodeFence = (input: string) => {
  if (typeof input !== "string") {
    return null; // Handle non-string input
  }

  let jsonString = input.trim();

  const splt = jsonString.split('```');
  if (splt.length > 1) {
  const splitWithBrackets = splt.find((s) => s.includes('{'));
  if (splitWithBrackets) {
   		if (!splitWithBrackets.startsWith('{')) {
   			// remove everything before the first bracket
   			jsonString = splitWithBrackets.substring(splitWithBrackets.indexOf('{'));
   		}
   		// remove everything after the last bracket
   		const lastBracketIndex = jsonString.lastIndexOf('}');
   		jsonString = jsonString.substring(0, lastBracketIndex + 1);
   	}
   } else {
   	if (!jsonString.startsWith('{')) {
   		jsonString = jsonString.substring(jsonString.indexOf('{'));
   	}
   	if (!jsonString.endsWith('}')) {
   		jsonString = jsonString.substring(0, jsonString.lastIndexOf('}') + 1);
   	}
   }
  // Attempt to parse the JSON
  try {
    const parsedJSON = JSON.parse(jsonString);
    return parsedJSON;
  } catch (error) {
    // Handle JSON parsing errors
    console.error("Error parsing JSON:", error);
    return null; // Or you could throw the error, depending on your needs
  }
};
