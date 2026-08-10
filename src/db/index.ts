/**
 * Neon Postgres connection + Drizzle ORM instance.
 *
 * Uses @neondatabase/serverless HTTP driver — designed for serverless/edge
 * (Vercel Functions): no connection pool to warm up, no cold-start penalty,
 * fetch-based transport. This is the Vercel + Neon recommended pairing.
 *
 * Runtime connection string: DATABASE_URL (the pooler endpoint, see
 * .spec/Neon-config.md). The pooler (PgBouncer) is correct for serverless
 * because many short-lived function invocations share a small connection pool.
 *
 * Drizzle is instantiated once per module import; in a serverless function the
 * module is reused across warm invocations, so this is effectively a singleton
 * per warm instance. neon() itself manages HTTP connection reuse internally.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Fail loudly at import time if misconfigured — better than a cryptic error
  // deep in a request handler. This runs server-side only (Route Handler /
  // Server Action), never in the client bundle.
  throw new Error(
    "DATABASE_URL is not set. Copy the pooler connection string from " +
      ".spec/Neon-config.md into .env.local (local) or Vercel project env vars."
  );
}

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
export { schema };
