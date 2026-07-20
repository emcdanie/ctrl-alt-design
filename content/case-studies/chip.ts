import type { CaseStudy } from "@/lib/content";

/* CHIP — Elleta-approved copy, VERBATIM (17 Jul). Do not paraphrase.
 * PENDING ELLETA (omitted, the case reads complete without them):
 * a personal line on what was hard in the five days; a line on what
 * CHIP changed in her weekly workflow; an optional building-in-public
 * moment; the Loom URL (chip-evidence-0-bridge-hero.png is reserved
 * as its poster and is deliberately not placed yet).
 * TODO(elleta): the library row now claims Accessibility (Pass E task
 * 5a); nothing in this prose backs it yet. One line in your words
 * (e.g. the readiness map's keyboard/aria work), or the claim comes
 * back out. */

/* Conformance (Pass E task 11, honest): decision-led, the template
 * REFERENCE. One summary, three decisions with evidence, lessons.
 * No disclosure needed (own work, no client). */
const study: CaseStudy = {
  slug: "chip",
  title: "AI builds whatever your system already is. I built CHIP to see it first.",
  category: "DESIGN LAB",
  year: "2026",
  scope: "Agent governance, AI-readiness inspection, design-system health metrics, building in public",
  timeline: "Five-day build, April 2026",
  liveUrl: "",
  heroImage: "/case/chip/chip-cover-motif.svg",
  thumbnailImage: "/case/chip/chip-cover-motif.svg",
  heroVideo: undefined,
  eyebrow: "DESIGN LAB · AI + DESIGN SYSTEMS · 2026 · CURRENT FOCUS",
  summary: "AI doesn't fix a neglected design system. It sends you the bill.",
  /* canonical sidebar meta (Pass E task 11g): Role, Year, Type or
     Scope, Organisation, Tools; Built kept as this case's extra final
     row (her line, carries the hackathon timing) */
  metadata: [
    { label: "Role", value: "Designer and builder (solo, personal project)" },
    { label: "Year", value: "2026" },
    { label: "Type", value: "CHIP, a personal OS, honest prototype, building in public" },
    {
      label: "Scope",
      value:
        "Agent governance (human in the loop), AI-readiness inspection, design-system health metrics, building in public",
    },
    { label: "Tools", value: "Claude Code / CLI, BELLA tokens, MCP" },
    {
      label: "Built",
      value: "Five-day build for the Anthropic Claude Code hackathon, April 2026, CHIP 2.0 in progress",
    },
  ],
  images: [],
  tags: ["AI-enabled Design", "Design System Governance", "Building in Public", "Claude Code"],
  description: "AI builds whatever your system already is. I built CHIP to see it first.",

  blocks: [
    {
      kind: "summary",
      context:
        "AI industrialises whatever is already there. An agent reads what you wrote, not what you meant, so a human-fine design system can be full of silent drift the moment an agent consumes it: hardcoded values, vague layer names, thin docs. I kept learning how to make systems agent-ready but had no way to see where my own systems were drifting before an agent amplified it.",
      approach:
        "I finished the course chapter that treats a design system like a car: a check-engine light and a ten-station inspection. Instead of highlighting and moving on, I pointed the inspection at my own systems: design system, portfolio, content engine, and scored each on agent-readiness. Then I wired the readiness map into CHIP, the OS I built for the hackathon. The governing decision: the agent watches, catches drift, drafts a plan, then waits for approval, logs every action, and never moves silently.",
      outcome:
        "CHIP shows both what I'm thinking about and where my own systems are drifting, in one place. Building in public, turning red cells green out loud.",
    },
    {
      kind: "paragraph",
      text: "Constraints: Five days, solo, for the Anthropic Claude Code hackathon. An honest prototype, labelled as one.",
    },
    {
      kind: "decision",
      index: "01",
      title: "The agent never moves silently",
      why: "The human stays in the judgment layer: watch, catch, draft, approve, log.",
      evidence: {
        kind: "readinessMap",
        rows: [
          {
            id: "design-system",
            label: "Design system",
            cells: [
              { station: "Tokens", status: "green", note: "Every surface resolves from the token layer; no raw values in components." },
              { station: "Naming", status: "warn", note: "Two legacy aliases still shadow their semantic names; an agent would read the old intent." },
              { station: "Docs", status: "red", note: "Three components ship without usage notes; an agent consuming them would guess." },
              { station: "Dark mode", status: "green", note: "Both themes resolve from one flip; the contrast gate checks every route." },
            ],
          },
          {
            id: "portfolio",
            label: "Portfolio",
            cells: [
              { station: "Tokens", status: "green", note: "Gate-enforced: colour and spacing literals fail the build." },
              { station: "Naming", status: "green", note: "Tokens renamed to what they are; no lying names left." },
              { station: "Docs", status: "warn", note: "Two recorded exceptions live only in comments; the agent plan drafts a DESIGN.md entry." },
              { station: "Dark mode", status: "green", note: "Theme follows the visitor; dark is a first-class contract." },
            ],
          },
          {
            id: "content-engine",
            label: "Content engine",
            cells: [
              { station: "Tokens", status: "warn", note: "Draft templates carry inline styles; fine for humans, drift fuel for agents." },
              { station: "Naming", status: "red", note: "Folder names describe when things were made, not what they are." },
              { station: "Docs", status: "red", note: "The pipeline lives in my head; nothing an agent could read." },
              { station: "Dark mode", status: "green", note: "Not applicable surfaces are marked, not skipped silently." },
            ],
          },
        ],
      },
    },
    {
      kind: "figure",
      src: "/case/chip/chip-evidence-1-approve-inbox.png",
      alt: "CHIP's approve inbox: the agent's drafted actions queue for explicit human approval, each with a plan and a log entry",
      caption: "The approve inbox. The agent drafts, the human approves, every action logs. April hackathon build, BELLA parchment skin.",
      width: 2000,
      height: 1250,
    },
    {
      kind: "decision",
      index: "02",
      title: "Run it on my own systems, not a client's",
      why: "NDA-clean and more honest.",
    },
    {
      kind: "figure",
      src: "/case/chip/chip-evidence-3-system-map.png",
      alt: "CHIP's system map: Elleta's own design system, portfolio, and content engine scored across the inspection stations",
      caption: "The system map, pointed at my own work. April hackathon build.",
      width: 2000,
      height: 1250,
    },
    {
      kind: "decision",
      index: "03",
      title: "Build it in public, labelled a prototype",
      why: "Shipping is the proof, honesty beats polish, no invented numbers.",
    },
    {
      kind: "figure",
      src: "/case/chip/chip-evidence-4-friction-log.png",
      alt: "CHIP's friction log: what broke and what was learned during the five-day build, kept in public",
      caption: "The friction log, kept in public. April hackathon build.",
      width: 2000,
      height: 1250,
    },
    {
      kind: "lessons",
      text: "The hard part of agent-ready design systems isn't the tokens, it's keeping a human in control while the machine moves fast. The best thing I did with a course wasn't take notes, it was let it change the machine.",
    },
    {
      kind: "paragraph",
      text: "Credit: Brad Frost, TJ Pitre, Ian Frost (Southleft), whose AI and design systems course seeded the inspection thinking. Evidence uses illustrative data and BELLA tokens; nothing from any client.",
    },
  ],
};

export default study;
