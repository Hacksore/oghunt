import "dotenv/config";
import { getAllPost, filterPosts } from "../src/app/lib/data.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const response = await getAllPost();
const posts = filterPosts(response.data.posts.nodes);

if ("errors" in posts) {
  console.error(posts.errors);
  process.exit(1);
}

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new Error(
    "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY must be set in .env",
  );
}

const client = new S3Client({
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  region: "auto",
});

try {
  const command = new PutObjectCommand({
    Bucket: "oghunt",
    Key: "latest.json",
    Body: JSON.stringify(posts),
  });

  await client.send(command);

  console.log("Successfully uploaded latest.json to R2");
} catch (err) {
  console.log(err);
}
