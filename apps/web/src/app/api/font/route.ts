/**
 * Originally from Vercel's Satori project.
 * @link https://github.com/vercel/satori/blob/main/playground/pages/api/font.ts
 */

import type { NextRequest } from "next/server";
import { fontParams } from "@/app/utils/fetch-font";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  if (req.nextUrl.pathname !== "/api/font") {
    return new Response("Not Found", { status: 404 });
  }
  const url = new URL(req.url);

  const parsed = fontParams.decodeRequest(req);
  if (!parsed.success) {
    return new Response(parsed.error.toString(), {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });
  }
  const props = parsed.data.input;

  try {
    let API = `https://fonts.googleapis.com/css2?family=${props.family}:wght@${props.weight}`;
    if (props.text) {
      // allow font optimization if we pass text => only getting the characters we need
      API += `&text=${encodeURIComponent(props.text)}`;
    }

    const cssResponse = await fetch(API, {
      headers: {
        // Make sure it returns TTF.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
    });

    if (!cssResponse.ok) {
      throw new Error(`Failed to fetch CSS from Google Fonts: ${cssResponse.status}`);
    }

    const css = await cssResponse.text();

    const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

    if (!resource || !resource[1]) {
      return new Response(`Font URL not found in CSS for ${props.family} weight ${props.weight}`, {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const fontUrl = resource[1];
    const res = await fetch(fontUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch font file from ${fontUrl}: ${res.status}`);
    }

    // Verify we got a font file, not HTML
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("text/html")) {
      throw new Error(`Font URL returned HTML instead of font file: ${fontUrl}`);
    }

    // Make sure not to mess it around with compression when developing it locally.
    if (url.hostname === "localhost") {
      res.headers.delete("content-encoding");
      res.headers.delete("content-length");
    }

    return res;
  } catch (error) {
    console.error("Error in font API:", error);
    return new Response(
      `Font fetch error: ${error instanceof Error ? error.message : String(error)}`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }
}
