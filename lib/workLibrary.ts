/* Work library — single source for the hero bubbles and the /work
 * library (Map / Table / Timeline). Colours are the recorded --case-*
 * tokens (globals.css); metadata mirrors the case-study content files. */

import { SKILLS, slugify, type Skill } from "@/content/skills";

/* the one skills list lives in content/skills.ts; re-exported for the
   existing importers */
export { SKILLS, slugify, type Skill };

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

/* Curation (Elleta, 22 Jul 2026): three star cases + the Design Lab
 * row. Archived cases (guardian, clarity, filters) live with full
 * content in content/case-studies/_archive/; everything downstream
 * (counts, matrix, related rows, bella.json) derives from
 * this array and follows. */
export const WORK_ITEMS: WorkItem[] = [
  /* The travel platform set (Elleta, 21 Sep 2026): the umbrella leads
     /work and Home; Search and Checkout are two of its four stories. They
     wear the identity pairs already recorded (the umbrella shares Drift's,
     the same product), so no new colour is invented. */
  {
    id: "booking",
    medium: "case study",
    cover: "/images/case-studies/travel/flights-after.webp",
    rank: -1,
    title: "B2B travel platform",
    bubbleLabel: "B2B travel|platform",
    kicker: "B2B travel · 2024-26",
    ingredients: ["Research that got a team funded", "A system in code", "Six product areas shipped"],
    href: "/case-studies/booking-platform",
    type: "Product design",
    year: "2024-2026",
    yearStart: 2024,
    role: "Lead product designer, design systems",
    impact: "A redesign that had not shipped in two years became a platform that did",
    skills: ["Product design", "Design systems", "UX research", "Design system governance"],
    hi: "var(--case-drift-hi)",
    lo: "var(--case-drift-lo)",
    deep: "var(--case-drift-deep)",
    text: "var(--case-drift-text)",
  },
  {
    id: "search-experts",
    medium: "case study",
    cover: "/images/case-studies/travel/search-results-1.webp",
    rank: 2,
    title: "Search for experts",
    bubbleLabel: "Search for|experts",
    kicker: "B2B travel · 2024-26",
    ingredients: ["Filters in one drawer", "A search that stays in view", "A ticket card"],
    href: "/case-studies/search-experts",
    type: "Product design",
    year: "2024-2026",
    yearStart: 2024,
    role: "Lead product designer",
    impact: "A results page that keeps the search in view and puts filters behind one button",
    skills: ["Product design", "Design systems"],
    hi: "var(--case-filters-hi)",
    lo: "var(--case-filters-lo)",
    deep: "var(--case-filters-deep)",
    text: "var(--case-filters-text)",
  },
  {
    id: "checkout",
    medium: "case study",
    cover: "/images/case-studies/travel/checkout-2.webp",
    rank: 3,
    title: "Forms and checkout",
    bubbleLabel: "Forms and|checkout",
    kicker: "B2B travel · 2024-26",
    ingredients: ["One checkout for every product", "Rules as fewer choices", "Built from blocks"],
    href: "/case-studies/checkout",
    type: "Product design",
    year: "2024-2026",
    yearStart: 2024,
    role: "Lead product designer",
    impact: "One checkout, built from blocks, for cars, flights, stays and trains",
    skills: ["Product design", "Design systems", "Component libraries"],
    hi: "var(--case-clarity-hi)",
    lo: "var(--case-clarity-lo)",
    deep: "var(--case-clarity-deep)",
    text: "var(--case-clarity-text)",
  },
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
    skills: ["AI-enabled design", "Design system governance", "Design systems", "Accessibility"],
    hi: "var(--case-chip-hi)",
    lo: "var(--case-chip-lo)",
    deep: "var(--case-chip-deep)",
    text: "var(--case-chip-text)",
  },
  {
    id: "code-first",
    medium: "case study",
    /* Cover = the ONE annotated specimen rendered as its Code First
       variant (CaseSpecimen identity/copy props), captured static
       (resolves the cover TODO; the Command Center imagery stays out
       of the case, PR 41 amendment item 8, 22 Jul). */
    cover: "/images/case-studies/code-first-specimen.png",
    title: "Code First",
    bubbleLabel: "Code First",
    kicker: "Design Systems · 2025-26",
    ingredients: ["Figma → code parity", "Primitive → semantic tokens", "Component governance"],
    href: "/case-studies/brad-frost",
    type: "Design Systems",
    year: "2025-2026",
    yearStart: 2025,
    role: "Design System Collaborator",
    impact: "Figma ⇄ Storybook parity; tokens aligned across the stack",
    skills: ["Design systems", "Design tokens", "Component libraries", "Figma ⇄ code", "Accessibility"],
    hi: "var(--case-code-first-hi)",
    lo: "var(--case-code-first-lo)",
    deep: "var(--case-code-first-deep)",
    text: "var(--case-code-first-text)",
  },
  {
    id: "drift",
    medium: "case study",
    /* Cover = a steel crop of the beat-01 audit specimen (the "everything
       drifted" surface): near-identical component pills off the baseline,
       audit markers flagging the drift. Steel (the recreated client's
       foreign palette, not Elleta's iris) and mid/deep toned so it reads on
       both card grounds without flaring white in dark. Abstract, no client
       data. Supersedes ds-audit-thumb.svg (light-only, red marks). */
    cover: "/images/thumbnails/drift-audit-cover.svg",
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
      "Design systems",
      "Design tokens",
      /* mid-array: a structural claim for this case (Pass E task 5a) */
      "Accessibility",
      "Design system governance",
      "Component libraries",
      "Product design",
    ],
    hi: "var(--case-drift-hi)",
    lo: "var(--case-drift-lo)",
    deep: "var(--case-drift-deep)",
    text: "var(--case-drift-text)",
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
    skills: ["AI-enabled design", "Design systems", "Product design"],
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
 * NO AI labelling.
 * TODO(elleta): fill the lines; the structure ships dark until then.
 * Shape: { [itemId]: { [skill]: "one line" } }, e.g.
 *   drift: { Accessibility: "…", "Design tokens": "…" } */
