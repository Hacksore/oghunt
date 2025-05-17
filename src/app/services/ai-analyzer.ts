"use server";

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BATCH_ANALYSIS_PROMPT = `Analyze if these product descriptions are related to AI, machine learning, natural language processing, GPT, neural networks, deep learning, or any other AI technologies. Consider:
- Direct mentions of AI technologies
- Implied AI functionality
- AI-related buzzwords
- Machine learning capabilities

For each product, respond with a JSON object containing:
{
  "isAiRelated": boolean,
  "confidence": number (0-1),
  "reasoning": string
}

Products to analyze:
{products}

Respond with a JSON array of results in the same order as the products.`;

// Batch analyze posts
export const batchAnalyzePosts = async (posts: {
  name: string;
  tagline: string;
  description: string;
  topics: { name: string; description: string }[];
}[]) => {
  const results = new Map<string, boolean>();

  // Format all posts into a single prompt
  const productsText = posts.map((post, index) => {
    const topicsText = post.topics.map(t => `${t.name}: ${t.description}`).join(", ");
    return `Product ${index + 1}:
Name: ${post.name}
Tagline: ${post.tagline}
Description: ${post.description}
Topics: ${topicsText}
---`;
  }).join("\n\n");

  const prompt = BATCH_ANALYSIS_PROMPT.replace("{products}", productsText);

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are an AI content analyzer that determines if products are AI-related. Respond with a JSON array of results."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" }
  });

  const analysisResults = JSON.parse(completion.choices[0].message.content ?? "[]");
  
  // Map results back to posts
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const result = analysisResults[i];
    const isAiRelated = result?.confidence > 0.7 ? result.isAiRelated : false;
    const cacheKey = `${post.name}:${post.tagline}:${post.description}:${post.topics.map((t: { name: string; description: string }) => t.name).join(',')}`;
    results.set(cacheKey, isAiRelated);
  }

  return results;
};

export const analyzePost = async (post: {
  name: string;
  tagline: string;
  description: string;
  topics: { name: string; description: string }[];
}) => {
  const results = await batchAnalyzePosts([post]);
  return results.values().next().value ?? false;
}; 