import type { CaseStudy } from "@/lib/content";

const study: CaseStudy = {
  slug: "design-system-transformation",
  title: "From Drift to Foundation",
  category: "DESIGN SYSTEMS",
  year: "2024–2026",
  scope: "Design Systems, Token Architecture, Component Library, Governance",
  timeline: "8 months",
  liveUrl: "",
  heroImage: "/images/thumbnails/TRAVEL.png",
  heroVideo: "/videos/design-system.mp4",
  metrics: {
    role: "Lead Product Designer — Design Systems",
    team: "Cross-functional (Engineering, Product)",
    timeline: "8 months",
    scope: "Component audit, token architecture, component library, governance",
  },
  overview: {
    headline:
      "Rebuilding design system thinking in a scaling SaaS product — from a graveyard of almost-the-same components to a shared foundation that actually reduced work.",
    body: "Many digital products start with good intentions: a few components, a shared style guide, a design file that everyone agrees to follow. But as a product grows, something subtle begins to happen. This was the situation at BizAway — a complex B2B SaaS platform with multiple booking flows and internal tooling evolving in parallel. I was the sole designer responsible for this work from beginning to end: conducting the audit, defining the architecture, authoring governance documentation, and working directly with engineering to ensure design decisions translated into reusable implementation.",
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
        "Many digital products start with good intentions: a few components, a shared style guide, a design file that everyone agrees to follow. But as a product grows, something subtle begins to happen. New features require slightly different patterns. Designers and developers start solving the same problems in slightly different ways. Components get duplicated, modified, or rebuilt from scratch.",
        "This was the situation I encountered while working on a complex SaaS platform with multiple booking flows and internal tooling evolving in parallel. Different teams were shipping features simultaneously, and the UI was growing faster than any shared set of rules could keep up with.",
        "The business goals were straightforward: ship new features faster without reinventing patterns each time, reduce engineering rework, maintain a consistent experience across flows, and lower the long-term cost of change. What wasn't yet clear was how far the existing structure fell short of supporting those goals.",
      ],
    },
    {
      label: "ROLE",
      heading: "My Role",
      paragraphs: [
        "I was the sole designer responsible for this work from beginning to end. That meant conducting the component audit, defining the system architecture, authoring the governance and pattern documentation, and working directly with engineering to ensure design decisions translated into reusable implementation.",
        "Critically, there was no dedicated design systems team, and no pre-existing mandate to do this work. A significant part of the role was making the case internally — demonstrating through the audit that the inconsistency the product had accumulated was not a cosmetic problem, but a structural one with real costs for delivery speed, engineering rework, and user experience. That advocacy work ran alongside the design work throughout, and shaped how the findings were framed and communicated to stakeholders.",
        "The project required operating across several modes simultaneously: researcher, architect, documentation author, and cross-functional collaborator. At no point was there a handoff to a separate implementation team — decisions made in Figma were validated directly with the engineers building them.",
      ],
    },
    {
      label: "THE PROBLEM",
      heading: "From Visual Problem to Structural One",
      paragraphs: [
        "At first glance, the issues looked mostly visual: inconsistent spacing, slightly different button styles, repeated components that didn't quite match. The initial assumption was straightforward — clean up the UI, standardise the components, move on.",
        "But as the audit got underway, the scale of what had accumulated became clear. The component library had grown into a graveyard of almost-the-same things: patterns that had been solved multiple times over, components that looked nearly identical but behaved differently, with no shared record of why one approach had been chosen over another.",
        "Compounding this was a structural problem with how the design system itself was maintained. Everything lived in a single, large design file. As the product grew, that file had become slow to open, prone to version conflicts when multiple designers worked within it, and increasingly difficult to navigate. There was no clear way to tell which components were stable and approved, which were experimental, and which had simply been left behind. The file that was supposed to be the source of truth had itself become a source of uncertainty.",
        "The deeper issue wasn't aesthetics. The product lacked a clear, reusable system for building interface patterns — so inconsistency wasn't a failure of execution. It was the predictable outcome of having no shared structure.",
        "Without that foundation, every new feature quietly added to the overhead. Design decisions were being made locally, under time pressure, by whoever was working on that sprint. Without clear component ownership and shared definitions, the library had become a source of confusion rather than clarity. The problem wasn't that people were designing badly. It was that there was no shared language to design within.",
      ],
    },
    {
      label: "INVESTIGATION",
      heading: "The Audit",
      paragraphs: [
        "To understand what was really happening, I ran a practical audit across key flows and the existing component library. The goal wasn't to build a perfect inventory — it was to find where the same user need was being solved differently, and to surface the structural gaps that were allowing inconsistency to accumulate.",
        "I focused on reviewing the component library and variant structure in Figma, comparing UI patterns across flows — search, results, booking, and forms — and mapping duplicated UI decisions: filter chips, sort controls, empty states, inline validation. I also identified where inconsistencies created friction for users or rework for engineering.",
        "This made the problem visible in a way that was hard to argue with: we weren't just managing a UI. We were managing a growing set of unspoken, undocumented decisions.",
      ],
    },
    {
      label: "INVESTIGATION",
      heading: "Audit Framework",
      paragraphs: [
        "To structure the audit findings and communicate them meaningfully to stakeholders, I evaluated the existing system against a five-point framework. Each dimension was chosen because it reflected a real cost the product was already paying — not an abstract ideal.",
        "Business Alignment. Was the system actively helping the product meet delivery and roadmap goals, or was it a passive reference that teams worked around? Gap Identification. Where were the missing patterns? Which user needs were being solved ad hoc because no system-level solution existed? Operational Efficiency. How much design and engineering time was being spent revisiting decisions that should have been resolved at the system level? Cross-Team Consistency. Were different teams building comparable experiences? And Sustainability. Could the system grow with the product?",
        "This framework shaped both the audit methodology and how findings were presented internally. It reframed the conversation from 'our UI looks inconsistent' to 'our current system structure is creating measurable overhead — here is the evidence.'",
      ],
    },
    {
      label: "INVESTIGATION",
      heading: "Studying Mature Systems",
      paragraphs: [
        "Alongside the internal audit, I spent time researching how mature design systems handle similar challenges at scale. I looked closely at Atlassian's Design System, Adobe Spectrum and Prism, and several enterprise SaaS products operating in complex, data-dense contexts.",
        "The goal wasn't to copy components. It was to understand how successful systems balance flexibility and consistency — and how they structure decisions so that teams can move quickly without fragmenting the experience.",
        "One particular influence was Atlassian's approach to component decision-making: their system documentation distinguishes clearly between extending an existing component and introducing a new one, with explicit criteria for each path. That framing shaped how I structured conversations with engineering about component ownership — shifting the question from 'should we build this?' to 'does this represent a genuinely new user need, or is it an edge case we haven't yet designed for elegantly within the existing system?' That small reframe made a meaningful difference in how we approached scope.",
        "What became clear across all of this research is that the best systems are not primarily about visual libraries. They are about reducing the number of decisions that need to be made repeatedly, and making the right patterns easy to find and use.",
      ],
    },
    {
      label: "KEY INSIGHTS",
      heading: "Key Insights",
      paragraphs: [
        "A few things became clear quickly. Most inconsistencies weren't intentional design choices. They were local solutions created under time pressure by people doing their best with the tools and context available. Nobody set out to create a fragmented system — it accumulated quietly.",
        "What made this particularly costly was compounding. A small variation in one component often forced downstream differences in layout, copy, and behaviour that were hard to predict and harder to untangle.",
        "The filter chip component was a clear illustration of this. It existed in four variations across the product: two used an icon-left layout, two used text-only. Beyond the visual difference, the behaviours diverged — one variant reset the entire filter state on tap, while another supported multi-select. Because the booking flow used a different variant than the search flow, the sort controls above each had to be positioned differently to maintain visual alignment. That positional difference, in turn, affected how empty states were laid out when no results appeared. One undocumented decision had created three downstream inconsistencies.",
        "The cost showed up in two places simultaneously. Users had to relearn patterns that should have felt familiar. Teams had to rebuild or re-interpret the same UI decisions, often unaware that a prior solution already existed somewhere in the design files.",
      ],
    },
    {
      label: "DESIGN STRATEGY",
      heading: "Design Strategy",
      paragraphs: [
        "These insights pointed toward a clear shift in approach. Rather than redesigning individual screens, the effort needed to move upstream — toward building a shared foundation that could survive growth and support the teams working within it.",
        "The strategy had four parts: identify the core building blocks used everywhere across the product; define interaction patterns, not just visual styles; reduce the number of valid variations by creating components flexible enough to handle real edge cases; and align design decisions with how engineering would actually implement and reuse them.",
        "Less pixel perfection. More decision clarity.",
        "A key part of this was introducing design tokens — named, reusable values that represented visual decisions rather than fixed properties. Instead of a button storing a hard-coded hex value for its background colour, it referenced a token: a semantic decision like 'interactive-primary' that could be defined once and propagated consistently across every component that used it. Tokens became the lowest layer of the system — the mechanism that allowed a visual change to be made in one place and flow through the entire product without manual updates to individual components.",
        "This meant resisting the temptation to solve every edge case with a new component variant. Every time a new variation was proposed, the question became: is this a genuinely new user need, or is it an edge case the existing system hasn't yet been designed to handle elegantly?",
      ],
    },
    {
      label: "SYSTEM DESIGN",
      heading: "System Architecture",
      paragraphs: [
        "Rather than treating the design system as a flat library of components, I structured it in tiers. Each tier had a clear purpose and a clear relationship to the tiers above and below it.",
        "Foundations. Design tokens, colour scales, spacing units, typographic scales, and elevation values. These are the primitives — the raw decisions that every component and pattern depends on. Getting these right is what makes the rest of the system coherent.",
        "Components. Reusable UI elements built on top of the foundations: buttons, inputs, dropdowns, filter chips, modals, form fields. Each component references foundation tokens rather than hard-coded values, which means changes to the foundations propagate automatically.",
        "Documentation. Usage guidance, interaction specifications, accessibility requirements, and decision rationale for every component. This is the layer that separates a component library from a design system. Without it, teams can see what a component looks like but not when or how to use it correctly.",
        "System Hub. A central reference point — living documentation that brought together component status, usage guidance, recent updates, and contribution guidelines. The hub made it possible to answer the question 'is there already a system-level solution for this?' without having to dig through multiple files.",
        "This tiered structure separated the concerns that had previously been collapsed into a single file. That separation made the system easier to maintain, easier to navigate, and easier to extend without introducing unintended side effects.",
      ],
    },
    {
      label: "SYSTEM DESIGN",
      heading: "Levels of Reuse",
      paragraphs: [
        "Designing for reuse at multiple levels — rather than at the component level alone — was central to the architecture. At the foundation were atomic components: buttons, inputs, dropdowns — the primitives that appear everywhere. Above those sat patterns: filtering, sorting, empty states, form validation. And above those, composition rules: how components combine to form predictable, learnable layouts across the product.",
        "A concrete example made this tangible early on. The base Input component — a text field with defined focus states, error states, and validation behaviour — was the same atom reused across the booking flow, the passenger search, and the internal form tooling. When an accessibility audit identified an issue with the focus ring contrast, fixing it once in the base component propagated the correction across every flow simultaneously. No flow-specific patches, no risk of partial fixes.",
        "That kind of leverage is what made the investment in a shared foundation worthwhile. The return wasn't felt the week the system was built — it was felt every time a new feature reached for an existing pattern and found it already solved.",
      ],
    },
    {
      label: "SYSTEM DESIGN",
      heading: "Governance",
      paragraphs: [
        "One of the hardest problems in design systems work is not building the system — it's preventing it from fragmenting again once teams start shipping against it.",
        "To address this, I introduced a lightweight governance process. Rather than a heavyweight committee or approval chain, the goal was a clear, low-friction path for proposing changes: a defined workflow through which teams could flag a missing component, propose a modification to an existing one, or request a new pattern. Each proposal was evaluated against the five audit dimensions before being accepted into the system.",
        "The governance layer also established component status conventions: a clear distinction between components that were stable and production-ready, those that were in review, and those that were experimental or deprecated. This solved the problem that had previously made the single-file system so hard to navigate — teams could now tell at a glance what was safe to build with and what was still being defined.",
        "Governance is easy to skip when time is short. It is also the thing that determines whether the system remains useful or quietly becomes another graveyard.",
      ],
    },
    {
      label: "COLLABORATION",
      heading: "Collaboration",
      paragraphs: [
        "This kind of work only holds if it's shared. A design system that lives only in Figma isn't a system — it's a reference document that will quickly fall out of date.",
        "I worked closely with engineering throughout, not just at handoff. Together we agreed on which components were system-level and which were feature-specific, decided where flexibility was genuinely worth the complexity and where standardisation mattered more, and used real upcoming features as live test cases to validate that the system actually reduced work rather than adding process.",
        "When an engineer could reach for an existing, well-defined pattern instead of building something from scratch, the system gained credibility. When a new feature shipped faster because the design decisions had already been made at the system level, the investment began to pay back.",
      ],
    },
    {
      label: "ROLLOUT",
      heading: "Implementation & Rollout",
      paragraphs: [
        "The system was introduced gradually rather than deployed as a big-bang release. Replacing an existing design system wholesale carries its own risks — breaking changes, loss of institutional knowledge about why things were built a certain way, and the disruption of ongoing product work. The better approach was to let active features pull the system into use.",
        "In practice, this meant prioritising the components and patterns needed for upcoming product work first, and building out coverage iteratively as new modules were scoped. The system was used to support the release of several significant product areas: dashboards, user administration, invoicing, and reporting. Each module presented different component demands and helped stress-test the architecture — validating that the foundation layer could support a range of layout contexts without requiring flow-specific exceptions.",
        "This approach had a secondary benefit: it gave engineering concrete experience with the system early, which surfaced implementation questions that documentation alone couldn't anticipate. Decisions about token naming conventions, component API structure, and variant logic were refined through real build work rather than in the abstract.",
      ],
    },
    {
      label: "OUTCOMES",
      heading: "Outcome & Expected Impact",
      paragraphs: [
        "The outcome wasn't a single redesign. **It was a more scalable foundation — a shared language for how the product should look, behave, and grow.**",
        "Concretely: **duplicated components were consolidated into a smaller set of flexible, well-defined building blocks.** Interaction patterns for filtering, sorting, and form behaviour were defined so users encountered predictable experiences across flows. Component states and usage guidance were documented so that design intent didn't get lost between Figma and code. **The design file structure was reorganised from a single monolithic file into a tiered system** where each layer — foundations, components, documentation, assets — had a clear home.",
        "\"The UI shifted from being whatever the last sprint produced to feeling like a coherent product language.\"",
        "Without formal metrics in place at the start of the project, I can't quantify the impact precisely. What I can say is that the expected direction of change was clear: **fewer decisions repeated from scratch, fewer inconsistencies accumulating across flows, easier onboarding for new team members** joining a product with a shared vocabulary, and more confidence when scaling because the foundation was designed to hold.",
      ],
    },
    {
      label: "REFLECTION",
      heading: "Reflection",
      paragraphs: [
        "The most useful shift for me on this project was recognising that **inconsistency is rarely the root problem — it's a symptom** of missing structure, of undocumented decisions, of a system that grew faster than the rules that were supposed to govern it.",
        "**Design systems, when done well, are not a visual cleanup exercise. They are an organisational tool.** They make product teams more effective by reducing the cognitive overhead of repeated decision-making. They make user experiences more predictable by ensuring that familiar patterns stay familiar.",
        "Doing this work as a solo designer, without a dedicated systems team, also reinforced something about advocacy: **the audit framework wasn't just a research method — it was a communication tool.** Framing the problem in terms of business alignment and delivery cost made it possible to have a different kind of conversation about the value of the work.",
        "\"The best governance is invisible. It works because the right choice was always easier than the wrong one.\"",
      ],
    },
  ],
};

export default study;
