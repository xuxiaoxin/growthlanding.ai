/**
 * POST /api/subscribe — newsletter lead-capture endpoint.
 *
 * This is the ONLY dynamic endpoint in an otherwise 100%-SSG site. It stays
 * minimal on purpose: validate → insert into Neon (idempotent) → best-effort
 * sync to Resend. No session, no auth, no middleware — the SSG SEO pages
 * (~1090) are untouched.
 *
 * Flow:
 *   1. Honeypot check — if the hidden `_gotcha` field is filled, silently
 *      accept (200) and discard. Bots fill every field; humans never see it.
 *   2. Email validation — RFC-ish regex + length cap. Reject 400 on invalid.
 *   3. INSERT ... ON CONFLICT (email) DO NOTHING — repeat subscribes are
 *      idempotent, never error. Returns whether a new row was created.
 *   4. Resend sync — best-effort. If RESEND_API_KEY/AUDIENCE_ID are unset
 *      (e.g. during the approval-wait period) or the call fails, the
 *      subscription in Neon still succeeds. We log but don't block.
 *
 * Privacy / desensitization:
 *   - The email lives only in Neon + Resend (both disclosed in /privacy).
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

  // --- best-effort Resend sync ---
  // During the Resend-approval-wait window these env vars may be empty; the
  // Neon row is the source of truth and we backfill Resend later. Never let a
  // Resend failure fail the subscription.
  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (createdNew && resendKey && audienceId) {
    try {
      const resp = await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          audience_id: audienceId,
          unsubscribed: false,
        }),
      });
      // 200/201 = created; 422 = already exists (fine, idempotent). Others = log.
      if (!resp.ok && resp.status !== 422) {
        const text = await resp.text().catch(() => "");
        console.error(
          `[subscribe] Resend sync non-idempotent failure (${resp.status}):`,
          text
        );
      }
    } catch (err) {
      console.error("[subscribe] Resend sync threw:", err);
    }
  }

  return NextResponse.json({ ok: true, confirmed: createdNew });
}
