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

/* ── Content blocks — the ONE case-study render path ──────────────
 * An ordered sequence that can represent everything the (former)
 * hand-built pages rendered. Sections nest non-section blocks. */
export type CaseBlock =
  | { kind: "paragraph"; text: string } // **bold** supported
  | { kind: "pullQuote"; text: string }
  /* Scaled to fit, never cropped (visual pass task 2): the FULL canvas
   * renders at the intrinsic design size and scales to the container.
   * Embeds are for VIEWING (pointer events suppressed); anything
   * interactive is a "prototype" block behind the activation facade. */
  | {
      kind: "embed";
      src: string;
      title: string;
      /** intrinsic canvas, default 1280 x 800 */
      designWidth?: number;
      designHeight?: number;
      frame?: "dark" | "light";
    }
  | {
      kind: "demoStep";
      index: string;
      description: string;
      href?: string;
      linkLabel?: string;
    }
  | {
      kind: "prototype";
      src: string;
      title: string;
      /** intrinsic canvas, default 1280 x 800 */
      designWidth?: number;
      designHeight?: number;
      /** static preview: the resting facade at every width; alt text
       *  must describe the prototype */
      poster?: string;
      posterAlt?: string;
    }
  /* Eyebrow vocabulary rule (Pass E task 11f, Elleta 18 Jul): a
   * section eyebrow must not repeat a summary label (Context /
   * Approach / Outcome) and must not equal a word of its own heading.
   * Change or drop the collider. */
  | { kind: "section"; eyebrow: string; heading: string; children: CaseBlock[] }
  /* decision-led template (Arthur-Kamsky / Justine structure) */
  | { kind: "summary"; context: string; approach: string; outcome: string }
  | {
      kind: "decision";
      index: string;
      title: string;
      /** the decision lead, in HER voice; omit while the slot is empty
       *  (TODO(elleta) comment in the content file marks it) */
      why?: string;
      /** interactive recreation, never a client screenshot */
      evidence?: CaseBlock;
      /** supporting paragraphs moved verbatim under the decision */
      children?: CaseBlock[];
    }
  /* text = the closing/takeaway display line. offer + body are optional
     structured slots (CHIP's takeaway leads with an offer keyline over a
     body paragraph); compositions that don't set them fall back to the
     single-text form (DriftV2 splits text into keyline + body itself). */
  | { kind: "lessons"; text: string; offer?: string; body?: string }
  /* upfront NDA disclosure (Pass C): quiet note before the body */
  | { kind: "disclosure"; text: string }
  /* photographic/still evidence attached to a decision (never a gallery);
   * href renders a text link below the image (poster-plus-link, no embeds) */
  | {
      kind: "figure";
      src: string;
      alt: string;
      caption?: string;
      width: number;
      height: number;
      href?: string;
      linkLabel?: string;
    }
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
  /** optional since the PR 41 amendment (22 Jul): no shell renders a
      hero image any more; covers live on the library row */
  heroImage?: string;
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

/** All slugs — used by generateStaticParams */
export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}
