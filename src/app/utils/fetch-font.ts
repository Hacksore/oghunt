import { z } from 'zod';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

type Primitives = boolean | number | string | null;
type JsonValue = JsonValue[] | Primitives | { [key: string]: JsonValue };

const jsonStr = z.string().transform((str, ctx) => {
  try {
    return JSON.parse(str) as JsonValue;
  } catch (error) {
    console.log(error);
    ctx.addIssue({ code: 'custom', message: 'Needs to be JSON' });
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
    toSearchString: (obj: (typeof schema)['_input']) => {
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

export const fetchFont = (family: string, weight?: number, text?: string) =>
  fetch(
    `${baseUrl}/api/font?${fontParams.toSearchString({
      family,
      weight,
      text,
    })}`,
  ).then((res) => res.arrayBuffer());
