"use client";

import type { ReactNode } from "react";
import { useSpotlight } from "@/components/Spotlight";

/* LinkedPhrase (Elleta, 20 Sep 2026, case-study rebuild): a phrase in
   the text that points at a part of the example beside it. A thin solid
   iris underline marks it (dotted belongs to Term alone, Part Q). The
   small superscript number is in the code role, and it comes from the
   section's `phrases` order, so the numbering cannot drift from the
   prose.

   Hover, focus or tap lights every element in the section marked
   data-t="<key>". Nothing else is dimmed: the highlight adds emphasis,
   it never takes it away (Elleta's standing rule, 20 Sep 2026). A click
   pins it (aria-pressed), a second click or Escape clears it. The
   example still reads with nothing lit.

   It is a span with role="button", not a <button>: a button box cannot
   wrap inline, so a phrase longer than a line broke out of its sentence
   as a centred block (Drift 05 at 390, 21 Sep 2026). Enter and Space
   press it, like a button. */
export default function LinkedPhrase({ k, children }: { k: string; children: ReactNode }) {
  const ctx = useSpotlight();
  /* outside a Spotlight there is nothing to point at, so it is text */
  if (!ctx) return <>{children}</>;
  const n = ctx.numberOf(k);
  const on = ctx.active === k;
  return (
    <span
      role="button"
      tabIndex={0}
      data-component="LinkedPhrase"
      className={`linked-phrase${on ? " is-on" : ""}`}
      aria-pressed={ctx.pinned === k}
      onMouseEnter={() => ctx.hover(k)}
      onMouseLeave={() => ctx.hover(null)}
      onFocus={() => ctx.hover(k)}
      onBlur={() => ctx.hover(null)}
      onClick={() => ctx.toggle(k)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          ctx.toggle(k);
        }
      }}
    >
      {children}
      {n ? (
        <sup className="linked-phrase__n" aria-hidden="true">
          {n}
        </sup>
      ) : null}
    </span>
  );
}
