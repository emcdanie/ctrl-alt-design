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
 * (counts, fit corpus, matrix, related rows, bella.json) derives from
 * this array and follows. */
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
    /* Cover = the ONE annotated specimen rendered as its Code First
       variant (CaseSpecimen identity/copy props), captured static
       (resolves the cover TODO; the Command Center imagery stays out
       of the case, PR 41 amendment item 8, 22 Jul). */
    cover: "/images/case-studies/code-first-specimen.png",
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

/** Skill names in sentence case for chips and tags ("Design system
 *  governance"); AI, UX and Figma keep their capitals.
 *  TODO(learning merge): move beside SKILLS in content/skills.ts so
 *  /learning and /work share it. */
export function skillLabel(s: string): string {
  return s
    .split(" ")
    .map((w, i) => (i === 0 || /^(AI|UX|Figma)/.test(w) ? w : w.toLowerCase()))
    .join(" ");
}

/* ── The /work library (approved mock, 19 Sep 2026) ───────────────
 * Eleven pieces: the three case studies (from their WORK_ITEMS rows)
 * and eight experiments. One shape, so the cards, the table and the
 * map all read the same list. Titles keep real brand names out. */

export type PieceType = "Case study" | "Concept" | "Hackathon" | "Prototype";
export const PIECE_TYPES: PieceType[] = ["Case study", "Concept", "Hackathon", "Prototype"];

export interface WorkPiece {
  id: string;
  type: PieceType;
  title: string;
  /** one line for the card and the table */
  line: string;
  /** "2024 to 25" */
  years: string;
  /** the skills it shows: the Topic filter and the map */
  topics: Skill[];
  /** at most two display tags */
  tags: string[];
  /** a page or a demo; absent when the piece is a video */
  href?: string;
  /** a video walkthrough (opens in the modal) */
  embed?: string;
  /** the longer description the video modal shows */
  about?: string;
  cover?: string;
  /** cover ground behind a thumbnail */
  gradient?: string;
}

/* Home order (Elleta, 19 Sep 2026) */
const CASE_COPY: Record<string, Pick<WorkPiece, "line" | "years" | "tags">> = {
  "code-first": { line: "Figma and code as one system, not two.", years: "2024 to 25", tags: ["Design tokens", "Figma ⇄ code"] },
  drift: { line: "A first design system for a product that had outgrown its UI.", years: "2024 to 26", tags: ["Design systems", "Governance"] },
  chip: { line: "An agent that watches the system and never moves silently.", years: "2026", tags: ["AI-enabled design", "Governance"] },
};

const CASES: WorkPiece[] = Object.entries(CASE_COPY).map(([id, copy]) => {
  const item = WORK_ITEMS.find((i) => i.id === id)!;
  return { id, type: "Case study", title: item.title, topics: item.skills, href: item.href, cover: item.cover, ...copy };
});

const EXPERIMENTS: WorkPiece[] = [
  {
    id: "legal-search",
    type: "Concept",
    title: "AI legal search + multimedia centre",
    line: "Search and media navigation for a complex EU regulatory site.",
    about: "Exploring AI-enabled legal search and multimedia navigation patterns for complex regulatory systems.",
    years: "2025",
    topics: ["AI-enabled Design", "UX Research", "Product Design"],
    tags: ["AI-enabled design", "Search"],
    embed: "https://www.loom.com/embed/685fc54dcb104d51baa15dcec8727da2",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 50%, #0D2040 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/AIPoweredSearch.png",
  },
  {
    id: "insurance-forms",
    type: "Concept",
    title: "Complex insurance forms",
    line: "Multilingual forms with validation and accessible patterns.",
    about: "Designing scalable form architectures that support multilingual content, validation logic, and accessible interaction patterns.",
    years: "2025",
    topics: ["Accessibility", "Product Design", "Component Libraries"],
    tags: ["Accessibility", "Forms"],
    embed: "https://www.loom.com/embed/1a13cb50b6ac4282952f85efa11f9d7e",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #3A1860 50%, #120820 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/HealthForm.png",
  },
  {
    id: "race-day",
    type: "Concept",
    title: "Race-day operations dashboard",
    line: "A dense control-room dashboard, inspired by F1 telemetry.",
    about: "Designing a high-density operational dashboard inspired by F1 race telemetry and control room systems.",
    years: "2025",
    topics: ["Product Design", "UX Research"],
    tags: ["Dashboards", "Data viz"],
    embed: "https://www.loom.com/embed/f93c664f6668417c81dbb774a2a7a4a3",
    gradient: "linear-gradient(135deg, #0D1B10 0%, #1A3820 50%, #0A1410 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/FormularOne.png",
  },
  {
    id: "stock-screener",
    type: "Prototype",
    title: "AI stock screener",
    line: "Natural-language filters as editable chips, with a reasoning trace.",
    years: "2026",
    topics: ["AI-enabled Design", "Product Design"],
    tags: ["AI-enabled design", "Filtering"],
    href: "/demos/finviz-3.html",
    gradient: "linear-gradient(135deg, #1C0A0A 0%, #3D1010 50%, #140808 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/finviz-3.png",
  },
  {
    id: "travel-search",
    type: "Prototype",
    title: "Travel search and filters",
    line: "Unified search, filtering and booking for a B2B travel product.",
    years: "2025",
    topics: ["Product Design", "UX Research"],
    tags: ["Search", "Filtering"],
    href: "/demos/ctrl-travel-v2.html",
    gradient: "linear-gradient(135deg, #0A1628 0%, #132040 60%, #0A1628 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/TRAVEL.png",
  },
  {
    id: "command-center",
    type: "Prototype",
    title: "Design system command center",
    line: "Component analysis and governance, in one dashboard.",
    years: "2026",
    topics: ["Design Systems", "Design System Governance", "AI-enabled Design"],
    tags: ["Governance", "Dashboards"],
    href: "/demos/brad-frost-command-center.html",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #2D1650 50%, #1A0A2E 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/BradFrostCommandCenter.png",
  },
  {
    id: "guardian",
    type: "Hackathon",
    title: "Guardian, AI UX audit",
    line: "Heuristics, drift and accessibility checks on a Figma-style canvas.",
    years: "2026",
    topics: ["AI-enabled Design", "Accessibility", "Design System Governance"],
    tags: ["AI-enabled design", "Accessibility"],
    href: "/demos/guardian-audit-tool.html",
    gradient: "linear-gradient(135deg, #0F1117 0%, #161822 50%, #0F1117 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/GuardianAuditTool.svg",
  },
  {
    id: "pattern-mentor",
    type: "Prototype",
    title: "Pattern Mentor plugin",
    line: "Design feedback with pattern citations and one-click fixes.",
    years: "2026",
    topics: ["AI-enabled Design", "Design Systems"],
    tags: ["AI-enabled design", "Plugins"],
    href: "/demos/pattern-mentor.html",
    gradient: "linear-gradient(135deg, var(--color-semantic-surface) 0%, #E8E3DB 50%, var(--color-semantic-surface) 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    cover: "/images/thumbnails/PatternMentor.svg",
  },
];

export const WORK_PIECES: WorkPiece[] = [...CASES, ...EXPERIMENTS];
