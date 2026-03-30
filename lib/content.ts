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

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

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
  overview: {
    headline: string;
    body: string;
  };
  images: string[];
  problem: {
    title: string;
    body: string;
  };
  process: {
    title: string;
    steps: ProcessStep[];
  };
  outcomes: {
    title: string;
    body: string;
    completionTag: string;
  };
  fullWidthImage?: string;
  tags: string[];
  description: string;
  narrative?: NarrativeSection[];
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
