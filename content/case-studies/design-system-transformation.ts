import type { CaseStudy } from "@/lib/content";

const study: CaseStudy = {
  slug: "design-system-transformation",
  title: "From Drift to Foundation",
  category: "DESIGN SYSTEMS",
  year: "2024–2026",
  scope: "Design Systems, Token Architecture, Component Library, Governance",
  timeline: "8 months",
  liveUrl: "",
  heroImage: "/demos/case-study-visuals/ds-hero.html",
  thumbnailImage: "/images/thumbnails/ds-audit-thumb.svg",
  heroVideo: undefined,
  metrics: {
    role: "Lead Product Designer — Design Systems",
    team: "Cross-functional (Engineering, Product)",
    timeline: "8 months",
    scope: "Component audit, token architecture, component library, governance",
  },
  overview: {
    headline:
      "Rebuilding design system thinking in a scaling SaaS product — from a graveyard of almost-the-same components to a shared foundation that actually reduced work.",
    body: "Seventeen buttons. Four filter chips doing the same job differently. A component library that had become a graveyard of almost-the-same things. At BizAway, a B2B travel platform scaling across multiple booking verticals, the product had outgrown the decisions that were supposed to hold it together. As sole designer, I led the audit, defined the architecture, authored governance, and worked directly with engineering to rebuild the system from foundations up.",
  },
  images: [],
  problem: {
    title: "From Visual Problem to Structural One",
    body: "At first glance, the issues looked mostly visual: inconsistent spacing, slightly different button styles, repeated components that didn't quite match. But as the audit got underway, the scale became clear. The component library had grown into a graveyard of almost-the-same things — patterns solved multiple times over, with no shared record of why one approach had been chosen over another.",
  },
  process: {
    title: "How It Came Together",
    steps: [
      {
        number: "01",
        title: "Component Audit",
        description:
          "Ran a practical audit across key flows and the existing component library — mapping duplicated UI decisions to make the structural problem visible and undeniable.",
      },
      {
        number: "02",
        title: "Token Architecture",
        description:
          "Introduced design tokens as the lowest layer of the system — named, semantic values that propagate visual decisions consistently across every component without manual updates.",
      },
      {
        number: "03",
        title: "Tiered System Structure",
        description:
          "Restructured the system into clear tiers: Foundations, Components, Documentation, and a System Hub as the central reference point.",
      },
      {
        number: "04",
        title: "Governance & Rollout",
        description:
          "Introduced lightweight governance with component status conventions and a clear contribution workflow. Rolled out gradually — letting active features pull the system into use.",
      },
    ],
  },
  outcomes: {
    title: "A Foundation, Not a Cleanup",
    body: "Duplicated components consolidated into a smaller set of flexible, well-defined building blocks. Interaction patterns for filtering, sorting, and form behaviour defined so users encounter predictable experiences across flows. The UI shifted from being whatever the last sprint produced to feeling like a coherent product language — and the system gained credibility every time an engineer reached for an existing pattern and found it already solved.",
    completionTag: "PROJECT COMPLETE · 2026",
  },
  tags: ["Figma", "Design Tokens", "Atomic Design", "Governance", "BizAway"],
  clientLogo: "/images/logos/bizaway_logo.jpeg",
  clientName: "BizAway",
  demoLinks: [
    { label: "ctrl+travel prototype", href: "/demos/ctrl-travel.html" },
    { label: "ctrl+travel v2", href: "/demos/ctrl-travel-v2.html" },
  ],
  description:
    "Rebuilding Design System Thinking in a Scaling SaaS Product",
  narrative: [
    {
      label: "CONTEXT",
      heading: "Project Context",
      paragraphs: [
        "It started with a button. Not a broken one — a button that worked fine. The problem was, there were seventeen of them. Seventeen buttons across the product that did roughly the same thing, built at different times, by different people, with slightly different radii, weights, and hover states.",
        "Nobody had set out to create seventeen buttons. Each one made sense when it was built. But standing back and looking at all of them together, the shape of a deeper problem became visible: the product had outgrown the decisions that were supposed to hold it together.",
        "This was a B2B travel platform used by companies across Europe — flights, hotels, rail, car rentals, internal tooling — all evolving in parallel. The UI was growing faster than any shared rules could keep up with. Every sprint added another local solution, another quiet variation nobody would notice until the next person built on top of it.",
      ],
    },
    {
      label: "ROLE",
      heading: "My Role",
      paragraphs: [
        "I was the sole designer responsible for this work from beginning to end — component audit, system architecture, governance documentation, and direct collaboration with engineering on implementation.",
        "There was no dedicated design systems team and no pre-existing mandate. A significant part of the role was making the case internally: demonstrating through the audit that the inconsistency was not cosmetic but structural, with real costs for delivery speed and engineering rework.",
      ],
    },
    {
      label: "THE PROBLEM",
      heading: "From Visual Problem to Structural One",
      paragraphs: [
        "At first glance, the issues looked mostly visual: inconsistent spacing, slightly different button styles, repeated components that didn't quite match. Clean up the UI, standardise the components, move on.",
        "But as the audit progressed, the scale became clear. The component library had grown into a graveyard of almost-the-same things — patterns solved multiple times over, with no shared record of why one approach was chosen over another.",
        "Everything lived in a single, large design file. It had become slow to open, prone to version conflicts, and impossible to tell which components were stable, which were experimental, and which had simply been left behind.",
        "The problem wasn't that people were designing badly. It was that there was no shared language to design within.",
      ],
    },
    {
      label: "INVESTIGATION",
      heading: "The Audit",
      paragraphs: [
        "I ran a practical audit across key flows and the existing component library — not to build a perfect inventory, but to find where the same user need was being solved differently.",
        "I mapped duplicated UI decisions across search, results, booking, and forms: filter chips, sort controls, empty states, inline validation. This made the problem visible in a way that was hard to argue with.",
      ],
      embedSrc: "/demos/case-study-visuals/ds-audit-buttons.html",
      embedAlt: "Component audit: 17 button variations across the product",
      embedAspect: "16/10",
    },
    {
      label: "INVESTIGATION",
      heading: "Five-Point Audit Framework",
      paragraphs: [
        "To structure the findings and communicate them meaningfully, I evaluated the existing system against five dimensions — each chosen because it reflected a real cost the product was already paying.",
        "This framework reframed the conversation from 'our UI looks inconsistent' to 'our current system structure is creating measurable overhead — here is the evidence.'",
      ],
      embedSrc: "/demos/case-study-visuals/ds-audit-framework.html",
      embedAlt: "Five-point audit framework: Business Alignment, Gap Identification, Operational Efficiency, Cross-Team Consistency, Sustainability",
      embedAspect: "4/3",
    },
    {
      label: "KEY INSIGHTS",
      heading: "What the Audit Revealed",
      paragraphs: [
        "Most inconsistencies weren't intentional design choices. They were local solutions created under time pressure. Nobody set out to fragment the system — it accumulated quietly, one sprint at a time.",
        "What made it costly was compounding. The filter chip existed in four variations. Two used icon-left, two used text-only. The behaviours diverged — one reset filters on tap, another supported multi-select. This forced different sort control positioning, which affected empty state layouts. **One undocumented decision had created three downstream inconsistencies.**",
      ],
    },
    {
      label: "DESIGN STRATEGY",
      heading: "Design Strategy",
      paragraphs: [
        "Rather than redesigning individual screens, the effort needed to move upstream — toward a shared foundation that could survive growth.",
        "The strategy had four parts: identify the core building blocks used everywhere; define interaction patterns, not just visual styles; reduce the number of valid variations; and align design decisions with how engineering would actually implement and reuse them.",
        "**Less pixel perfection. More decision clarity.**",
        "A key part was introducing design tokens — named, reusable values representing visual decisions. Instead of a button storing a hard-coded hex value, it referenced a semantic token like 'interactive-primary' that could be defined once and propagated everywhere.",
      ],
    },
    {
      label: "SYSTEM DESIGN",
      heading: "System Architecture",
      paragraphs: [
        "I structured the system in four tiers, each with a clear purpose:",
        "**Foundations** — design tokens, colour scales, spacing, typography, elevation. The raw decisions everything depends on. **Components** — buttons, inputs, dropdowns, filter chips, modals — each referencing foundation tokens, not hard-coded values. **Documentation** — usage guidance, interaction specs, accessibility requirements, and decision rationale. **System Hub** — living documentation bringing together component status, usage guidance, and contribution guidelines.",
        "This separated the concerns previously collapsed into a single file — making the system easier to maintain, navigate, and extend.",
      ],
      embedSrc: "/demos/case-study-visuals/ds-after-system.html",
      embedAlt: "Unified design system: component documentation with token chain and variants",
      embedAspect: "3/2",
    },
    {
      label: "SYSTEM DESIGN",
      heading: "Maturity Tracking",
      paragraphs: [
        "To measure progress beyond component counts, I tracked the system's maturity across nine dimensions grouped into three categories: Foundation (tokens, components, documentation), Growth (interoperability, innovation, quality assurance), and ROI (governance, adoption, culture).",
        "This gave stakeholders a clear before-and-after picture and made the investment case concrete — not just 'things look better' but 'here is how the system has matured across the dimensions that matter.'",
      ],
      embedSrc: "/demos/case-study-visuals/ds-maturity-scales.html",
      embedAlt: "Design system maturity assessment across 9 dimensions",
      embedAspect: "4/3",
    },
    {
      label: "SYSTEM DESIGN",
      heading: "Governance",
      paragraphs: [
        "The hardest problem isn't building the system — it's preventing it from fragmenting again.",
        "I introduced a lightweight governance process: a clear, low-friction path for proposing changes. Each proposal was evaluated against the five audit dimensions. Component status conventions distinguished stable, in-review, experimental, and deprecated — so teams could tell at a glance what was safe to build with.",
        "\"The best governance is invisible. It works because the right choice was always easier than the wrong one.\"",
      ],
    },
    {
      label: "COLLABORATION",
      heading: "Collaboration & Rollout",
      paragraphs: [
        "A design system that lives only in Figma isn't a system — it's a reference document that will fall out of date. I worked closely with engineering throughout, not just at handoff.",
        "The system was introduced gradually, letting active features pull it into use. It supported the release of dashboards, user administration, invoicing, and reporting — each module stress-testing the architecture.",
        "When an engineer could reach for an existing pattern instead of building from scratch, the system gained credibility. When a feature shipped faster because the design decisions had already been made, the investment began to pay back.",
      ],
    },
    {
      label: "OUTCOMES",
      heading: "Outcome",
      paragraphs: [
        "**The outcome wasn't a single redesign. It was a shared language for how the product should look, behave, and grow.**",
        "Duplicated components consolidated into flexible building blocks. Interaction patterns defined so users encounter predictable behaviour across flows. The design file reorganised from a single monolithic file into a tiered system where each layer has a clear home.",
        "\"The UI shifted from being whatever the last sprint produced to feeling like a coherent product language.\"",
      ],
    },
    {
      label: "REFLECTION",
      heading: "Reflection",
      paragraphs: [
        "The most useful shift was recognising that **inconsistency is rarely the root problem — it's a symptom** of missing structure and undocumented decisions.",
        "Doing this as a solo designer reinforced something about advocacy: **the audit framework wasn't just a research method — it was a communication tool.** Framing the problem in terms of business alignment and delivery cost made it possible to have a different kind of conversation about the value of the work.",
      ],
    },
  ],
};

export default study;
