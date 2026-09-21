import type { CSSProperties, ElementType, ReactNode } from "react";

export type HeadingTier = "hero" | "page" | "section" | "case" | "sub";

/**
 * THE display heading primitive: every display heading renders through
 * this. Unique 700 all-caps at four tiers, fluid between 390 and 1440
 * (display-type-scale fix, 18 Sep 2026): hero 40-180 (home headline),
 * page 40-64 (every page title: /about, case studies, /design-system),
 * section 32-48 (every section head and beat headline, one size per
 * page), case 32-48 (the case sign-off). Tier "sub" is the h3-level sub-heading: Geist
 * 700 at 24-32, never Unique. Tracking and leading come from
 * --tracking-display / --leading-display, never from a consumer.
 * Semantic level is decoupled from the visual tier via `as`. `accent`
 * renders the key word / trailing line in iris; `after` is plain text
 * that follows it, so the accent can sit mid-sentence ("when AI shows
 * up.") without the period turning iris. Unique never renders
 * below 24px (gate-enforced) and never in body, UI, card titles,
 * eyebrows, meta, nav, buttons, chips.
 *
 * `squeeze` (hero tier, opt-in, 19 Sep 2026): the headline starts at
 * weight 820 and tracks in as the page scrolls. Scroll-driven CSS only,
 * inside @supports (animation-timeline: scroll()) and no-preference
 * motion; everywhere else it stays at 820. Line height 1.0.
 */
export default function Heading({
  tier = "section",
  as,
  accent,
  after,
  id,
  className = "",
  style,
  label,
  squeeze = false,
  children,
}: {
  tier?: HeadingTier;
  /** semantic element; defaults h1 for hero/page, h2 otherwise */
  as?: "h1" | "h2" | "h3";
  /** optional accent segment rendered in iris after the main text */
  accent?: ReactNode;
  /** plain text after the accent word (trailing words, punctuation) */
  after?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** explicit accessible name, for headings whose accent is a control
   *  (a Term button pads its name: "Bella ." instead of "Bella.") */
  label?: string;
  /** hero tier only: the scroll squeeze (weight 820 to 640, tracking
   *  -0.01em to -0.03em over the first 60vh of scroll). The one
   *  approved tracking exception, and it lives here, never in a page. */
  squeeze?: boolean;
  children: ReactNode;
}) {
  const Tag: ElementType = as ?? (tier === "hero" || tier === "page" ? "h1" : tier === "sub" ? "h3" : "h2");
  /* ONE iris word per PAGE, on the h1 (Elleta, 20 Sep 2026, the calm
     pass). Every h2 on every page was colouring a word, which made the
     accent mean "a heading" rather than "the one idea". Below the h1 the
     accent still marks the word, it just wears ink. A Term passed as an
     accent keeps its own dotted underline and iris: that is the
     interactive affordance, not the accent colour. */
  const irisAccent = Tag === "h1";
  /* the size comes from the shared text utility, not a tier-private rule */
  const size = tier === "page" ? " text-display-1" : tier === "section" || tier === "case" ? " text-display-2" : "";
  const squeezed = squeeze && tier === "hero" ? " display-heading--squeeze" : "";
  return (
    <Tag id={id} style={style} aria-label={label} className={`display-heading display-heading--${tier}${size}${squeezed} ${className}`.trim()}>
      {children}
      {accent != null ? <span className={irisAccent ? "accent" : undefined}> {accent}</span> : null}
      {after}
    </Tag>
  );
}
