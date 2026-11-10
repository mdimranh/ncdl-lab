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
      "postgresql://neondb_owner:npg_0xtYo4PgWLaT@ep-old-sunset-bds7nvuh-pooler.c-8.us-east-2.aws.neon.tech/ndcl?sslmode=require&channel_binding=require",
  },
  verbose: true,
  strict: true,
} satisfies Config;
