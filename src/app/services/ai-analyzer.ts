"use server";

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BATCH_ANALYSIS_PROMPT = `Analyze if these product descriptions are related to AI, machine learning, natural language processing, GPT, neural networks, deep learning, or any other AI technologies. Consider:
- Direct mentions of AI technologies
- Implied AI functionality
- AI-related buzzwords
- AI Models (e.g. GPT-4, Claude, Gemini, and including "Custom Trained Modules", etc.)
- Machine learning capabilities
- Any developer tooling that that mentions AI

For each product, respond with a JSON object containing:
{
  "isAiRelated": boolean,
  "confidence": number (0-1),
  "reasoning": string
}

Products to analyze:
{products}

Respond with a JSON array of results in the same order as the products.`;

// Batch analyze posts - only called from /api/update-posts
export const batchAnalyzePosts = async (
  posts: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    topics: { name: string; description: string }[];
  }[],
) => {
  const results = new Map<string, boolean>();

  // Format all posts into a single prompt
  const productsText = posts
    .map((post, index) => {
      const topicsText = post.topics.map((t) => `${t.name}: ${t.description}`).join(", ");
      return `Product ${index + 1}:
Name: ${post.name}
Tagline: ${post.tagline}
Description: ${post.description}
Topics: ${topicsText}
---`;
    })
    .join("\n\n");

  const prompt = BATCH_ANALYSIS_PROMPT.replace("{products}", productsText);

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an AI content analyzer that determines if products are AI-related. Respond with a JSON array of results.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const responseContent = completion.choices[0].message.content;

  interface AnalysisResult {
    isAiRelated: boolean;
    confidence: number;
    reasoning: string;
  }

  let analysisResults: AnalysisResult[];
  try {
    const parsed = JSON.parse(responseContent ?? "[]");
    // If the response is an object with a results array, use that
    if (parsed.results && Array.isArray(parsed.results)) {
      analysisResults = parsed.results;
    }
    // If it's not an array, wrap it in an array
    else if (!Array.isArray(parsed)) {
      analysisResults = [parsed];
    } else {
      analysisResults = parsed;
    }

    // Validate that we have the expected number of results
    if (analysisResults.length !== posts.length) {
      console.warn(`Expected ${posts.length} results but got ${analysisResults.length}`);
      // Pad the results array with default values if needed
      while (analysisResults.length < posts.length) {
        analysisResults.push({
          isAiRelated: false,
          confidence: 0,
          reasoning: "No analysis result available",
        });
      }
    }

    // Validate each result has required properties
    analysisResults = analysisResults.map((result) => ({
      isAiRelated: result?.isAiRelated ?? false,
      confidence: result?.confidence ?? 0,
      reasoning: result?.reasoning ?? "No reasoning provided",
    }));
  } catch (error) {
    console.error("Error parsing API response:", error);
    // Create default results for all posts
    analysisResults = posts.map(() => ({
      isAiRelated: false,
      confidence: 0,
      reasoning: "Error analyzing post",
    }));
  }

  // Map results back to posts
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const result = analysisResults[i];

    // Lower confidence threshold to 0.5 and handle undefined results
    const isAiRelated = result?.confidence > 0.5 ? result.isAiRelated : false;
    console.log({
      post: post.name,
      isAiRelated,
      confidence: result?.confidence,
      reasoning: result?.reasoning,
    });

    // Use post ID as the cache key
    results.set(post.id, isAiRelated);
  }

  return results;
};

// This function should only be called from /api/update-posts
export const analyzePost = async (post: {
  id: string;
  name: string;
  tagline: string;
  description: string;
  topics: { name: string; description: string }[];
}) => {
  const results = await batchAnalyzePosts([post]);
  return results.values().next().value ?? false;
};
