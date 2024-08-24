import { fetchFont } from "@/app/utils/fetch-font";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const API_URL =
  process.env.NODE_ENV === "production" ? "https://oghunt.com" : "http://localhost:3000";

// Image generation
export async function GET() {
  const [inter900, inter700, inter400] = await Promise.all([
    fetchFont("Inter", 900),
    fetchFont("Inter", 700),
    fetchFont("Inter", 400),
  ]);

  const baseImageRawData = await fetch(new URL("./base-og.png", import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

  console.log("baseImageRawData", baseImageRawData);

  const imageData = `data:image/png;base64,${Buffer.from(baseImageRawData).toString("base64")}`;
  // TODO: make sure prod
  const { allPostCount, aiPostCount } = await fetch(`${API_URL}/api/stats`).then((res) =>
    res.json(),
  );

  const barWidth = Math.floor((aiPostCount / allPostCount) * 100);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: `url(${imageData})`,
        }}
        tw="flex flex-col items-center pb-12 justify-end"
      >
        <div tw="flex w-[80%] h-20 bg-[#111111] rounded-3xl z-40">
          <div
            style={{
              width: `${barWidth}%`,
              backgroundImage: "linear-gradient(90deg, #fda4af 20%, #fb923c 100%)",
            }}
            tw="flex h-full rounded-3xl"
          >
            <p style={{ fontWeight: 800 }} tw="flex items-center pl-4 text-4xl">
              AI • {barWidth}
            </p>
          </div>

          <p
            style={{ fontWeight: 800 }}
            tw="flex text-white justify-end items-center pl-4 text-4xl"
          >
            No AI • {barWidth}
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter900, weight: 900 },
        { name: "Inter", data: inter700, weight: 700 },
        { name: "Inter", data: inter400, weight: 400 },
      ],
    },
  );
}
