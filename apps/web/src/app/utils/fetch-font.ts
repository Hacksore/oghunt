import { z } from "zod";

import env from "../env";

// Use the same URL logic as the OG route for consistency
const baseUrl = env.NODE_ENV === "production" ? "https://oghunt.com" : "http://localhost:3000";

type Primitives = boolean | number | string | null;
type JsonValue = JsonValue[] | Primitives | { [key: string]: JsonValue };

const jsonStr = z.string().transform((str, ctx) => {
  try {
    return JSON.parse(str) as JsonValue;
  } catch (error) {
    console.log(error);
    ctx.addIssue({ code: "custom", message: "Needs to be JSON" });
  }
});

export function zodParams<TType>(schema: z.ZodType<TType>) {
  const querySchema = z.object({
    input: jsonStr.pipe(schema),
  });
  return {
    decodeRequest: (req: Request) => {
      const url = new URL(req.url);
      const obj = Object.fromEntries(url.searchParams.entries());

      return querySchema.safeParse(obj);
    },
    toSearchString: (obj: (typeof schema)["_input"]) => {
      schema.parse(obj);
      return `input=${encodeURIComponent(JSON.stringify(obj))}`;
    },
  };
}

export const fontParams = zodParams(
  z.object({
    family: z.string(),
    weight: z.number().default(400),
    text: z.string().optional(),
  }),
);

export const fetchFont = async (family: string, weight?: number, text?: string) => {
  const url = `${baseUrl}/api/font?${fontParams.toSearchString({
    family,
    weight,
    text,
  })}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch font: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get("content-type");
  // Check if we got HTML instead of a font file
  if (contentType?.includes("text/html")) {
    const text = await res.text();
    throw new Error(
      `Font API returned HTML instead of font file. Response: ${text.substring(0, 200)}`,
    );
  }

  return res.arrayBuffer();
};
