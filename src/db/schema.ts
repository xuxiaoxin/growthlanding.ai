/**
 * Drizzle schema — Neon Postgres.
 *
 * Three concerns live here:
 *   1. `subscribers` — the newsletter lead-capture table (active).
 *   2. `users` / `accounts` / `sessions` — Auth.js account tables, mirroring the
 *      @auth/drizzle-adapter standard schema (https://authjs.dev/getting-started/adapters/drizzle).
 *      Wired with next-auth v5 (JWT session strategy). JS property names MUST
 *      match what the adapter expects (e.g. accounts.refresh_token, not
 *      refreshToken) — that is why property names are snake_case here while DB
 *      column names are also snake_case. `sessions` is defined for completeness
 *      but NOT written at runtime under JWT strategy.
 *   3. `watchlist` — saved-site tracking for logged-in users.
 *
 * Auth + SSG strategy: login uses next-auth v5 with JWT sessions and NO
 * middleware/proxy (Next 16 renamed middleware → proxy, but the Auth.js proxy
 * is optional). All auth checks live in RSC `auth()` calls inside /app/*
 * dynamic routes; the ~1090 static SEO pages never import or call auth, so they
 * stay SSG. See .spec/prd/002-accounts-and-watchlist.md.
 *
 * Tables are pushed to Neon via `drizzle-kit push` (see drizzle.config.ts).
 */

import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  serial,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// subscribers — newsletter lead capture (ACTIVE)
// ---------------------------------------------------------------------------
// Written by POST /api/subscribe. email is unique (ON CONFLICT DO NOTHING makes
// repeat subscribes idempotent). status flows pending → subscribed →
// unsubscribed to support double opt-in (Resend sends a confirmation; on
// confirm we flip to subscribed). `source` records which placement converted
// (newsletter_footer / newsletter_playbook) — a public, non-sensitive label
// safe to also send to GA4 via trackEmailSubmit.

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  // pending      — submitted, awaiting double-opt-in confirmation
  // subscribed   — confirmed, eligible to receive the digest
  // unsubscribed — opted out
  source: varchar("source", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  confirmedAt: timestamp("confirmed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

// ---------------------------------------------------------------------------
// Auth.js account tables — mirror the @auth/drizzle-adapter standard schema.
// OAuth only (GitHub + Google), no Credentials provider → no password column.
// No email magic link → no verificationTokens table needed.
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable("accounts", {
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ---------------------------------------------------------------------------
// watchlist — saved sites for logged-in users.
// Stores only (userId, domain); site details are read from the static
// public/data JSON at render time (no duplication). The unique index on
// (userId, domain) makes toggle operations idempotent. Cascades on user delete.
// ---------------------------------------------------------------------------

export const watchlist = pgTable(
  "watchlist",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    domain: varchar("domain", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("watchlist_user_domain_idx").on(t.userId, t.domain)],
);
