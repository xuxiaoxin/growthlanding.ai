/**
 * Drizzle Kit configuration.
 *
 * Used by `drizzle-kit push` (sync schema → Neon) and `drizzle-kit generate`
 * (create SQL migration files). Run locally with the UNPOOLED connection —
 * drizzle-kit needs a direct session for DDL, and the pooler (PgBouncer)
 * restricts some session-level features used during schema introspection.
 *
 * Usage:
 *   npx drizzle-kit push     # push schema in src/db/schema.ts to Neon
 *   npx drizzle-kit generate # generate SQL migration files instead
 *
 * Env: reads DATABASE_URL_UNPOOLED (the non-pooler endpoint from
 * .spec/Neon-config.md). Set it in .env.local or export before running.
 */

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
});
