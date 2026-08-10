"use client";

/**
 * NewsletterSubscribe — client island for the weekly-digest lead-capture form.
 *
 * Renders inline (footer / playbook end) as the ONLY interactive element on
 * otherwise-static pages. Posts to /api/subscribe which writes Neon + syncs
 * Resend. State machine: idle → loading → success | error.
 *
 * Design:
 *   - Single email field — lowest friction (email-capture-plan §4.1). No
 *     category checkboxes (would leak taxonomy→score associations; deferred to
 *     a Pro feature).
 *   - Honeypot (_gotcha) — hidden field bots fill; server silently discards.
 *     Chosen over captcha to protect conversion (captcha kills it).
 *   - Privacy microcopy next to the button + /privacy link visible BEFORE
 *     submit (EEA good-faith requirement; see privacy page §1).
 *   - trackEmailSubmit fires ONLY the `source` label to GA4 — never the email
 *     (desensitization red line, lib/track.ts).
 *
 * Consent note: email submission is its own consent dimension (PII, not
 * cookie). It does NOT depend on the analytics_storage cookie banner — EEA
 * visitors who rejected cookies can still subscribe. trackEmailSubmit will
 * simply be suppressed by gtag for them (by design).
 */

import { useState } from "react";
import Link from "next/link";
import { trackEmailSubmit } from "@/lib/track";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  /** GA4 source label — identifies which placement converted. */
  source: string;
  /** Optional compact variant for tight spaces (footer). */
  compact?: boolean;
}

export default function NewsletterSubscribe({ source, compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMsg("Please enter your email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const resp = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source }),
      });

      if (!resp.ok) {
        throw new Error(`request_failed_${resp.status}`);
      }

      const data = await resp.json();
      // Fire GA4 event — source label only, never the email.
      trackEmailSubmit({ source });

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("[newsletter] subscribe failed:", err);
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  // --- success state ---
  if (status === "success") {
    return (
      <div
        className="rounded-[12px] border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-text-secondary"
        role="status"
      >
        <p className="font-medium text-accent-ink">
          ✓ You&apos;re subscribed.
        </p>
        <p className="mt-0.5 text-text-muted">
          Check your inbox to confirm. One email per week — unsubscribe anytime.
        </p>
      </div>
    );
  }

  // --- idle / loading / error states share the form ---
  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {/* Honeypot — visually hidden, but present in the DOM so bots fill it.
          Do NOT use type="hidden" (some bots skip those); use a real field
          moved off-screen. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        value=""
        onChange={() => {}}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          maxLength={255}
          placeholder="you@example.com"
          autoComplete="email"
          aria-label="Email address"
          className="flex-1 rounded-[10px] border border-border bg-card px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-[10px] bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-ink transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      {!compact && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-text-muted">
          One email per week. Unsubscribe anytime. See our{" "}
          <Link
            href="/privacy"
            className="text-text-secondary underline hover:text-accent-ink"
          >
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </form>
  );
}
