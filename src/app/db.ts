import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const { DATABASE_URL, DATABASE_TOKEN } = process.env;

if (!DATABASE_URL || !DATABASE_TOKEN) {
  throw new Error("DATABASE_URL and DATABASE_TOKEN must be set");
}

const libsql = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);

const prisma = new PrismaClient({ adapter });

export default prisma;
