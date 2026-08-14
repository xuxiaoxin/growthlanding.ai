"use client";

/**
 * AccountMenu — client island for the Header account entry.
 *
 * A pure client island (no server data passed in): on mount it fetches
 * GET /api/me to learn the login state, because the session cookie is
 * httpOnly and unreadable from the browser. Like NewsletterSubscribe it is a
 * state-machine island (loading → guest | authed) and does NOT affect the
 * host page's SSG determination — the surrounding Header stays a static
 * Server Component.
 *
 * Sign-out is a native form POST to /api/auth/signout (no client-side
 * `signOut` import). Auth.js v5 enforces a CSRF double-submit check on POST,
 * so the token is fetched from /api/auth/csrf and embedded as a hidden field.
 *
 * State transitions on navigation: sign-in (OAuth redirect) and sign-out
 * (form POST) both trigger full page reloads, which resets the module-level
 * cache, so stale auth state is never shown.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Status = "loading" | "guest" | "authed";

interface MeResponse {
  authed: boolean;
  name: string | null;
  image: string | null;
}

// Module-level cache: client-side nav (next/link) within the App Router keeps
// the same JS context, so this prevents a loading-flash on every route change.
// A full reload (sign-in / sign-out flows) re-evaluates the module → cache reset.
let cachedMe: MeResponse | null = null;

export default function AccountMenu() {
  const [status, setStatus] = useState<Status>("loading");
  const [name, setName] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [open, setOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Probe login state on mount (cached module-level to avoid re-flash).
  useEffect(() => {
    let cancelled = false;

    const apply = (data: MeResponse) => {
      if (cancelled) return;
      if (data.authed) {
        setName(data.name);
        setImage(data.image);
        setStatus("authed");
      } else {
        setStatus("guest");
      }
    };

    if (cachedMe) {
      apply(cachedMe);
      return;
    }

    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: MeResponse) => {
        cachedMe = data;
        apply(data);
      })
      .catch(() => {
        // Network/parse failure → never block the header; default to guest.
        const fallback: MeResponse = { authed: false, name: null, image: null };
        cachedMe = fallback;
        apply(fallback);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Lazily fetch the CSRF token once we know the visitor is authed, so the
  //    sign-out form POST passes Auth.js v5's double-submit check.
  useEffect(() => {
    if (status !== "authed" || csrfToken) return;
    let cancelled = false;
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d: { csrfToken?: string }) => {
        if (!cancelled && d.csrfToken) setCsrfToken(d.csrfToken);
      })
      .catch(() => {
        /* leave null — button stays disabled; sign-out degrades gracefully */
      });
    return () => {
      cancelled = true;
    };
  }, [status, csrfToken]);

  // 3. Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // --- loading: neutral skeleton (no authed/guest flash, no layout shift) ---
  if (status === "loading") {
    return (
      <div
        className="h-7 w-7 animate-pulse rounded-full bg-border/70"
        aria-hidden="true"
      />
    );
  }

  // --- guest: minimal Sign in link ---
  if (status === "guest") {
    return (
      <Link
        href="/app/login"
        className="whitespace-nowrap text-sm font-medium text-text-secondary transition-colors hover:text-accent-ink"
      >
        Sign in
      </Link>
    );
  }

  // --- authed: avatar button + dropdown ---
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  const showAvatar = Boolean(image) && !imgError;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {showAvatar ? (
          /* Remote OAuth avatar (GitHub/Google). <img> is intentional: the
             provider domains are dynamic and next/image would need a brittle
             remotePatterns allowlist for a 30px image where optimization is
             moot. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image as string}
            alt=""
            width={30}
            height={30}
            onError={() => setImgError(true)}
            className="h-[30px] w-[30px] rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-primary text-xs font-semibold text-white ring-1 ring-border">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-[10px] border border-border bg-card shadow-[0_4px_16px_rgba(24,24,27,0.08),0_1px_3px_rgba(24,24,27,0.06)]"
        >
          {name && (
            <div className="border-b border-border px-3.5 py-2.5">
              <p className="truncate text-sm font-medium text-text-primary">
                {name}
              </p>
            </div>
          )}
          <Link
            href="/app/dashboard"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="block px-3.5 py-2.5 text-sm text-text-secondary transition-colors hover:bg-background hover:text-accent-ink"
          >
            Dashboard
          </Link>
          <Link
            href="/app/watchlist"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="block px-3.5 py-2.5 text-sm text-text-secondary transition-colors hover:bg-background hover:text-accent-ink"
          >
            Watchlist
          </Link>
          <div className="border-t border-border">
            <form action="/api/auth/signout" method="post">
              {csrfToken && (
                <input type="hidden" name="csrfToken" value={csrfToken} />
              )}
              <button
                type="submit"
                role="menuitem"
                disabled={!csrfToken}
                className="block w-full px-3.5 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-background hover:text-accent-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
