"use client";

import type { ReactNode } from "react";
import { useSpotlight } from "@/components/Spotlight";

/* Scan-and-read (Elleta, 20 Sep 2026, Part J item 2; mock
   _private/specs/section-scan-read-mock.html).

   A text-heavy section read two ways at once: three to five scan points
   on the left, the paragraphs on the right. Pointing at a point lights
   the phrase in the paragraph that uses THE SAME WORDS, and pointing at
   the phrase lights the point. Nothing else changes.

   It runs on the same Spotlight engine as the case studies' linked
   phrases, so there is one highlight behaviour on the site, not two.

   TWO STYLES, TWO MEANINGS: a scan point is a control and a phrase is
   its target, so the phrase carries NO underline at rest. The dotted
   underline stays reserved for Term, which opens a definition. */

/** one scan point: a control, keyed to the phrase it lights */
export function ScanPoint({ k, children }: { k: string; children: ReactNode }) {
  const ctx = useSpotlight();
  if (!ctx) return <li className="scan__item">{children}</li>;
  const on = ctx.active === k;
  return (
    <li className="scan__item">
      <button
        type="button"
        className={`scan__point${on ? " is-on" : ""}`}
        aria-pressed={ctx.pinned === k}
        onMouseEnter={() => ctx.hover(k)}
        onMouseLeave={() => ctx.hover(null)}
        onFocus={() => ctx.hover(k)}
        onBlur={() => ctx.hover(null)}
        onClick={() => ctx.toggle(k)}
      >
        <span className="scan__dot" aria-hidden="true" />
        <span>{children}</span>
      </button>
    </li>
  );
}

/** the phrase in the prose: a target, and a pointer the other way */
export function ScanPhrase({ k, children }: { k: string; children: ReactNode }) {
  const ctx = useSpotlight();
  if (!ctx) return <>{children}</>;
  return (
    <span
      className="scan__phrase"
      data-t={k}
      onMouseEnter={() => ctx.hover(k)}
      onMouseLeave={() => ctx.hover(null)}
    >
      {children}
    </span>
  );
}

/** the two columns: scan on the left, read on the right */
export function ScanRead({ points, children }: { points: ReactNode; children: ReactNode }) {
  return (
    <div className="scan-read">
      <ul className="scan" aria-label="In short">
        {points}
      </ul>
      <div className="scan-read__prose">{children}</div>
    </div>
  );
}
