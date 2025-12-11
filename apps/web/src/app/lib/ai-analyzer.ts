"use server";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GoogleGenAI } from "@google/genai";
import env from "../env";
import { PRODUCT_HUNT_ID, parseJsonWithCodeFence } from "../utils/string";

interface AnalysisResult {
  isAiRelated: boolean;
  reasoning: string;
}

interface ParseResponse {
  results: AnalysisResult[];
  expectedCount?: number;
  actualCount: number;
}

const BATCH_ANALYSIS_PROMPT = readFileSync(join(process.cwd(), "src/app/lib/prompt.txt"), "utf-8");

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Process posts in smaller chunks to avoid token limits
// NOTE: hoping making this smaller gives us more accurate results
const CHUNK_SIZE = 35;

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

// Helper function to generate AI content using Batch API
// Batch API processes requests asynchronously at 50% cost
// https://ai.google.dev/gemini-api/docs/batch-api
const generateAiContentBatch = async (prompts: string[]) => {
  // Create inline requests for the batch API
  const inlineRequests = prompts.map((prompt) => ({
    contents: [
      {
        parts: [{ text: prompt }],
        role: "user" as const,
      },
    ],
    config: {
      systemInstruction: {
        parts: [
          {
            text: "You are an AI content analyzer that determines if products are AI-related. You must respond with valid JSON only.",
          },
        ],
      },
    },
  }));

  // Create batch job with all requests
  const batchJob = await ai.batches.create({
    model: "gemini-2.5-flash",
    src: inlineRequests,
    config: {
      displayName: `ai-analysis-batch-${Date.now()}`,
    },
  });

  if (!batchJob.name) {
    throw new Error("Batch job created but name is missing");
  }

  const batchJobName = batchJob.name;
  console.log(`Created batch job: ${batchJobName}`);

  // Poll for completion (with reasonable timeout)
  const MAX_WAIT_TIME = 5 * 60 * 1000; // 5 minutes max wait
  const POLL_INTERVAL = 10 * 1000; // Poll every 10 seconds
  const startTime = Date.now();

  const completedStates = new Set([
    "JOB_STATE_SUCCEEDED",
    "JOB_STATE_FAILED",
    "JOB_STATE_CANCELLED",
    "JOB_STATE_EXPIRED",
  ]);

  let currentBatchJob = await ai.batches.get({
    name: batchJobName,
  });

  while (currentBatchJob.state && !completedStates.has(currentBatchJob.state)) {
    if (Date.now() - startTime > MAX_WAIT_TIME) {
      throw new Error(
        `Batch job ${batchJobName} did not complete within ${MAX_WAIT_TIME / 1000} seconds. Job state: ${currentBatchJob.state ?? "unknown"}. You may need to poll for results later.`,
      );
    }

    console.log(
      `Batch job state: ${currentBatchJob.state ?? "unknown"}. Waiting ${POLL_INTERVAL / 1000} seconds...`,
    );
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    currentBatchJob = await ai.batches.get({
      name: batchJobName,
    });
  }

  if (!currentBatchJob.state) {
    throw new Error("Batch job state is missing");
  }

  if (currentBatchJob.state === "JOB_STATE_FAILED") {
    let errorMessage = "Unknown error";
    if (typeof currentBatchJob.error === "string") {
      errorMessage = currentBatchJob.error;
    } else if (
      currentBatchJob.error &&
      typeof currentBatchJob.error === "object" &&
      "message" in currentBatchJob.error
    ) {
      const errorObj = currentBatchJob.error as { message?: string };
      errorMessage = errorObj.message || JSON.stringify(currentBatchJob.error);
    } else if (currentBatchJob.error) {
      errorMessage = JSON.stringify(currentBatchJob.error);
    }
    throw new Error(`Batch job failed: ${errorMessage}`);
  }

  if (currentBatchJob.state !== "JOB_STATE_SUCCEEDED") {
    throw new Error(`Batch job ended with state: ${currentBatchJob.state}`);
  }

  // Retrieve results
  if (!currentBatchJob.dest?.inlinedResponses) {
    throw new Error("Batch job succeeded but no inline responses found");
  }

  console.log(
    `Batch job completed successfully. Retrieved ${currentBatchJob.dest.inlinedResponses.length} responses`,
  );

  // Return array of responses matching the order of input prompts
  type InlineResponse = {
    response?: {
      text?: string | null;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };
    error?: unknown;
  };
  return currentBatchJob.dest.inlinedResponses.map((inlineResponse: InlineResponse) => {
    if (inlineResponse.error) {
      throw new Error(
        `Error in batch response: ${typeof inlineResponse.error === "string" ? inlineResponse.error : JSON.stringify(inlineResponse.error)}`,
      );
    }

    if (!inlineResponse.response) {
      throw new Error("Batch response missing response field");
    }

    return inlineResponse.response;
  });
};

