/* Single source for positioning language (conformance: one term).
 * The audit:copy gate bans every other variant. */
export const POSITIONING = "AI-enabled design systems";
export const POSITIONING_SHORT = "AI-enabled";

/* Home copy: the locked story line (Gate 2, 3 Oct 2026), the hero v3
 * h1 (Elleta, 4 Oct 2026). Pages read these; nothing repeats them as a
 * second literal. */
export const HOME_STORY = "I bring people together through systems that humans and agents can both read.";
/* the proof row under the hero (cards again, H4, 6 Oct 2026, the 4 Oct map) */
export const HOME_PROOF = [
  { title: "Got a CTO to fund a design system team", link: "Drift case", href: "/case-studies/design-system-transformation" },
  { title: "Six product areas on one system", link: "See what shipped", href: "/case-studies/design-system-transformation" },
  { title: "Open source, readable by humans and agents", link: "Explore BELLA", href: "/design-system" },
] as const;
