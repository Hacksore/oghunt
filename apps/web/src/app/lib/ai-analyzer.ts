"use server";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleGenAI } from "@google/genai";
import { parseJsonWithCodeFence } from "../utils/string";

const BATCH_ANALYSIS_PROMPT = readFileSync(
  join(process.cwd(), "src/app/lib/prompt.txt"),
  "utf-8",
);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Analyze multiple posts - only called from /api/update-posts
export const analyzePosts = async (
  posts: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    topics: { name: string; description: string }[];
  }[],
): Promise<Map<string, boolean>> => {
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

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: prompt,
    config: {
      systemInstruction: "You are an AI content analyzer that determines if products are AI-related. Respond with a JSON array of results, DO NOT OUTPUT MARKDOWN CODE FENCES.",
    }
  });

  const responseContent = parseJsonWithCodeFence(response.text ?? "[]");
  console.log("Response content:", responseContent);

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