// Helper function to parse and validate AI response
// Works with both regular API responses and batch API responses
const parseAiResponse = (
  response: { text?: string | null; usageMetadata?: unknown },
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

  // Prepare all chunks and their prompts upfront
  const chunks: (typeof posts)[] = [];
  const prompts: string[] = [];

  for (let i = 0; i < posts.length; i += CHUNK_SIZE) {
    const chunkPosts = posts.slice(i, i + CHUNK_SIZE);
    chunks.push(chunkPosts);

    // Format chunk posts into a single prompt
    const productsText = chunkPosts
      .map((post, index) => formatProductText(post, index))
      .join("\n\n");

    const prompt = BATCH_ANALYSIS_PROMPT.replace("{products}", productsText);
    prompts.push(prompt);

    console.log(
      `Prepared chunk ${chunks.length} with ${chunkPosts.length} posts (${prompt.length} characters)`,
    );
  }

  console.log(
    `Created ${chunks.length} chunks. Submitting batch job with ${prompts.length} requests...`,
  );

  // Submit all requests in a single batch job
  let batchResponses: Awaited<ReturnType<typeof generateAiContentBatch>>;
  try {
    batchResponses = await generateAiContentBatch(prompts);
    console.log(`Batch job completed. Processing ${batchResponses.length} responses...`);
  } catch (error) {
    console.error("Failed to process batch job:", error);
    throw new Error("Failed to analyze posts: AI service error");
  }

  // Process each response and map results back to posts
  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunkPosts = chunks[chunkIndex];
    const response = batchResponses[chunkIndex];

    if (!response) {
      console.error(`Missing response for chunk ${chunkIndex + 1}`);
      continue;
    }

    // Log token usage if available
    if (response.usageMetadata) {
      console.log({
        chunk: chunkIndex + 1,
        inputTokens: response.usageMetadata.promptTokenCount,
        outputTokens: response.usageMetadata.candidatesTokenCount,
        totalTokens: response.usageMetadata.totalTokenCount,
      });
    }

    const {
      results: analysisResults,
      expectedCount,
      actualCount,
    } = parseAiResponse(response, chunkPosts.length);

    if (expectedCount !== undefined && expectedCount !== actualCount) {
      totalMismatches++;
      console.warn(
        `Chunk ${chunkIndex + 1}: Expected ${expectedCount} results but got ${actualCount}`,
      );
    }

    // Map results back to posts
    for (let j = 0; j < chunkPosts.length; j++) {
      const post = chunkPosts[j];
      const result = analysisResults[j];

      if (!result) {
        console.warn(`Missing result for post ${post.name} in chunk ${chunkIndex + 1}`);
        continue;
      }

      console.log({
        post: post.name,
        isAiRelated: result.isAiRelated,
        reasoning: result?.reasoning,
      });

      // Use post ID as the cache key
      results.set(post.id, result.isAiRelated);
    }
  }

  if (totalMismatches > 0) {
    console.warn(
      `Analysis complete with ${totalMismatches} chunks having mismatched result counts`,
    );
  }

  results.set(PRODUCT_HUNT_ID, false);

  console.log(
    `Analysis complete. Processed ${posts.length} posts using 1 batch API request (50% cost savings)`,
  );

  return results;
};
