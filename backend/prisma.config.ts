import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "prisma/config";

// Force load the .env file from the current directory
config({ path: resolve(process.cwd(), ".env") });

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  // CRITICAL: Prisma 7 will crash if this returns undefined during config load
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in the environment variables.");
  }

  const url = new URL(databaseUrl);
  if (url.username === "postgress") {
    url.username = "postgres";
  }

  return url.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'node ./prisma/seed.js'
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});