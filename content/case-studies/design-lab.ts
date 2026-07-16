import type { CaseStudy } from "@/lib/content";

/* Design Lab (CHIP), Elleta's live public work; real detail is allowed
 * here (it is not under NDA). NOT registered in index.ts yet: register
 * it and repoint the workLibrary href once the blocks below are
 * authored, so no stub page ships in the meantime. */
const study: CaseStudy = {
  slug: "design-lab",
  href: "/case-studies/design-lab",
  title: "Design Lab",
  category: "PERSONAL OS",
  year: "2026",
  scope: "AI-enabled workflows, design systems, building in public",
  timeline: "Ongoing",
  heroImage: "",
  metrics: {
    role: "Designer-builder",
    team: "Solo, with Claude as a collaborator",
    timeline: "Ongoing",
    scope: "CHIP: a personal operating system for design work",
  },
  images: [],
  tags: ["AI Enablement", "Design Systems", "Building in Public"],
  description: "CHIP: AI-enabled design workflows, built and documented in public",
};

/* ── TODO(elleta): decision-led template scaffold. Fill in YOUR words,
 * then move this into the study object as `blocks: [...]` (see
 * design-system-transformation.ts for the model). Nothing here renders
 * while commented.
 *
 * { kind: "meta", role: "...", team: "...", scope: ["..."], timeline: "..." },
 * { kind: "summary",
 *   context: "TODO(elleta): the situation and the tension",
 *   approach: "TODO(elleta): LEAD WITH THE DECISION",
 *   outcome: "TODO(elleta): what changed, honest, no invented metrics" },
 * { kind: "decision", index: "01", title: "TODO(elleta)", why: "TODO(elleta)",
 *   evidence: { kind: "embed", src: "/demos/<recreation>.html", title: "...", frame: "light" } },
 * { kind: "decision", index: "02", ... },
 * { kind: "lessons", text: "TODO(elleta): one paragraph" },
 * ── */

export default study;
