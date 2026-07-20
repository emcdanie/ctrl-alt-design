/* Work library — single source for the hero bubbles and the /work
 * library (Map / Table / Timeline). Colours are the recorded --case-*
 * tokens (globals.css); metadata mirrors the case-study content files. */

export const SKILLS = [
  "Design Systems",
  "Design Tokens",
  "Design System Governance",
  "AI-enabled Design",
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
  /** honest medium taxonomy for the TYPE filter row (what a piece IS) */
  medium: "case study" | "prototype" | "writing";
  /** current-focus piece, featured on the dashboard */
  featured?: boolean;
  /** hero bubble cluster membership (Elleta, 20 Jul): absent means in
   *  the cluster; false keeps a case out of it EXPLICITLY, on its own
   *  row, never via a side table. Recorded in DESIGN.md. */
  inCluster?: boolean;
  /** explicit library order; lower ranks first in the default sort */
  rank?: number;
  /** honest cover image (real work product); warm placeholder otherwise */
  cover?: string;
  /** recorded case-colour tokens */
  hi: string;
  lo: string;
  deep: string;
  /** readable case accent for TEXT on themed surfaces (flips in dark) */
  text: string;
}

export const WORK_ITEMS: WorkItem[] = [
  {
    id: "chip",
    medium: "case study",
    cover: "/case/chip/chip-evidence-0-bridge-hero.png",
    rank: 0,
    featured: true,
    title: "CHIP",
    bubbleLabel: "CHIP",
    kicker: "AI + Design Systems · 2026",
    ingredients: ["Agent governance, human in the loop", "AI-readiness inspection", "Building in public"],
    href: "/case-studies/chip",
    type: "AI + Design Systems",
    year: "2026",
    yearStart: 2026,
    role: "Designer and builder (solo)",
    impact: "The agent watches, catches drift, drafts, and waits for approval; my own systems scored in public",
    skills: ["AI-enabled Design", "Design System Governance", "Design Systems", "Accessibility"],
    hi: "var(--case-chip-hi)",
    lo: "var(--case-chip-lo)",
    deep: "var(--case-chip-deep)",
    text: "var(--case-chip-text)",
  },
  {
    id: "code-first",
    medium: "case study",
    /* TODO(elleta): cover asset slot (20 Jul). The command-center
       still stays until you provide the new visual or pick an
       alternative; do not swap without her asset. */
    cover: "/images/thumbnails/BradFrostCommandCenter.png",
    title: "Code First",
    bubbleLabel: "Code First",
    kicker: "Design Systems · 2024-25",
    ingredients: ["Figma → code parity", "Primitive → semantic tokens", "Component governance"],
    href: "/case-studies/brad-frost",
    type: "Design Systems",
    year: "2024-2025",
    yearStart: 2024,
    role: "Design System Collaborator",
    impact: "Figma ⇄ Storybook parity; tokens aligned across the stack",
    skills: ["Design Systems", "Design Tokens", "Component Libraries", "Figma ⇄ Code", "Accessibility"],
    hi: "var(--case-code-first-hi)",
    lo: "var(--case-code-first-lo)",
    deep: "var(--case-code-first-deep)",
    text: "var(--case-code-first-text)",
  },
  {
    id: "drift",
    medium: "case study",
    cover: "/images/thumbnails/ds-audit-thumb.svg",
    rank: 1,
    title: "From Drift to Foundation",
    bubbleLabel: "Drift to|Foundation",
    kicker: "Complex SaaS · 2024-26",
    ingredients: ["First design system, from zero", "Tokens wired to production", "5+ booking verticals"],
    href: "/case-studies/design-system-transformation",
    type: "Design Systems",
    year: "2024-2026",
    yearStart: 2024,
    role: "Lead Product Designer, Design Systems",
    impact: "First design system from zero; tokens wired to production across 5+ verticals",
    skills: [
      "Design Systems",
      "Design Tokens",
      /* mid-array: a structural claim for this case (Pass E task 5a) */
      "Accessibility",
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
    medium: "case study",
    cover: "/images/thumbnails/GuardianAuditTool.svg",
    title: "Guardian",
    bubbleLabel: "Guardian",
    kicker: "AI UX · 2026",
    ingredients: ["Drift detection at decision-time", "Contextual guidance", "Human-in-control governance"],
    href: "/case-studies/guardian",
    type: "AI UX",
    year: "2026",
    yearStart: 2026,
    role: "Concept Lead, Interaction & Strategy",
    impact: "Decision-time drift detection, from hackathon concept to interactive prototype",
    skills: ["AI-enabled Design", "Design System Governance", "Design Systems", "UX Research", "Accessibility"],
    hi: "var(--case-guardian-hi)",
    lo: "var(--case-guardian-lo)",
    deep: "var(--case-guardian-deep)",
    text: "var(--case-guardian-text)",
  },
  {
    id: "clarity",
    medium: "case study",
    title: "Operational Clarity",
    bubbleLabel: "Operational|Clarity",
    kicker: "Data Dashboard · 2025",
    ingredients: ["6+ operational domains, one interface", "Role-based analytics", "8-week contract"],
    href: "/case-studies/un-operational-dashboard",
    type: "Data Dashboard",
    year: "2025",
    yearStart: 2025,
    role: "Product Designer, Contract",
    impact: "6+ operational domains unified in one interface, in an 8-week contract",
    skills: ["Product Design", "Accessibility", "UX Research"],
    hi: "var(--case-clarity-hi)",
    lo: "var(--case-clarity-lo)",
    deep: "var(--case-clarity-deep)",
    text: "var(--case-clarity-text)",
  },
  {
    id: "filters",
    medium: "case study",
    cover: "/images/carosel/CTRL_ATL_TRAVEL.jpeg",
    /* Registry parity (Elleta, 20 Jul): every case-study slug carries
       exactly one WORK_ITEMS row. The hero cluster stays six bubbles +
       hub; this case sits outside it by explicit flag. */
    inCluster: false,
    title: "Travel Booking",
    bubbleLabel: "Travel|Booking",
    kicker: "UX Strategy · 2024-25",
    ingredients: [
      "Search and filtering as one flow",
      "Policy as a visible dimension",
      "Making it safe to experiment",
    ],
    href: "/case-studies/filters-decision-support-system",
    type: "UX Strategy",
    year: "2024-2025",
    yearStart: 2024,
    role: "Lead Product Designer",
    impact: "A reusable filtering interaction pattern with a consistent contract across the product",
    skills: ["Product Design", "UX Research", "Design Systems"],
    hi: "var(--case-filters-hi)",
    lo: "var(--case-filters-lo)",
    deep: "var(--case-filters-deep)",
    text: "var(--case-filters-text)",
  },
  {
    id: "design-lab",
    medium: "prototype",
    title: "Design Lab",
    bubbleLabel: "Design Lab",
    kicker: "Personal OS · 2026",
    ingredients: ["CHIP: my own operating system", "AI-enabled workflows", "Building in public"],
    href: "/work#design-lab",
    type: "Personal OS",
    year: "2026",
    yearStart: 2026,
    role: "Designer-builder",
    impact: "CHIP: AI-enabled design workflows, built and documented in public",
    skills: ["AI-enabled Design", "Design Systems", "Product Design"],
    hi: "var(--case-design-lab-hi)",
    lo: "var(--case-design-lab-lo)",
    deep: "var(--case-design-lab-deep)",
    text: "var(--case-design-lab-text)",
  },
];

/** "More work like this" (Pass C 2026-07-18): case studies ranked by
 * skill overlap with the current case (the same matrix data), current
 * case excluded, deterministic order (overlap desc, rank asc, title).
 * Every case slug has a library row (parity gate); rank breaks ties.
 * TWO cards at a wider width (Elleta, 21 Jul, spec system-page-v2). */
export function relatedWorkItems(slug: string, count = 2): WorkItem[] {
  const cases = WORK_ITEMS.filter((i) => i.medium === "case study");
  const current = cases.find((i) => i.href.endsWith(`/case-studies/${slug}`));
  const overlap = (i: WorkItem) =>
    current ? i.skills.filter((s) => current.skills.includes(s)).length : 0;
  return cases
    .filter((i) => i !== current)
    .sort(
      (a, b) =>
        overlap(b) - overlap(a) ||
        (a.rank ?? 99) - (b.rank ?? 99) ||
        a.title.localeCompare(b.title)
    )
    .slice(0, count);
}

/* ── Evidence layer, structure only (Pass E task 5c) ──────────────
 * One line per case-and-skill pair, in HER words. Where a line exists
 * the matrix cell exposes it on demand (disclosure) with the case
 * link; an absent line means the cell just links. Deterministic data,
 * NO AI labelling — the AI entry point stays find-your-fit, whose
 * why-rows this matrix verifies.
 * TODO(elleta): fill the lines; the structure ships dark until then.
 * Shape: { [itemId]: { [skill]: "one line" } }, e.g.
 *   drift: { Accessibility: "…", "Design Tokens": "…" } */
export const SKILL_EVIDENCE: Record<string, Partial<Record<Skill, string>>> = {};

/** Case tokens for a case-study slug (sphere, accents). */
export function findWorkItemBySlug(
  slug: string
): Pick<WorkItem, "title" | "hi" | "lo" | "deep" | "text" | "bubbleLabel"> | undefined {
  return WORK_ITEMS.find((i) => i.href.endsWith(`/case-studies/${slug}`));
}

/** The hub is not a work row — it belongs to the bubble cluster only. */
export const HUB_ITEM: Omit<WorkItem, "type" | "year" | "yearStart" | "role" | "impact" | "skills" | "medium"> = {
  id: "hub",
  title: "How I think about design systems",
  bubbleLabel: "Design Systems",
  kicker: "Point of view",
  ingredients: [
    "Systems are agreements, not component libraries.",
    "Governance is what stops the drift.",
    "I read code, so design and engineering stay honest.",
  ],
  href: "/about#how-i-think",
  cta: "Read my full take",
  hi: "var(--hub-hi)",
  lo: "var(--hub-lo)",
  deep: "var(--hub-deep)",
  text: "var(--hub-deep)",
};
