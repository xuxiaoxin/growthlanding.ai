"use client";

/**
 * GDPR cookie consent banner (bottom-fixed).
 *
 * - Shows for visitors who haven't chosen yet.
 * - Persisted to localStorage so it won't nag returning visitors.
 * - Accept and Reject buttons are deliberately visually equal (same size,
 *   same solid style) — EDPB Guidelines 03/2022 require "Reject All" to be
 *   as easy as "Accept All". Do not restyle one weaker than the other.
 * - Registers window.reopenConsent so the footer "Cookie Settings" link can
 *   re-open the banner, satisfying the "consent must be as easy to withdraw
 *   as to give" requirement.
 *
 * Note on region behavior: Consent Mode's `default` command (in layout.tsx)
 * sets non-EEA regions to "granted" by default, so this banner is most
 * relevant to EEA/UK visitors. It is still rendered globally so any visitor
 * who wants to explicitly opt in/out can — but returning non-EEA visitors
 * won't see it because readConsent() returns a value only after they
 * interact (the banner does auto-dismiss via the localStorage check). For a
 * pure non-EEA visitor with no stored choice the banner will appear once
 * until they pick.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_STORAGE_KEY,
  readConsent,
  updateConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";

export default function ConsentBanner() {
  // null = not yet hydrated / unknown; false = dismissed by a choice.
  const [visible, setVisible] = useState<boolean | null>(null);

  // After hydration: show only if the visitor hasn't chosen yet.
  useEffect(() => {
    const existing = readConsent();
    setVisible(existing === null);
  }, []);

  // Re-open hook for the footer "Cookie Settings" link.
  useEffect(() => {
    window.reopenConsent = () => setVisible(true);
    return () => {
      delete window.reopenConsent;
    };
  }, []);

  // Clear the stored choice BEFORE showing, so re-opening is a clean slate.
  useEffect(() => {
    if (visible) {
      window.localStorage?.removeItem(CONSENT_STORAGE_KEY);
    }
  }, [visible]);

  function choose(choice: ConsentChoice) {
    updateConsent(choice === "granted");
    writeConsent(choice);
    setVisible(false);
  }

  // Avoid rendering anything during SSR / before hydration to prevent flashes
  // and hydration mismatches (SSR can't read localStorage).
  if (visible !== true) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 sm:pb-5 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl bg-card border border-border-strong rounded-[14px] shadow-[0_14px_34px_-12px_rgba(24,24,27,0.32)] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="flex-1 text-[13px] sm:text-sm text-text-secondary leading-relaxed">
            We use cookies for Google Analytics to understand traffic. See our{" "}
            <Link
              href="/privacy"
              className="text-accent-ink underline underline-offset-2 hover:text-accent"
            >
              Privacy Policy
            </Link>
            .
          </p>
          {/* Equal-prominence buttons: same size, same solid weight, same
              color prominence. EDPB Guidelines 03/2022 require "Reject All"
              to be as easy as "Accept All" — Reject must not look weaker. */}
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="flex-1 sm:flex-none min-h-[40px] px-5 py-2.5 rounded-[10px] text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="flex-1 sm:flex-none min-h-[40px] px-5 py-2.5 rounded-[10px] text-sm font-semibold bg-accent hover:bg-accent-ink text-white transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