export const SKILL_EVIDENCE: Record<string, Partial<Record<Skill, string>>> = {};

/** Case tokens for a case-study slug (sphere, accents). */
export function findWorkItemBySlug(
  slug: string
): Pick<WorkItem, "title" | "hi" | "lo" | "deep" | "text" | "bubbleLabel"> | undefined {
  return WORK_ITEMS.find((i) => i.href.endsWith(`/case-studies/${slug}`));
}

/* ── The /work case studies (Elleta, 19 Sep 2026) ───────────────────
 * The three cases in Home order, with the Work card copy: one line,
 * full-year dates, at most two tags. Identity lives on the WORK_ITEMS
 * rows above; this adds only what the card says. */

export interface WorkCase {
  id: string;
  title: string;
  /** the case's kind in sentence case, "Design systems" (Home's kicker) */
  kind: string;
  line: string;
  /** "2024 to 2025" */
  years: string;
  tags: string[];
  href: string;
  cover?: string;
  /** other case studies from the same work, linked under the card (Part W3) */
  also?: { label: string; href: string }[];
}

const CASE_COPY: Record<string, Pick<WorkCase, "line" | "years" | "tags" | "also">> = {
  /* the lead case on /work and Home (Part S, 21 Sep 2026) */
  booking: { line: "A redesign that had not shipped in two years, rebuilt into a platform that did.", years: "2024 to 2026", tags: ["Product design", "Design systems"], also: [{ label: "Search", href: "/case-studies/search-experts" }, { label: "Checkout", href: "/case-studies/checkout" }] },
  "code-first": { line: "Figma and code as one system, not two.", years: "2025 to 2026", tags: ["Design tokens", "Figma ⇄ code"] },
  drift: { line: "A first design system for a product that had outgrown its UI.", years: "2024 to 2026", tags: ["Design systems", "Governance"] },
  chip: { line: "An agent that watches the system and never moves silently.", years: "2026", tags: ["AI-enabled design", "Governance"] },
};

export const WORK_CASES: WorkCase[] = Object.entries(CASE_COPY).map(([id, copy]) => {
  const item = WORK_ITEMS.find((i) => i.id === id)!;
  /* "AI + Design Systems" -> "AI + design systems": AI keeps its capitals */
  const kind = item.type
    .split(" ")
    .map((w, i) => (i === 0 || w === "AI" ? w : w.toLowerCase()))
    .join(" ");
  return { id, title: item.title, kind, href: item.href, cover: item.cover, ...copy };
});
