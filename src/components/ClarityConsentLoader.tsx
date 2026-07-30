"use client";

/**
 * Consent-gated Clarity loader.
 *
 * Watches the persisted consent choice and injects / withdraws Clarity:
 *  - `granted`  → inject the Clarity snippet (idempotent — next/script dedupes).
 *  - `denied`   → call `clarity('consent', false)` to clear Clarity cookies
 *                 and end any active session.
 *  - `null`     → do nothing (banner is showing; no tracking yet).
 *
 * This runs as a client component so it can read localStorage. It renders
 * nothing visible — only conditionally mounts a next/script `<Script>` when
 * consent is granted.
 *
 * Why not inject in <head> at build time? Clarity's default behavior loads
 * immediately and runs in a cookieless "no-consent" mode until consent is
 * passed. That still collects anonymous replay/heatmap data pre-consent. The
 * product requirement here is stricter: ZERO Clarity activity before grant,
 * so the snippet is deferred until analytics_storage is explicitly granted.
 */

import { useEffect, useState } from "react";
import Script from "next/script";
import { CLARITY_SNIPPET } from "@/lib/clarity";
import { CONSENT_STORAGE_KEY, type ConsentChoice } from "@/lib/consent";

export default function ClarityConsentLoader() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  // Read the persisted consent after hydration.
  useEffect(() => {
    function sync() {
      const v = window.localStorage?.getItem(CONSENT_STORAGE_KEY);
      setChoice(v === "granted" || v === "denied" ? v : null);
    }
    sync();

    // Stay in sync when ConsentBanner (or footer "Cookie Settings") writes a
    // new choice. storage fires for other tabs too; that's fine/harmless here.
    window.addEventListener("storage", sync);
    // Custom event lets the same-tab banner notify us without a reload.
    window.addEventListener("consent-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("consent-change", sync);
    };
  }, []);

  // On withdrawal: tell Clarity to nuke its cookies + end the session.
  useEffect(() => {
    if (choice === "denied" && typeof window !== "undefined" && window.clarity) {
      // Per Microsoft docs: clears Clarity cookies and prevents further
      // tracking until new consent is granted.
      window.clarity("consent", false);
    }
  }, [choice]);

  // Inject the snippet only when consent is explicitly granted.
  if (choice !== "granted") return null;

  return (
    <Script
      id="clarity-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: CLARITY_SNIPPET }}
    />
  );
}
