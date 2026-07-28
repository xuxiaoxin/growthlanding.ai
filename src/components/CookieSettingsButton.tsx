"use client";

/**
 * Footer "Cookie Settings" link — re-opens the consent banner so visitors can
 * change their mind. GDPR requires consent to be as easy to withdraw as to
 * give; this is the withdrawal entry point.
 *
 * Client Component because it needs an onClick handler that calls the global
 * window.reopenConsent() function registered by ConsentBanner.
 */

export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.reopenConsent?.()}
      className={className}
    >
      Cookie Settings
    </button>
  );
}
