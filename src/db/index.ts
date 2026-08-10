/**
 * Neon Postgres connection + Drizzle ORM instance.
 *
 * Uses @neondatabase/serverless HTTP driver — designed for serverless/edge
 * (Vercel Functions): no connection pool to warm up, no cold-start penalty,
 * fetch-based transport. This is the Vercel + Neon recommended pairing.
 *
 * BUILD-TIME SAFETY (important):
 * Next.js loads every route module during `next build`'s "collect page data"
 * phase. On Vercel the Neon integration injects env vars at RUNTIME, not
 * during build — so at build time the URL is absent. To avoid failing the
 * build on a missing env var that only matters at runtime, we fall back to a
 * dummy placeholder when the URL is missing. The placeholder never gets used:
 * the only consumer is /api/subscribe, which is a dynamic route (`ƒ`) that is
 * never invoked at build time. A real request with no URL configured will
 * surface a clear connection error instead of crashing the build.
 *
 * Connection string resolution (tries in order):
 *   1. growthlanding_ai_DATABASE_URL — Vercel × Neon integration (pooler,
 *      correct for serverless). Production path.
 *   2. DATABASE_URL — local development (.env.local).
 *   3. placeholder — build-time-only dummy; never queried at runtime.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl =
  process.env.growthlanding_ai_DATABASE_URL || // Vercel × Neon integration
  process.env.DATABASE_URL || // local dev (.env.local)
  "postgresql://build-placeholder@build-placeholder.neon.neon/db"; // build-time only

const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });
export { schema };
