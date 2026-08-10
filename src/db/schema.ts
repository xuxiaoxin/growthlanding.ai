/**
 * Drizzle schema — Neon Postgres.
 *
 * Two concerns live here:
 *   1. `subscribers` — the newsletter lead-capture table (active now).
 *   2. `users` / `accounts` / `sessions` — RESERVED for Auth.js (not wired in
 *      this phase). Defining the tables now means enabling login later is a
 *      code change, not a migration — zero DB downtime.
 *
 * Why no Auth.js middleware yet: webui is ~1090 static pages (SSG) whose SEO
 * value depends on staying statically rendered. Auth.js middleware would force
 * matched routes to render per-request, degrading the SEO pages. Login is
 * deferred to the Track/watchlist phase, where only new /app/* routes need to
 * be dynamic — a precise middleware matcher then won't touch the SEO pages.
 *
 * Tables are pushed to Neon via `drizzle-kit push` (see drizzle.config.ts).
 */

import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
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
// RESERVED for Auth.js — not wired this phase.
// These mirror the @auth/drizzle-adapter schema so enabling login later is
// a config change, not a migration.
// See https://authjs.dev/getting-started/adapters/drizzle
// ---------------------------------------------------------------------------

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
