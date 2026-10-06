import type { CaseStudy } from "@/lib/content";

/* Theming (Elleta, approved mock theming-case-study.html, 22 Sep 2026):
 * BELLA's token tiers and themes, shown working on one listing card.
 * Copy is the mock's. Own work, no client: no NDA line. */
const study: CaseStudy = {
  slug: "theming",
  title: "One system, many faces.",
  category: "DESIGN SYSTEMS",
  year: "2026",
  scope: "Token tiers, themes, contrast gate, Figma to code",
  timeline: "2026",
  images: [],
  tags: ["Design systems", "Theming", "Accessibility"],
  description: "Themes in BELLA swap the values, never the components.",
  summary: "Themes in BELLA swap the values, never the components. Watch the same screen change, token by token. Nothing to scroll or click.",
};

export default study;

/* Figure 3 (Site v3, Figma 420:12279): the real Storybook semantic table,
 * redrawn. The hexes are BELLA's own light and dark answers at the time,
 * shown as text in the picture. */
export const STORYBOOK_SEMANTIC: { name: string; light: string; dark: string }[] = [
  { name: "background", light: "#ffffff", dark: "#0d0d0d" },
  { name: "text-primary", light: "#121212", dark: "#ededed" },
  { name: "text-muted", light: "#515151", dark: "#b1b1b1" },
  { name: "surface-card", light: "#f2f2f2", dark: "#161616" },
  { name: "focus-ring", light: "#b97a14", dark: "#e8a83e" },
];
