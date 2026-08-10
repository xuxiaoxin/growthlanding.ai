/**
 * List newsletter subscribers from Neon.
 *
 * Usage:
 *   npx tsx scripts/list-subscribers.ts              # 概览（最近 50 条 + 统计）
 *   npx tsx scripts/list-subscribers.ts --all        # 全部导出
 *   npx tsx scripts/list-subscribers.ts --status subscribed   # 按状态过滤
 *
 * Reads DATABASE_URL from .env.local (Neon pooler endpoint).
 * Safe: read-only query, never writes.
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Manually load .env.local (same pattern as analyzers/scripts — no dotenv dep).
// Next.js loads .env.local automatically for dev/build, but tsx doesn't.
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = val;
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("ERROR: DATABASE_URL not set in .env.local");
  process.exit(1);
}

const sql = neon(url);

const args = new Set(process.argv.slice(2));
const statusFilter = args.has("--status")
  ? process.argv[process.argv.indexOf("--status") + 1]
  : null;
const showAll = args.has("--all");

(async () => {
  // --- stats ---
  const stats = await sql`
    SELECT
      count(*)::int AS total,
      count(*) FILTER (WHERE status = 'pending')::int AS pending,
      count(*) FILTER (WHERE status = 'subscribed')::int AS subscribed,
      count(*) FILTER (WHERE status = 'unsubscribed')::int AS unsubscribed
    FROM subscribers
  `;
  const s = stats[0];
  console.log("\n=== Subscriber stats ===");
  console.log(`  total:        ${s.total}`);
  console.log(`  pending:      ${s.pending}    (submitted, awaiting confirm)`);
  console.log(`  subscribed:   ${s.subscribed}   (confirmed)`);
  console.log(`  unsubscribed: ${s.unsubscribed}`);

  // --- list ---
  const limit = showAll ? 100000 : 50;
  const rows = statusFilter
    ? await sql`
        SELECT id, email, status, source, created_at, confirmed_at
        FROM subscribers WHERE status = ${statusFilter}
        ORDER BY created_at DESC LIMIT ${limit}
      `
    : await sql`
        SELECT id, email, status, source, created_at, confirmed_at
        FROM subscribers ORDER BY created_at DESC LIMIT ${limit}
      `;

  console.log(
    `\n=== ${showAll ? "All" : "Latest " + limit} subscribers${
      statusFilter ? ` (status=${statusFilter})` : ""
    } ===\n`
  );
  if (rows.length === 0) {
    console.log("  (none yet)");
  } else {
    for (const r of rows) {
      const date = new Date(r.created_at).toISOString().slice(0, 16);
      const confirm = r.confirmed_at
        ? ` ✓${new Date(r.confirmed_at).toISOString().slice(0, 10)}`
        : "";
      console.log(
        `  ${String(r.id).padStart(4)}  ${date}  ${r.email.padEnd(36)} ${r.status.padEnd(12)} ${r.source ?? "-"}${confirm}`
      );
    }
  }
})();
