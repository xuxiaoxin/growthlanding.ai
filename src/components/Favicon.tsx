/**
 * Favicon — domain favicon with a letter-avatar fallback.
 *
 * Client Component only because onError needs an event handler. Falls back to
 * the domain's first letter on load error (Google's favicon service can
 * return a blank/grey tile). Lazy-loaded + async-decoded to keep LCP healthy.
 */
"use client";

import { useState } from "react";
import { faviconUrl, domainLetter } from "@/lib/format";

interface Props {
  domain: string;
  /** Tailwind size classes for the outer tile, e.g. "w-14 h-14 rounded-[14px]". */
  tileClassName?: string;
  /** Favicon <img> size in px (square). */
  size?: number;
}

export default function Favicon({
  domain,
  tileClassName = "w-14 h-14 rounded-[14px]",
  size = 48,
}: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative shrink-0 bg-stone-100 grid place-items-center overflow-hidden p-1.5 ${tileClassName}`}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={faviconUrl(domain)}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="relative z-[1] object-contain"
          style={{ width: size, height: size }}
        />
      )}
      {failed && (
        <span className="absolute font-bold text-stone-700">
          {domainLetter(domain)}
        </span>
      )}
    </div>
  );
}
