/* Single source for positioning language (conformance: one term).
 * The audit:copy gate bans every other variant. */
export const POSITIONING = "AI-enabled design systems";
export const POSITIONING_SHORT = "AI-enabled";

/* Home copy: the locked story line (Gate 2, 3 Oct 2026), the hero v3
 * h1 (Elleta, 4 Oct 2026). Pages read these; nothing repeats them as a
 * second literal. */
export const HOME_STORY = "I bring people together through systems that humans and agents can both read.";
/* the proof row under the hero (back in 18d, 4 Oct 2026) */
export const HOME_PROOF = [
  { label: "Drift", line: "Got a CTO to fund a design system team", href: "/case-studies/design-system-transformation" },
  { label: "Shipped", line: "Six product areas on one system", href: "/case-studies/design-system-transformation" },
  { label: "BELLA", line: "Open source, readable by humans and agents", href: "/design-system" },
] as const;
