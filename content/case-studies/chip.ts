import type { CaseStudy } from "@/lib/content";

/* CHIP 2.0 (Site v3, Elleta, 4 Oct 2026; Figma 407:8187 / 407:10271, copy
 * approved for code 4 Oct late): CHIP 2.0, in progress, a local bridge
 * for BELLA. The page is components/ChipCase.tsx on Template / Case page;
 * Atlas is a concept mock and every Atlas figure says so. Own work on own
 * systems, so no NDA line. The April hackathon build is history now: the
 * old embed and screenshots left with this rewrite. */
const study: CaseStudy = {
  slug: "chip",
  title: "AI builds what your system is. CHIP sees it first.",
  category: "AI + DESIGN SYSTEMS",
  year: "2026",
  scope: "A local bridge for BELLA: repo, gate scripts, notes and docs, a local model",
  timeline: "Apr 2026 to now",
  images: [],
  tags: ["AI-enabled Design", "Design System Governance", "Building in Public"],
  eyebrow: "CHIP 2.0 · in progress · AI + design systems · 2026",
  description: "AI doesn't fix a neglected design system. It sends you the bill.",
  summary:
    "AI doesn't fix a neglected design system. It sends you the bill. CHIP 2.0 is a local bridge for BELLA: it reads the real repo, runs BELLA's own gate scripts, indexes my notes and docs, and answers questions with a local model.",
};

export default study;
