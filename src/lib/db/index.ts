import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../../../env";
import * as schema from "./schema";

// creating the pool

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  max: 10,
});

export const db = drizzle(pool, { schema });
