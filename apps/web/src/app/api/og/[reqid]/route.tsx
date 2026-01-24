import { ImageResponse } from "next/og";
import env from "@/app/env";
import { fetchFont } from "@/app/utils/fetch-font";

// Route segment config
export const runtime = "edge";

// Image metadata
const size = {
  width: 1200,
  height: 630,
};

const API_URL = env.NODE_ENV === "production" ? "https://oghunt.com" : "http://localhost:3000";

// Helper function to convert ArrayBuffer to base64 (Edge runtime compatible)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      binary += String.fromCharCode(byte);
    }
  }
  return btoa(binary);
}

// Image generation
export async function GET(_request: Request, _context: { params: Promise<{ reqid?: string }> }) {
  try {
    const [inter900, inter700, inter400] = await Promise.all([
      fetchFont("Inter", 900),
      fetchFont("Inter", 700),
      fetchFont("Inter", 400),
    ]);

    const baseImageResponse = await fetch(new URL("./base-og.png", import.meta.url));
    if (!baseImageResponse.ok) {
      throw new Error(`Failed to load base image: ${baseImageResponse.status}`);
    }

    const baseImageRawData = await baseImageResponse.arrayBuffer();
    const imageData = `data:image/png;base64,${arrayBufferToBase64(baseImageRawData)}`;

    const statsResponse = await fetch(`${API_URL}/api/stats`, {
      cache: "no-cache",
    });

    if (!statsResponse.ok) {
      throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
    }

    const { allPostCount, noAiPostCount, aiPostCount } = await statsResponse.json();

    if (!allPostCount || allPostCount === 0) {
      throw new Error("Invalid stats data: allPostCount is 0 or undefined");
    }

    const aiPercentage = Math.floor((aiPostCount / allPostCount) * 100);

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${imageData})`,
        }}
        tw="flex flex-col items-center pb-12 justify-end"
      >
        <p style={{ fontWeight: 700 }} tw="flex text-gray-400 w-[90%] items-start pl-2 text-2xl">
          SlopMeter
        </p>
        <div tw="flex w-[90%] h-20 bg-[#111111] rounded-3xl z-40">
          <div
            style={{
              width: `${aiPercentage}%`,
              backgroundColor: "#ff495b",
            }}
            tw="flex h-full rounded-l-3xl"
          >
            <p style={{ fontWeight: 800 }} tw="flex items-center pl-4 text-4xl">
              AI • {aiPostCount}
            </p>
          </div>

          <p
            style={{ fontWeight: 800 }}
            tw="flex text-white justify-end items-center pl-4 text-4xl"
          >
            No AI • {noAiPostCount}
          </p>
        </div>
      </div>,
      {
        ...size,
        fonts: [
          { name: "Inter", data: inter900, weight: 900 },
          { name: "Inter", data: inter700, weight: 700 },
          { name: "Inter", data: inter400, weight: 400 },
        ],
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    // Return a simple error image instead of blank
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#17171F",
          color: "#ffffff",
          fontSize: "32px",
        }}
      >
        Error loading image
      </div>,
      {
        ...size,
      },
    );
  }
}
