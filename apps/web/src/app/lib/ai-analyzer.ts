"use server";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleGenAI } from "@google/genai";
import { parseJsonWithCodeFence } from "../utils/string";

interface AnalysisResult {
  isAiRelated: boolean;
  confidence: number;
  reasoning: string;
}

const BATCH_ANALYSIS_PROMPT = readFileSync(join(process.cwd(), "src/app/lib/prompt.txt"), "utf-8");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Process posts in smaller chunks to avoid token limits
const CHUNK_SIZE = 50;

// WE DONT WANT ANY SLOP
const CONFIDENCE_THRESHOLD = 0.25;

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

  // Process posts in chunks
  for (let i = 0; i < posts.length; i += CHUNK_SIZE) {
    const chunkPosts = posts.slice(i, i + CHUNK_SIZE);
    console.log(
      "Analyzing chunk",
      Math.floor(i / CHUNK_SIZE) + 1,
      "of",
      Math.ceil(posts.length / CHUNK_SIZE),
    );
    console.log("Posts in chunk:", chunkPosts.length);
    console.log(
      "Prompt length:",
      BATCH_ANALYSIS_PROMPT.length +
        chunkPosts.reduce(
          (acc, post) =>
            acc +
            post.name.length +
            post.tagline.length +
            post.description.length +
            post.topics.reduce(
              (tacc, topic) => tacc + topic.name.length + topic.description.length,
              0,
            ),
          0,
        ),
      "characters",
    );

    // Format chunk posts into a single prompt
    const productsText = chunkPosts
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
        systemInstruction:
          "You are an AI content analyzer that determines if products are AI-related. You must respond with valid JSON only.",
      },
    });

    console.log({
      inputTokens: response.usageMetadata?.promptTokenCount,
      outputTokens: response.usageMetadata?.candidatesTokenCount,
      totalTokens: response.usageMetadata?.totalTokenCount,
    });

    // Try to parse the response with improved error handling
    let parsedResponse: unknown;
    try {
      parsedResponse = JSON.parse(response.text ?? "[]");
    } catch (e) {
      console.warn("Initial JSON parse failed, attempting to clean and parse:", e);
      try {
        parsedResponse = parseJsonWithCodeFence(response.text ?? "[]");
      } catch (e2) {
        console.error("Failed to parse JSON after cleaning:", e2);
        // If all parsing attempts fail, create a default response
        parsedResponse = {
          results: chunkPosts.map(() => ({
            isAiRelated: false,
            confidence: 0,
            reasoning: "Failed to parse model response",
          })),
        };
      }
    }

    let analysisResults: AnalysisResult[];
    try {
      // If the response is an object with a results array, use that
      if (
        parsedResponse &&
        typeof parsedResponse === "object" &&
        "results" in parsedResponse &&
        Array.isArray(parsedResponse.results)
      ) {
        analysisResults = parsedResponse.results;
      }
      // If it's not an array, wrap it in an array
      else if (!Array.isArray(parsedResponse)) {
        analysisResults = [parsedResponse as AnalysisResult];
      } else {
        analysisResults = parsedResponse as AnalysisResult[];
      }

      // Validate that we have the expected number of results
      if (!analysisResults || analysisResults.length !== chunkPosts.length) {
        console.warn(
          "Expected",
          chunkPosts.length,
          "results but got",
          analysisResults?.length ?? 0,
        );
        // Create default results for all posts
        analysisResults = chunkPosts.map(() => ({
          isAiRelated: false,
          confidence: 0,
          reasoning: "Failed to parse model response",
        }));
      }

      // Validate each result has required properties
      analysisResults = analysisResults.map((result) => ({
        isAiRelated: result?.isAiRelated ?? false,
        confidence: result?.confidence ?? 0,
        reasoning: result?.reasoning ?? "No reasoning provided",
      }));
    } catch (error) {
      console.error("Error processing analysis results:", error);
      // Create default results for all posts
      analysisResults = chunkPosts.map(() => ({
        isAiRelated: false,
        confidence: 0,
        reasoning: "Error analyzing post",
      }));
    }

    // Map results back to posts
    for (let j = 0; j < chunkPosts.length; j++) {
      const post = chunkPosts[j];
      const result = analysisResults[j];

      const isAiRelated = result?.confidence > CONFIDENCE_THRESHOLD ? result.isAiRelated : false;
      console.log({
        post: post.name,
        isAiRelated,
        confidence: result?.confidence,
        reasoning: result?.reasoning,
      });

      // Use post ID as the cache key
      results.set(post.id, isAiRelated);
    }
  }

  return results;
};
