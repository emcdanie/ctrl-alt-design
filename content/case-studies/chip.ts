import type { CaseStudy } from "@/lib/content";

/* CHIP — Elleta-approved copy, VERBATIM (17 Jul). Do not paraphrase.
 * PENDING ELLETA (omitted, the case reads complete without them):
 * a personal line on what was hard in the five days; a line on what
 * CHIP changed in her weekly workflow; an optional building-in-public
 * moment; the Loom URL (chip-evidence-0-bridge-hero.png is reserved
 * as its poster and is deliberately not placed yet).
 * ACCESSIBILITY TAG (Pass E task 5a) — RE-OPENED: the backing added in
 * PR #60 was the interactive ChipReadinessMap's keyboard/aria work, but
 * that recreation is now RETIRED (beat 02 shows the real CHIP build).
 * TODO(elleta): the Accessibility claim needs a new backing (a line on
 * the real CHIP build's a11y, e.g. its Atkinson Hyperlegible type and
 * keyboard model, in your words) or the tag comes back out. */

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
    /* the shared pull-quote (case-align pass): her thesis (the first line of
       the case title), the editorial display moment every case now carries.
       Rendered after beat 02 by the composition, same slot as Code First. */
    {
      kind: "pullQuote",
      text: "AI builds whatever your system already is.",
    },
    {
      kind: "summary",
      context:
        "AI industrialises whatever is already there. An agent reads what you wrote, not what you meant, so a human-fine design system can be full of silent drift the moment an agent consumes it: hardcoded values, vague layer names, thin docs. I kept learning how to make systems agent-ready but had no way to see where my own systems were drifting before an agent amplified it.",
      /* TODO(elleta): proposed shortening. The old governing sentence
         re-listed watch/catch/draft/approve/log (already in the beat-01
         keyline) and closed on "never moves silently" (already the beat-01
         headline). Shorter close proposed, confirm on preview. */
      approach:
        "I finished the course chapter that treats a design system like a car: a check-engine light and a ten-station inspection. Instead of highlighting and moving on, I pointed the inspection at my own systems: design system, portfolio, content engine, and scored each on agent-readiness. Then I wired the readiness map into CHIP, the OS I built for the hackathon. The governing decision: it can draft, but it never acts without me.",
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
      /* The recreated ChipReadinessMap (and this readinessMap data) was
         RETIRED here: beat 02 now shows Elleta's real CHIP build, which
         supersedes the recreation. The notes live in git history; flagged
         in the PR to reinstate as a static figure if she wants them. */
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
      /* Elleta's REAL CHIP build, embedded as a poster-then-load
         prototype (supersedes the recreated ChipReadinessMap). Served
         from public/demos/chip-bridge/; illustrative data, own systems. */
      evidence: {
        kind: "prototype",
        src: "/demos/chip-bridge/index.html",
        title: "CHIP, the bridge for agentic design systems (my real build)",
        designWidth: 1280,
        designHeight: 800,
        poster: "/images/case-studies/chip-bridge-poster.png",
        posterAlt:
          "CHIP bridge entry screen: a Morning, Elleta greeting with the day's agenda and an Enter Bridge button, on the BELLA parchment skin",
      },
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
      /* TODO(elleta): the keyline carried three points; lead with one,
         the other two move into the beat-03 body. Confirm on preview. */
      why: "Honesty beats polish.",
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
      /* Takeaway restructured (Elleta-approved verbatim): leads with the
         offer, not the reflection. text = display headline, offer = the
         bold keyline, body = the closing paragraph. The old "best thing I
         did with a course..." line is removed as redundant.
         NOTE (her call on preview): the body's last sentence ("CHIP shows
         both what I'm thinking about and where my own systems are
         drifting, in one place.") is verbatim in the beat-03 outcome too;
         trim one if the repetition reads heavy. */
      kind: "lessons",
      text: "The hard part isn't the tokens. It's keeping a human in control while the machine moves fast.",
      offer:
        "That is the work I want to do with a team: the design-system rigor, plus the guardrails that let AI move fast without losing the human call.",
      body: "I don't want to just take notes on what I learn. I want it to change how my systems run. CHIP shows both what I'm thinking about and where my own systems are drifting, in one place.",
    },
    {
      kind: "paragraph",
      text: "Credit: Brad Frost, TJ Pitre, Ian Frost (Southleft), whose AI and design systems course seeded the inspection thinking. Evidence uses illustrative data and BELLA tokens; nothing from any client.",
    },
  ],
};

export default study;
