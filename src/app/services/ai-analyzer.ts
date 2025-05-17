"use server";

import OpenAI from "openai";
import { LRUCache } from "lru-cache";
import type { ProductPost } from "../types";

// Cache for storing AI analysis results
const analysisCache = new LRUCache<string, boolean>({
  max: 1000, // Store up to 1000 results
  ttl: 1000 * 60 * 60 * 24, // Cache for 24 hours
});

// Rate limiter configuration
const RATE_LIMIT = 50; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds
const requestTimestamps: number[] = [];

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AI_RELATED_PROMPT = `Analyze if this product description is related to AI, machine learning, natural language processing, GPT, neural networks, deep learning, or any other AI technologies. Consider:
- Direct mentions of AI technologies
- Implied AI functionality
- AI-related buzzwords
- Machine learning capabilities

Product Name: {name}
Tagline: {tagline}
Description: {description}
Topics: {topics}

Respond with a JSON object containing:
{
  "isAiRelated": boolean,
  "confidence": number (0-1),
  "reasoning": string
}`;

// Helper to check if we're within rate limits
const checkRateLimit = () => {
  const now = Date.now();
  requestTimestamps.push(now);
  
  // Remove timestamps older than the window
  while (requestTimestamps[0] < now - RATE_WINDOW) {
    requestTimestamps.shift();
  }
  
  return requestTimestamps.length < RATE_LIMIT;
};

// Helper to wait for rate limit
const waitForRateLimit = async () => {
  while (!checkRateLimit()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
};

// Generate a cache key for a post
const generateCacheKey = (post: {
  name: string;
  tagline: string;
  description: string;
  topics: { name: string; description: string }[];
}) => {
  return `${post.name}:${post.tagline}:${post.description}:${post.topics.map(t => t.name).join(',')}`;
};

// Batch analyze posts
export const batchAnalyzePosts = async (posts: {
  name: string;
  tagline: string;
  description: string;
  topics: { name: string; description: string }[];
}[]) => {
  const results = new Map<string, boolean>();
  const postsToAnalyze = posts.filter(post => {
    const cacheKey = generateCacheKey(post);
    const cachedResult = analysisCache.get(cacheKey);
    if (cachedResult !== undefined) {
      results.set(cacheKey, cachedResult);
      return false;
    }
    return true;
  });

  // Process in batches of 10
  for (let i = 0; i < postsToAnalyze.length; i += 10) {
    const batch = postsToAnalyze.slice(i, i + 10);
    await waitForRateLimit();

    const batchResults = await Promise.all(
      batch.map(async (post) => {
        const cacheKey = generateCacheKey(post);
        try {
          const topicsText = post.topics.map(t => `${t.name}: ${t.description}`).join(", ");
          const prompt = AI_RELATED_PROMPT
            .replace("{name}", post.name)
            .replace("{tagline}", post.tagline)
            .replace("{description}", post.description)
            .replace("{topics}", topicsText);

          const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
              {
                role: "system",
                content: "You are an AI content analyzer that determines if products are AI-related."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" }
          });

          const result = JSON.parse(completion.choices[0].message.content ?? "{}");
          const isAiRelated = result.confidence > 0.7 ? result.isAiRelated : false;
          
          analysisCache.set(cacheKey, isAiRelated);
          results.set(cacheKey, isAiRelated);
          return isAiRelated;
        } catch (error) {
          console.error("Error analyzing post with AI:", error);
          // Fallback to keyword matching
          const excludedTerms = [
            "ai", "gpt", "artificial intelligence", "machine learning",
            "neural network", "deep learning", "nlp", "natural language",
            "ml", "llm", "large language model"
          ];
          const containsExcludedTerm = (text: string): boolean =>
            excludedTerms.some((term) => text.toLowerCase().includes(term));

          const isAiRelated = 
            containsExcludedTerm(post.name) ||
            containsExcludedTerm(post.tagline) ||
            containsExcludedTerm(post.description) ||
            post.topics.some((t) => containsExcludedTerm(t.name) || containsExcludedTerm(t.description));

          analysisCache.set(cacheKey, isAiRelated);
          results.set(cacheKey, isAiRelated);
          return isAiRelated;
        }
      })
    );
  }

  return results;
};

export const analyzePost = async (post: {
  name: string;
  tagline: string;
  description: string;
  topics: { name: string; description: string }[];
}) => {
  const cacheKey = generateCacheKey(post);
  const cachedResult = analysisCache.get(cacheKey);
  
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const results = await batchAnalyzePosts([post]);
  return results.get(cacheKey) ?? false;
}; 