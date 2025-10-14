import { faker } from "@faker-js/faker";
import type { Prisma } from "@prisma/client";

import prisma from "../src/app/db";

const createFakePost = (_: unknown, id: number): Prisma.PostCreateManyInput => {
  return {
    createdAt: new Date(),
    name: faker.lorem.sentence(),
    deleted: false,
    description: faker.lorem.paragraph(),
    hasAi: false,
    media: Array.from({ length: 10 }, () => ({
      url: faker.image.urlPicsumPhotos({ width: 600, height: 400 }),
      videoUrl: null,
    })),
    tagline: faker.lorem.sentence(),
    url: faker.internet.url(),
    votesCount: 67,
    thumbnailUrl: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
    id: `${id}`,
  };
};

console.log("Seeding database with fake posts...");

const result = await prisma.post.deleteMany({});
console.log(`Deleted ${result.count} existing posts.`);

await prisma.post.createMany({
  data: Array.from({ length: 4000 }, createFakePost),
});

console.log("Seeding completed.");
