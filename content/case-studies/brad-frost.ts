import type { CaseStudy } from "@/lib/content";

const study: CaseStudy = {
  slug: "brad-frost",
  href: "/case-studies/brad-frost",
  title: "Code First",
  category: "DESIGN SYSTEMS",
  year: "2024-2025",
  scope: "Component Architecture, Token Alignment, Figma-Storybook Integration",
  timeline: "Oct 2024 - Jan 2025",
  heroImage: "/images/thumbnails/BradFrostCommandCenter.png",
  metrics: {
    role: "Design System Collaborator",
    team: "Brad Frost Web Maker Program",
    timeline: "Oct 2024 - Jan 2025",
    scope: "Component Architecture, Token Alignment, Figma-Storybook Integration, MCP",
  },
  overview: {
    headline: "Building Brad Frost's component system in reverse, code-first, token-aligned, AI-enabled.",
    body: "Working as part of Brad Frost's Maker Program, I joined a project where the code already existed. The challenge was to understand an existing system deeply enough to contribute meaningfully at the component and token level, bring Figma into alignment with code reality, and use AI tooling to close the loop between the two.",
  },
  images: [],
  problem: {
    title: "Starting From Code",
    body: "Most design system work starts in Figma. This project inverted that entirely. Every decision had to be justified against an existing, principled structure rather than invented from first principles, which turned out to be enormously useful.",
  },
  outcomes: {
    title: "Aligned, Documented, Maintainable",
    body: "Figma and Storybook components aligned across the system. Token layer documented with explicit primitive → semantic → component chain. MCP workflow established for ongoing system investigation.",
    completionTag: "PROJECT COMPLETE · 2025",
  },
  tags: ["Design Systems", "Atomic Design", "Code-First", "AI Tooling"],
  clientLogo: "/images/logos/bradfrostwebjpeg.jpeg",
  clientName: "Brad Frost Web",
  description: "What Building Brad Frost's Component System in Reverse Taught Me About Design",
  /* ── The ONE render path — ordered blocks (migrated from the former
   * hand-built page, 1:1) ── */
  eyebrow: "Design System Collaboration · 2024-2025",
  summary:
    "What building Brad Frost's component system in reverse taught me about design, and why working code-first changes everything you pay attention to.",
  metadata: [
    { label: "Year", value: "2024-2025" },
    { label: "Role", value: "Design System Collaborator" },
    { label: "Scope", value: "Component Architecture · Token Alignment · Figma-Storybook Integration · MCP" },
    { label: "Organisation", value: "Brad Frost Web, Maker Program" },
  ],
  blocks: [
    {
      kind: "section",
      eyebrow: "OVERVIEW",
      heading: "Project Overview",
      children: [
        { kind: "paragraph", text: "I opened the Figma file and the code side by side. The button in Figma said 'Primary, Large.' The button in Storybook said 'variant: action, size: lg.' Same component. Different names. Different assumptions. And this was one of the simpler ones. Somewhere in the gap between those two descriptions, a year of quiet drift had accumulated, and nobody had noticed because the system still looked right, even though it no longer said the same thing in both places." },
        { kind: "paragraph", text: "This was Brad Frost's design system. The person who wrote Atomic Design. If alignment could drift here, in a system built on first principles by someone who literally invented the vocabulary, it could drift anywhere. That realisation reframed the entire project for me." },
        { kind: "paragraph", text: "Working as part of the Maker Program, the challenge wasn't to design a system and hand it off. It was to understand an existing, principled system deeply enough to contribute at the component and token level, to close the gap between Figma and code, and to explore whether AI tooling could make that kind of structural investigation fundamentally faster." },
      ],
    },
    {
      kind: "section",
      eyebrow: "CONTEXT",
      heading: "Starting From Code",
      children: [
        { kind: "paragraph", text: "Brad Frost's approach to design systems is rooted in Atomic Design, the idea that UIs are built from atoms to molecules to organisms, and that the smallest decisions compound upward. Working with his system meant operating in an environment where those principles were already embedded in the codebase, not aspirational documentation." },
        { kind: "paragraph", text: "The Maker Program is structured around real contribution: participants don't observe, they build. The expectation from day one was to read the existing codebase, understand how components were structured, identify gaps between design and implementation, and then close them, through Figma work, documentation, and direct collaboration with Brad and other contributors." },
        { kind: "paragraph", text: "This was a fundamentally different experience from owning a design system from scratch. Every decision had to be justified against an existing, principled structure rather than invented from first principles. That constraint turned out to be enormously useful." },
      ],
    },
    {
      kind: "section",
      eyebrow: "MY ROLE",
      heading: "Collaboration and Contribution",
      children: [
        { kind: "paragraph", text: "My work spanned three areas. The first was component archaeology: reading Storybook stories, tracing prop structures, and mapping how existing components composed. This wasn't glamorous work, but it was the prerequisite for everything else, you can't contribute to a design system you don't understand." },
        { kind: "paragraph", text: "The second was Figma alignment: rebuilding or updating Figma components to accurately reflect their code counterparts. This meant matching variant names to prop names, ensuring token usage was consistent, and eliminating the silent drift that accumulates when design and code evolve independently." },
        { kind: "paragraph", text: "The third was tooling: using Claude via MCP to interrogate system structure, surface token relationships, and accelerate the investigation work that would otherwise require extensive manual tracing. This was the most experimental part of the project and the one I learned the most from." },
      ],
    },
    { kind: "pullQuote", text: "\"Working code-first changes what you pay attention to. You stop asking 'what should this look like?' and start asking 'what does this actually do, and why?'\"" },
    {
      kind: "section",
      eyebrow: "TECHNICAL WORK",
      heading: "Token Alignment and Component Architecture",
      children: [
        { kind: "paragraph", text: "Token alignment was the most technically demanding part of the work. The system used a layered token structure, primitive values feeding into semantic aliases, which fed into component-level decisions. Understanding where a visual change should be made required tracing the full chain before touching anything." },
        { kind: "paragraph", text: "Several components had diverged between Figma and Storybook over time. Some were structural: variant names in Figma didn't match prop names in code, which made handoff ambiguous. Others were visual: spacing or color values had been updated in one place but not the other. The process of aligning these wasn't just cosmetic, it required understanding the intent behind each decision well enough to make the right reconciliation." },
        { kind: "paragraph", text: "Component architecture decisions in the codebase reflected years of atomic thinking. Certain patterns that I might have approached differently as a solo designer, like deeply nested composition patterns or explicit default prop handling, made more sense in context. That was a useful recalibration: understanding why a system is structured the way it is before proposing changes to it." },
      ],
    },
    {
      kind: "section",
      eyebrow: "AI TOOLING",
      heading: "Using Claude MCP for System Investigation",
      children: [
        { kind: "paragraph", text: "The most novel part of the project was using Claude's Model Context Protocol to assist with system investigation. MCP allows Claude to interact directly with local files and project structure, which made it possible to ask structural questions about the codebase, \"what components use this token?\", \"where is this variant defined?\", and get answers grounded in the actual code rather than hallucinated from training data." },
        { kind: "paragraph", text: "This changed the pace of investigation work significantly. Manual token tracing across a large component library can take hours. Using MCP to surface relationships and then verify them manually reduced that to minutes for most queries. The workflow settled into a pattern: use Claude to generate a structural hypothesis, verify it against the source, then act on it." },
        { kind: "paragraph", text: "The limits were also instructive. MCP is powerful for surfacing structure, but it doesn't replace understanding. Queries that required design judgement, \"is this the right token for this context?\", still needed a human answer. The tooling accelerated investigation; it didn't replace thinking." },
      ],
    },
    { kind: "pullQuote", text: "\"The best use of AI in design system work isn't generating components, it's accelerating the investigation that good system decisions depend on.\"" },
    {
      kind: "section",
      eyebrow: "Evidence",
      heading: "The Same Discipline, on This Site",
      children: [
        { kind: "paragraph", text: "The portfolio you are reading runs on the same code-first discipline: a token layer, one component per job, and a governance gate that fails the build on drift. The inspector below is live, it reads the driving tokens straight from this site's running stylesheet." },
        {
          kind: "embed",
          src: "/design-system/inspector",
          title: "Token inspector, live from this site's design system",
          frame: "light",
          aspect: "16/9",
          minHeight: 460,
        },
      ],
    },
    {
      kind: "section",
      eyebrow: "LIVE DEMO",
      heading: "Connecting the System to AI in Real Time",
      children: [
        { kind: "paragraph", text: "To explore how AI tools could interact with a live design system, we connected the Figma component library to an MCP workflow and tested it in real time, alongside Brad Frost and TJ Pitre." },
        {
          kind: "youtube",
          src: "https://www.youtube.com/embed/w6bHNKU_Tn8?start=2376",
          title: "Brad Frost, Elleta McDaniel & TJ Pitre, Connecting Figma Design System to MCP",
          caption: "Recorded session with Brad Frost, TJ Pitre, and Elleta McDaniel, starts at the MCP integration demo (39:36).",
        },
      ],
    },
    {
      kind: "section",
      eyebrow: "KEY LEARNINGS",
      heading: "Key Learnings",
      children: [
        { kind: "paragraph", text: "**Code-first is a design skill.** Reading a codebase to understand design intent requires the same analytical rigour as reading a user research report. The information is just encoded differently." },
        { kind: "paragraph", text: "**Token discipline is a long-term investment.** Systems that maintain strict token layering are significantly easier to update consistently. The upfront cost of doing this well pays back compoundingly as the system scales." },
        { kind: "paragraph", text: "**Figma-Storybook alignment requires active maintenance.** Drift is the default state; alignment requires deliberate process. The question isn't whether it will drift, it's whether you've built the habit of closing the gap." },
        { kind: "paragraph", text: "**AI tooling changes what's feasible in investigation.** MCP-assisted system investigation made structural questions answerable in minutes that would previously have taken hours. That changes what you can reasonably attempt in a bounded project." },
      ],
    },
    {
      kind: "section",
      eyebrow: "REFLECTION",
      heading: "Reflection",
      children: [
        { kind: "paragraph", text: "This project shifted my intuition about where design system work actually happens. The highest-value work isn't in the Figma file, it's in the alignment between design intent and implementation reality. That alignment requires a designer who can read code, trace decisions, and understand a system on its own terms before proposing changes to it." },
        { kind: "paragraph", text: "Working with Brad's system was the most rigorous design system experience I've had precisely because there was no greenfield freedom. Every decision was in conversation with something that already existed and had been thought through. That constraint is, I think, the most realistic version of design system work at scale, and the one worth getting good at." },
      ],
    },
  ],
};

/* ── TODO(elleta): decision-led template scaffold. Fill in YOUR words,
 * then move this into the study object as `blocks: [...]` (see
 * design-system-transformation.ts for the model). Nothing here renders
 * while commented.
 *
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
