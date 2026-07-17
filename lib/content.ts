/**
 * Content layer — type definitions and helpers for the CMS-style
 * case study system. Each case study lives in its own file under
 * /content/case-studies/ and is registered in the index barrel.
 *
 * To add a new case study:
 *  1. Create /content/case-studies/my-new-study.ts
 *  2. Export it from /content/case-studies/index.ts
 *  3. Done — it'll appear in the grid and be routable.
 */

// ── Type definitions ────────────────────────────────────────────

export interface CaseStudyMetrics {
  role: string;
  team?: string;
  timeline: string;
  scope: string;
}

export interface NarrativeSection {
  label?: string;
  heading: string;
  paragraphs: string[];
  /** Optional embedded visual (HTML file) shown after this section */
  embedSrc?: string;
  embedAlt?: string;
  embedAspect?: string;
}

/* ── Content blocks — the ONE case-study render path ──────────────
 * An ordered sequence that can represent everything the (former)
 * hand-built pages rendered. Sections nest non-section blocks. */
export type CaseBlock =
  | { kind: "paragraph"; text: string } // **bold** supported
  | { kind: "pullQuote"; text: string }
  | {
      kind: "embed";
      src: string;
      title: string;
      aspect?: string;
      minHeight?: number;
      frame?: "dark" | "light";
    }
  | { kind: "youtube"; src: string; title: string; caption?: string }
  | { kind: "video"; src: string; title: string; caption?: string }
  | {
      kind: "demoStep";
      index: string;
      description: string;
      href?: string;
      linkLabel?: string;
    }
  | { kind: "prototype"; src: string; title: string; height?: string }
  | { kind: "section"; eyebrow: string; heading: string; children: CaseBlock[] }
  /* decision-led template (Arthur-Kamsky / Justine structure) */
  | { kind: "summary"; context: string; approach: string; outcome: string }
  | {
      kind: "decision";
      index: string;
      title: string;
      why: string;
      /** interactive recreation, never a client screenshot */
      evidence?: CaseBlock;
    }
  | { kind: "lessons"; text: string }
  /* photographic/still evidence attached to a decision (never a gallery) */
  | { kind: "figure"; src: string; alt: string; caption?: string; width: number; height: number }
  /* CHIP: the interactive AI-readiness inspection map (illustrative data) */
  | {
      kind: "readinessMap";
      rows: {
        id: string;
        label: string;
        cells: { station: string; status: "red" | "warn" | "green"; note: string }[];
      }[];
    };

export interface CaseStudy {
  slug: string;
  href?: string;
  title: string;
  category: string;
  year: string;
  scope: string;
  timeline: string;
  liveUrl?: string;
  heroImage: string;
  /** Optional separate thumbnail for the listing grid (use when heroImage is an HTML embed) */
  thumbnailImage?: string;
  heroVideo?: string;
  metrics?: CaseStudyMetrics;
  overview?: {
    headline: string;
    body: string;
  };
  images: string[];
  problem?: {
    title: string;
    body: string;
  };
  outcomes?: {
    title: string;
    body: string;
    completionTag: string;
  };
  fullWidthImage?: string;
  tags: string[];
  description: string;
  narrative?: NarrativeSection[];
  /** Ordered content blocks — when present, they ARE the page body
   *  (narrative/structured modes are ignored). */
  blocks?: CaseBlock[];
  /** Optional overrides for the shell (defaults: category+year / description / built rows) */
  eyebrow?: string;
  summary?: string;
  metadata?: { label: string; value: string }[];
  clientLogo?: string;
  clientName?: string;
  demoLinks?: { label: string; href: string }[];
}

// ── Loader ──────────────────────────────────────────────────────

import * as studies from "@/content/case-studies";

/** All published case studies, in display order */
const caseStudies: CaseStudy[] = Object.values(studies);

export default caseStudies;

/** Look up a single case study by slug */
export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

/** Get the previous and next case studies relative to a given slug */
export function getAdjacentStudies(slug: string): {
  prev: CaseStudy | null;
  next: CaseStudy | null;
} {
  const index = caseStudies.findIndex((cs) => cs.slug === slug);
  return {
    prev: index > 0 ? caseStudies[index - 1] : null,
    next: index < caseStudies.length - 1 ? caseStudies[index + 1] : null,
  };
}

/** All slugs — used by generateStaticParams */
export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}
