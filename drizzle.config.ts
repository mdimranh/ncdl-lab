import type { Config } from "drizzle-kit";
import { existsSync } from "node:fs";

// drizzle-kit runs outside Next.js, so load .env explicitly when present.
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:mdimranh@localhost:5432/ncdl",
  },
  verbose: true,
  strict: true,
} satisfies Config;
