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

interface ParseResponse {
  results: AnalysisResult[];
  expectedCount?: number;
  actualCount: number;
}

const BATCH_ANALYSIS_PROMPT = readFileSync(join(process.cwd(), "src/app/lib/prompt.txt"), "utf-8");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Process posts in smaller chunks to avoid token limits
const CHUNK_SIZE = 50;

// WE DONT WANT ANY SLOP
const CONFIDENCE_THRESHOLD = 0.2;

// Helper function to format a product for analysis
const formatProductText = (
  product: {
    name: string;
    tagline: string;
    description: string;
    topics: { name: string; description: string }[];
  },
  index?: number,
): string => {
  const topicsText = product.topics.map((t) => `${t.name}: ${t.description}`).join(", ");
  return `Product ${index !== undefined ? index + 1 : 1}:
Name: ${product.name}
Tagline: ${product.tagline}
Description: ${product.description}
Topics: ${topicsText}
---`;
};

// Helper function to generate AI content
const generateAiContent = async (prompt: string) => {
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

  return response;
};

// Helper function to parse and validate AI response
const parseAiResponse = (
  response: Awaited<ReturnType<typeof ai.models.generateContent>>,
  expectedLength?: number,
): ParseResponse => {
  let parsedResponse: unknown;
  try {
    parsedResponse = parseJsonWithCodeFence(response.text ?? "[]");
  } catch (error: unknown) {
    console.error("Failed to parse JSON after cleaning:", error);
    throw new Error("Failed to analyze: Invalid response format");
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

    // Validate each result has required properties
    analysisResults = analysisResults.map((result) => {
      if (!result || typeof result !== "object") {
        throw new Error("Failed to analyze: Invalid result format", {
          cause: result,
        });
      }
      return {
        isAiRelated: result?.isAiRelated ?? false,
        confidence: result?.confidence ?? 0,
        reasoning: result?.reasoning ?? "No reasoning provided",
      };
    });
  } catch (error) {
    console.error("Error processing analysis results:", error);
    throw new Error("Failed to analyze: Invalid results format");
  }

  return {
    results: analysisResults,
    expectedCount: expectedLength,
    actualCount: analysisResults.length,
  };
};

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
  let totalMismatches = 0;

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
      .map((post, index) => formatProductText(post, index))
      .join("\n\n");

    const prompt = BATCH_ANALYSIS_PROMPT.replace("{products}", productsText);

    let response: Awaited<ReturnType<typeof ai.models.generateContent>>;
    try {
      response = await generateAiContent(prompt);
    } catch (error) {
      console.error("Failed to generate content for chunk:", error);
      throw new Error("Failed to analyze posts: AI service error");
    }

    const {
      results: analysisResults,
      expectedCount,
      actualCount,
    } = parseAiResponse(response, chunkPosts.length);

    if (expectedCount !== undefined && expectedCount !== actualCount) {
      totalMismatches++;
      console.warn(
        `Chunk ${Math.floor(i / CHUNK_SIZE) + 1}: Expected ${expectedCount} results but got ${actualCount}`,
      );
    }

    // Map results back to posts
    for (let j = 0; j < chunkPosts.length; j++) {
      const post = chunkPosts[j];
      const result = analysisResults[j];

      // If confidence is above our CONFIDENCE_THRESHOLD, we consider it AI-related
      // cause the model might give false positives and think it doesnt need to mark it explicitly
      const isAiRelated = result?.confidence >= CONFIDENCE_THRESHOLD ? result.isAiRelated : false;
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

  if (totalMismatches > 0) {
    console.warn(
      `Analysis complete with ${totalMismatches} chunks having mismatched result counts`,
    );
  }

  return results;
};
