/* Work library — single source for the hero bubbles and the /work
 * library (Map / Table / Timeline). Colours are the recorded --case-*
 * tokens (globals.css); metadata mirrors the case-study content files. */

export const SKILLS = [
  "Design Systems",
  "Design Tokens",
  "Design System Governance",
  "AI-assisted Design",
  "Accessibility",
  "Component Libraries",
  "Figma ⇄ Code",
  "Product Design",
  "UX Research",
] as const;

export type Skill = (typeof SKILLS)[number];

/** kebab slug for URL params */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[⇄]/g, "to")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface WorkItem {
  id: string;
  title: string;
  /** short bubble label; "|" marks the line break */
  bubbleLabel: string;
  kicker: string;
  ingredients: string[];
  href: string;
  cta?: string;
  type: string;
  year: string;
  /** sortable start year */
  yearStart: number;
  role: string;
  impact: string;
  skills: Skill[];
  /** current-focus piece — featured on the dashboard + first in the library */
  featured?: boolean;
  /** recorded case-colour tokens */
  hi: string;
  lo: string;
  deep: string;
  /** readable case accent for TEXT on themed surfaces (flips in dark) */
  text: string;
}

export const WORK_ITEMS: WorkItem[] = [
  {
    id: "code-first",
    title: "Code First",
    bubbleLabel: "Code First",
    kicker: "Design Systems · 2024–25",
    ingredients: ["Figma → code parity", "Primitive → semantic tokens", "Component governance"],
    href: "/case-studies/brad-frost",
    type: "Design Systems",
    year: "2024–2025",
    yearStart: 2024,
    role: "Design System Collaborator",
    impact: "Figma ⇄ Storybook parity; tokens aligned across the stack",
    skills: ["Design Systems", "Design Tokens", "Component Libraries", "Figma ⇄ Code"],
    hi: "var(--case-code-first-hi)",
    lo: "var(--case-code-first-lo)",
    deep: "var(--case-code-first-deep)",
    text: "var(--case-code-first-text)",
  },
  {
    id: "drift",
    title: "From Drift to Foundation",
    bubbleLabel: "Drift to|Foundation",
    kicker: "Complex SaaS · 2024–26",
    ingredients: ["First design system, from zero", "Tokens wired to production", "5+ booking verticals"],
    href: "/case-studies/design-system-transformation",
    type: "Design Systems",
    year: "2024–2026",
    yearStart: 2024,
    role: "Lead Product Designer — Design Systems",
    impact: "First design system from zero; tokens wired to production across 5+ verticals",
    skills: [
      "Design Systems",
      "Design Tokens",
      "Design System Governance",
      "Component Libraries",
      "Product Design",
    ],
    hi: "var(--case-drift-hi)",
    lo: "var(--case-drift-lo)",
    deep: "var(--case-drift-deep)",
    text: "var(--case-drift-text)",
  },
  {
    id: "guardian",
    title: "Guardian",
    bubbleLabel: "Guardian",
    kicker: "AI UX · 2026",
    ingredients: ["Drift detection at decision-time", "Contextual guidance", "Human-in-control governance"],
    href: "/case-studies/guardian",
    type: "AI UX",
    year: "2026",
    yearStart: 2026,
    role: "Concept Lead — Interaction & Strategy",
    impact: "Decision-time drift detection, from hackathon concept to interactive prototype",
    skills: ["AI-assisted Design", "Design System Governance", "Design Systems", "UX Research"],
    hi: "var(--case-guardian-hi)",
    lo: "var(--case-guardian-lo)",
    deep: "var(--case-guardian-deep)",
    text: "var(--case-guardian-text)",
  },
  {
    id: "clarity",
    title: "Operational Clarity",
    bubbleLabel: "Operational|Clarity",
    kicker: "Data Dashboard · 2025",
    ingredients: ["6+ operational domains, one interface", "Role-based analytics", "8-week contract"],
    href: "/case-studies/un-operational-dashboard",
    type: "Data Dashboard",
    year: "2025",
    yearStart: 2025,
    role: "Product Designer — Contract",
    impact: "6+ operational domains unified in one interface, in an 8-week contract",
    skills: ["Product Design", "Accessibility", "UX Research"],
    hi: "var(--case-clarity-hi)",
    lo: "var(--case-clarity-lo)",
    deep: "var(--case-clarity-deep)",
    text: "var(--case-clarity-text)",
  },
  {
    id: "design-lab",
    title: "Design Lab",
    featured: true,
    bubbleLabel: "Design Lab",
    kicker: "Personal OS · 2026",
    ingredients: ["CHIP: my own operating system", "AI-assisted workflows", "Building in public"],
    href: "/about#design-lab",
    type: "Personal OS",
    year: "2026",
    yearStart: 2026,
    role: "Designer-builder",
    impact: "CHIP: AI-assisted design workflows, built and documented in public",
    skills: ["AI-assisted Design", "Design Systems", "Product Design"],
    hi: "var(--case-design-lab-hi)",
    lo: "var(--case-design-lab-lo)",
    deep: "var(--case-design-lab-deep)",
    text: "var(--case-design-lab-text)",
  },
  {
    id: "writing",
    title: "Writing",
    bubbleLabel: "Writing",
    kicker: "Notes · 2026",
    ingredients: ["Design systems in practice", "Learning in public", "Talks and workshops"],
    href: "/about#learning",
    type: "Notes",
    year: "2026",
    yearStart: 2026,
    role: "Author",
    impact: "Design systems in practice, shared as notes, talks, and workshops",
    skills: ["Design Systems", "Design System Governance"],
    hi: "var(--case-writing-hi)",
    lo: "var(--case-writing-lo)",
    deep: "var(--case-writing-deep)",
    text: "var(--case-writing-text)",
  },
];

/** Case identities that live outside the 6-bubble hero cluster (they
 * still get the colour + sphere thread on their case pages). */
const EXTRA_CASES: Record<string, Pick<WorkItem, "hi" | "lo" | "deep" | "text" | "bubbleLabel">> = {
  "filters-decision-support-system": {
    hi: "var(--case-filters-hi)",
    lo: "var(--case-filters-lo)",
    deep: "var(--case-filters-deep)",
    text: "var(--case-filters-text)",
    bubbleLabel: "Travel|Booking",
  },
};

/** Case tokens for a case-study slug (sphere, accents). */
export function findWorkItemBySlug(
  slug: string
): Pick<WorkItem, "hi" | "lo" | "deep" | "text" | "bubbleLabel"> | undefined {
  return (
    WORK_ITEMS.find((i) => i.href.endsWith(`/case-studies/${slug}`)) ?? EXTRA_CASES[slug]
  );
}

/** The hub is not a work row — it belongs to the bubble cluster only. */
export const HUB_ITEM: Omit<WorkItem, "type" | "year" | "yearStart" | "role" | "impact" | "skills"> = {
  id: "hub",
  title: "How I think about design systems",
  bubbleLabel: "Design Systems",
  kicker: "Point of view",
  ingredients: [
    "Systems are agreements, not component libraries.",
    "Governance is what stops the drift.",
    "I read code, so design and engineering stay honest.",
  ],
  href: "/point-of-view",
  cta: "Read my full take",
  hi: "var(--hub-hi)",
  lo: "var(--hub-lo)",
  deep: "var(--hub-deep)",
  text: "var(--hub-deep)",
};
