import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:mdimranh@localhost:5432/ncdl";

const globalForDb = globalThis as unknown as {
  ncdlPool?: Pool;
};

const pool =
  globalForDb.ncdlPool ??
  new Pool({
    connectionString,
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.ncdlPool = pool;
}

export const db = drizzle(pool, { schema });
export { pool };
