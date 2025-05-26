import prisma from "@/app/db";
import { fetchFont } from "@/app/utils/fetch-font";
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

  // const baseImageRawData = await fetch(new URL("../../api/og/base-og.png", import.meta.url)).then((res) =>
  //   res.arrayBuffer(),
  // );

  // const imageData = `data:image/png;base64,${Buffer.from(baseImageRawData).toString("base64")}`;

  // Extract the ID from the slug (format: "id-product-name")
  const id = params.slug.split("-")[0];

  const post = await prisma.post.findFirst({
    where: {
      id: id,
    },
  });

  if (!post) {
    return new Response("Product not found", { status: 404 });
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        // backgroundImage: `url(${imageData})`,
      }}
      tw="flex flex-col items-center justify-center"
    >
      <div tw="flex flex-col items-center justify-center w-[90%]">
        <p style={{ fontWeight: 700 }} tw="text-gray-400 text-2xl mb-4">
          OGHUNT
        </p>
        <h1 style={{ fontWeight: 900 }} tw="text-white text-6xl text-center mb-4">
          {post.name}
        </h1>
        <p style={{ fontWeight: 400 }} tw="text-gray-400 text-2xl text-center">
          {post.tagline}
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
}
