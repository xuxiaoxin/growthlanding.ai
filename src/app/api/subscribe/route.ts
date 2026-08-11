/**
 * POST /api/subscribe — newsletter lead-capture endpoint.
 *
 * This is the ONLY dynamic endpoint in an otherwise 100%-SSG site. It stays
 * minimal on purpose: validate → insert into Neon (idempotent). No session,
 * no auth, no middleware — the SSG SEO pages (~1090) are untouched.
 *
 * Neon is the single source of truth for subscribers. Resend is used ONLY as
 * a delivery channel at send time: the digest script reads the subscribers
 * table from Neon and sends via POST /emails. The restricted Resend API key
 * (RESEND_API_KEY) can send but cannot manage Audiences, so we deliberately
 * do NOT sync contacts here.
 *
 * Flow:
 *   1. Honeypot check — if the hidden `_gotcha` field is filled, silently
 *      accept (200) and discard. Bots fill every field; humans never see it.
 *   2. Email validation — RFC-ish regex + length cap. Reject 400 on invalid.
 *   3. INSERT ... ON CONFLICT (email) DO NOTHING — repeat subscribes are
 *      idempotent, never error. Returns whether a new row was created.
 *
 * Privacy / desensitization:
 *   - The email lives only in Neon (disclosed in /privacy). Resend receives
 *     each email only at send time, transiently.
 *   - GA4 tracking (trackEmailSubmit) is fired client-side with ONLY the
 *     `source` label — never the email address (see lib/track.ts red line).
 *   - Response body contains no PII: just { ok, confirmed }.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

// Pragmatic email regex — not fully RFC 5322 (that regex is unreadable), but
// catches the common malformed cases. The real authority is the confirmation
// email: double opt-in means a typo simply never confirms.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 255;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // --- honeypot ---
  // A hidden field bots tend to fill. If non-empty, pretend success so the bot
  // can't tell it was rejected (and to avoid leaking that detection happened).
  const gotcha = String(body._gotcha ?? "").trim();
  if (gotcha) {
    return NextResponse.json({ ok: true, confirmed: false });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const source = String(body.source ?? "newsletter").trim().slice(0, 50);

  // --- validation ---
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    );
  }

  // --- insert into Neon (idempotent) ---
  let createdNew = false;
  try {
    const result = await db
      .insert(subscribers)
      .values({ email, source, status: "pending" })
      .onConflictDoNothing({ target: subscribers.email })
      .returning({ id: subscribers.id });

    createdNew = result.length > 0;
  } catch (err) {
    // Log server-side; don't leak DB internals to the client.
    console.error("[subscribe] Neon insert failed:", err);
    return NextResponse.json(
      { ok: false, error: "database" },
      { status: 500 }
    );
  }

  // Neon is the single source of truth for subscribers. Resend is used ONLY
  // as a delivery channel at send time (the restricted API key can send emails
  // but cannot manage Audiences/contacts). So we do NOT sync to a Resend
  // Audience here — the digest-sending script reads the subscribers table from
  // Neon directly and calls POST /emails per recipient.

  return NextResponse.json({ ok: true, confirmed: createdNew });
}
