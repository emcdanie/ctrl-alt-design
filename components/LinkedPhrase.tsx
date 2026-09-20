"use client";

import type { ReactNode } from "react";
import { useCaseSection } from "@/components/CaseSection";

/* LinkedPhrase (Elleta, 20 Sep 2026, case-study rebuild): a phrase in
   the text that points at a part of the example beside it. It extends
   the Term pattern, so the affordance is the one the site already
   teaches: a dotted iris underline means "this does something". The
   small superscript number is in the code role, and it comes from the
   section's `phrases` order, so the numbering cannot drift from the
   prose.

   Hover, focus or tap lights every element in the section marked
   data-t="<key>" and fades the rest of that frame back. A click pins
   it (aria-pressed), a second click or Escape clears it. The example
   still reads with nothing lit: the highlight adds emphasis, it never
   supplies meaning that is missing without it. */
export default function LinkedPhrase({ k, children }: { k: string; children: ReactNode }) {
  const ctx = useCaseSection();
  /* outside a CaseSection there is nothing to point at, so it is text */
  if (!ctx) return <>{children}</>;
  const n = ctx.numberOf(k);
  const on = ctx.active === k;
  return (
    <button
      type="button"
      data-component="LinkedPhrase"
      className={`linked-phrase${on ? " is-on" : ""}`}
      aria-pressed={ctx.pinned === k}
      onMouseEnter={() => ctx.hover(k)}
      onMouseLeave={() => ctx.hover(null)}
      onFocus={() => ctx.hover(k)}
      onBlur={() => ctx.hover(null)}
      onClick={() => ctx.toggle(k)}
    >
      {children}
      {n ? (
        <sup className="linked-phrase__n" aria-hidden="true">
          {n}
        </sup>
      ) : null}
    </button>
  );
}
