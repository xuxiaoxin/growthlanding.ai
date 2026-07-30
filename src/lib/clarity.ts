/**
 * Microsoft Clarity — session replay & heatmaps.
 *
 * Privacy posture: DEFERRED injection. The Clarity snippet is only added to
 * the page AFTER the visitor grants `analytics_storage` consent (handled by
 * `components/ClarityConsentLoader.tsx`). This is intentionally stricter than
 * Clarity's own Consent Mode (which loads immediately and runs in a
 * cookieless "no-consent" mode pre-grant): under our deferred-load policy,
 * ZERO Clarity data (replays, heatmaps, cookies) is collected before consent.
 *
 * On consent withdrawal (footer "Cookie Settings" → Reject), the loader calls
 * `clarity('consent', false)` to erase any Clarity cookies and end the
 * session, satisfying the "as easy to withdraw as to give" requirement.
 */

/** Microsoft Clarity project ID. */
export const CLARITY_ID = "xuhgmo2uch";

/**
 * The official Clarity loader snippet, with the project ID baked in. Injected
 * via `dangerouslySetInnerHTML` on a `next/script` `<Script>` only once consent
 * is granted. `?ref=bwt` retained from the official install snippet.
 */
export const CLARITY_SNIPPET = `
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${CLARITY_ID}");
`;

/** TypeScript ambient shim so `window.clarity` typechecks at call sites. */
declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}
