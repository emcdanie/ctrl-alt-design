import type { ElementType, ReactNode } from "react";

export type HeadingTier = "hero" | "page" | "section" | "case";

/**
 * THE display heading primitive (corrective pass 2026-07-17): every
 * display heading renders through this. Unique 700 all-caps at four
 * ramp tiers; semantic level is decoupled from the visual tier via
 * `as`. `accent` renders the established hero treatment (key word /
 * trailing line in iris). The bubble-heading title, home hero
 * headline, and keycap lockup keep their own shells but consume the
 * same tokens. Unique never renders below 24px (gate-enforced) and
 * never in body, UI, card titles, eyebrows, meta, nav, buttons, chips.
 */
export default function Heading({
  tier = "section",
  as,
  accent,
  id,
  className = "",
  children,
}: {
  tier?: HeadingTier;
  /** semantic element; defaults h1 for hero/page, h2 otherwise */
  as?: "h1" | "h2" | "h3";
  /** optional accent segment rendered in iris after the main text */
  accent?: ReactNode;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const Tag: ElementType = as ?? (tier === "hero" || tier === "page" ? "h1" : "h2");
  return (
    <Tag id={id} className={`display-heading display-heading--${tier} ${className}`.trim()}>
      {children}
      {accent != null ? <span className="display-heading__accent"> {accent}</span> : null}
    </Tag>
  );
}
