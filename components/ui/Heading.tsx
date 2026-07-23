import type { CSSProperties, ElementType, ReactNode } from "react";

export type HeadingTier = "hero" | "page" | "section" | "case";

/**
 * THE display heading primitive (corrective pass 2026-07-17): every
 * display heading renders through this. Unique 700 all-caps at four
 * ramp tiers, each a DISTINCT rendered size (type-scale fix, 22 Jul
 * 2026): page (page + case-study H1s) > hero > section (section
 * heads + case beat headlines) > case (the smallest display step,
 * next-case pointers). Semantic level is decoupled from the visual
 * tier via `as`. `accent` renders the established hero treatment (key word /
 * trailing line in iris). The home hero headline and keycap lockup
 * keep their own shells but consume the same tokens; bubble page
 * headers are parked (last live at e25eefc). Unique never renders below 24px (gate-enforced) and
 * never in body, UI, card titles, eyebrows, meta, nav, buttons, chips.
 */
export default function Heading({
  tier = "section",
  as,
  accent,
  id,
  className = "",
  style,
  children,
}: {
  tier?: HeadingTier;
  /** semantic element; defaults h1 for hero/page, h2 otherwise */
  as?: "h1" | "h2" | "h3";
  /** optional accent segment rendered in iris after the main text */
  accent?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const Tag: ElementType = as ?? (tier === "hero" || tier === "page" ? "h1" : "h2");
  return (
    <Tag id={id} style={style} className={`display-heading display-heading--${tier} ${className}`.trim()}>
      {children}
      {accent != null ? <span className="display-heading__accent"> {accent}</span> : null}
    </Tag>
  );
}
