import { fetchFont } from "@/app/utils/fetch-font";
import { headers } from "next/headers";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  console.log(params);
  const [inter900, inter700, inter400] = await Promise.all([
    fetchFont("Inter", 900),
    fetchFont("Inter", 700),
    fetchFont("Inter", 400),
  ]);

  // Extract the ID from the slug (format: "id-product-name")
  const id = params.slug.split("-")[0];

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const response = await fetch(`${baseUrl}/api/post/${params.slug}`);

  if (!response.ok) {
    return new Response("Product not found", { status: 404 });
  }

  const post = await response.json();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      tw="flex flex-col bg-[#17171F] items-center justify-center relative"
    >
      <div tw="flex flex-col items-center justify-center w-[90%]">
        <h1 style={{ fontWeight: 900 }} tw="text-white text-8xl text-center mb-4">
          {post.name}
        </h1>
        <p style={{ fontWeight: 400 }} tw="text-white text-4xl text-center">
          {post.tagline}
        </p>
      </div>
      <p style={{ fontWeight: 700 }} tw="text-white text-4xl text-bold absolute bottom-8 left-8">
        OGHUNT
      </p>
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
}
