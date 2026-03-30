import type { CaseStudy } from "@/lib/content";

const study: CaseStudy = {
  slug: "filters-decision-support-system",
  title: "Search & Filtering System for Complex Travel Booking",
  category: "UX STRATEGY",
  year: "2024–2025",
  scope: "Search UX, filtering systems, results architecture, constraint messaging",
  timeline: "Embedded / ongoing",
  liveUrl: "",
  heroImage: "/images/carosel/CTRL_ATL_TRAVEL.jpeg",
  heroVideo: undefined,
  metrics: {
    role: "Lead Product Designer",
    team: "Engineering, Product",
    timeline: "Embedded / ongoing",
    scope: "Interaction design, system architecture, governance documentation",
  },
  overview: {
    headline:
      "Rethinking how filtering interfaces shape user cognition — and why fixing them requires system thinking, not just visual cleanup.",
    body: "Nine filter controls, all at equal visual weight, with no sense of which ones matter for the decision at hand. On a B2B travel platform, filtering had been designed as data exposure, not decision support. This case study explores what happened when we reframed filtering as a cognitive scaffolding problem — and built a system architecture to match.",
  },
  images: [],
  problem: {
    title: "Capability Without Clarity Is Just a Different Kind of Friction",
    body: "At first glance, the filtering interfaces across the product looked inconsistent but manageable. Filter chips in one flow looked different from filter chips in another. Sort controls weren't positioned consistently. Some filters preserved their active state clearly; others gave no visible signal that they were applied at all. The instinct was to clean it up visually and standardise the components. But a more important question kept surfacing: if we fix how the filters look, will they actually become easier to use?",
  },
  process: {
    title: "How It Came Together",
    steps: [
      {
        number: "01",
        title: "Pattern Audit",
        description:
          "Ran a focused audit of filtering interfaces across the key flows — mapping filter chips, sort controls, active state patterns, and empty states to surface where the same user need was being solved differently.",
      },
      {
        number: "02",
        title: "Shared Mental Model",
        description:
          "Defined what filtering should do across the product before redesigning any component — filtering as progressive narrowing, not data exposure.",
      },
      {
        number: "03",
        title: "Three-Level Architecture",
        description:
          "Designed the filtering system at three levels: atomic components, interaction patterns, and composition rules governing how filtering relates to results, empty states, and loading.",
      },
      {
        number: "04",
        title: "Governance & Documentation",
        description:
          "Documented the user need each pattern addresses, the contexts it's appropriate in, and the criteria for deciding when a new filter type is warranted versus extending an existing one.",
      },
    ],
  },
  outcomes: {
    title: "A Shared Language, Not Just Better Components",
    body: "Duplicated filter components consolidated into a smaller set of flexible, well-defined building blocks. Interaction patterns for multi-select filtering, range selection, sort integration, and empty states defined so that users encounter predictable behaviour across flows. The most important outcome was structural: a reusable filtering interaction pattern with a consistent contract across the product.",
    completionTag: "PROJECT COMPLETE · 2025",
  },
  tags: ["Figma", "Interaction Design", "Cognitive UX", "Search UX", "BizAway"],
  clientLogo: "/images/logos/bizaway_logo.jpeg",
  clientName: "BizAway",
  demoLinks: [
    { label: "BizAway search prototype", href: "/demos/bizaway-search.html" },
    { label: "BizAway filter demo", href: "/demos/bizaway-filter-demo.html" },
    { label: "ctrl+travel v2", href: "/demos/ctrl-travel-v2.html" },
  ],
  description:
    "Designing decision support for a multi-vertical B2B travel platform.",
  narrative: [
    {
      label: "CONTEXT",
      heading: "Project Context",
      paragraphs: [
        "A travel manager in Munich needs a flight to London, arriving before noon, refundable, under the company policy cap. She opens the booking platform and sees: price range, outbound departure, return departure, number of stops, airline, layover duration, baggage, refundability, booking class — nine controls, all presented at once, all at equal visual weight, with no indication of which ones matter most for her decision. She is not filtering a dataset. She is trying to make a decision. But the interface doesn't know the difference.",
        "That gap — between what filtering interfaces expose and what users actually need to decide — was the starting point for this work. On a B2B travel platform managing flights, hotels, rail, and car rentals across multiple booking verticals, filtering had accumulated into something fragmented and inconsistent. Each vertical had its own approach to search, its own filter controls, its own assumptions about user intent.",
        "The business goals were clear: help users find what they need faster, reduce support overhead from confusion, and create a filtering pattern that could scale. But what became clear quickly was that the visible interface problems were symptoms of a deeper structural issue. Fixing how the filters looked wouldn't fix how they worked — because nobody had defined what filtering should actually do across the product.",
      ],
    },
    {
      label: "ROLE",
      heading: "My Role",
      paragraphs: [
        "I led the investigation and redesign of the filtering system. This included auditing existing filter patterns across product flows, mapping inconsistencies and their downstream effects, defining a system-level pattern architecture, and working directly with engineering to ensure the redesigned patterns could be implemented and reused reliably.",
        "This was not a project with a dedicated design systems team. It required building the case for the work while doing it — and making that case to both design and engineering leadership in terms that connected to real product outcomes, not just aesthetic improvements.",
      ],
    },
    {
      label: "THE PROBLEM",
      heading: "Capability Without Clarity Is Just a Different Kind of Friction",
      paragraphs: [
        "At first glance, the filtering interfaces across the product looked inconsistent but manageable. Filter chips in one flow looked different from filter chips in another. Sort controls weren't positioned consistently. Some filters preserved their active state clearly; others gave no visible signal that they were applied at all.",
        "The instinct was to clean it up visually and standardise the components. But a more important question kept surfacing: if we fix how the filters look, will they actually become easier to use?",
        "Consider a user who wants to find a reasonably priced flight arriving before noon — a straightforward goal. The filter panel exposes simultaneously: price range, outbound departure time, return departure time, number of stops, airline, layover duration, baggage allowance, refundability, and booking class. None of these filters are wrong to offer. But presenting all of them at equal visual weight, with no grouping and no indication of which are most relevant, forces the user to understand the filter panel before they can narrow the problem. The interface has more capability than it has clarity — and capability without clarity is just a different kind of friction.",
        "The deeper issue wasn't visual inconsistency. It was that no shared mental model existed for what filtering should do — which meant every flow had developed its own answer to the same question. Without that shared model, fixing the surface wouldn't fix the experience.",
      ],
      embedSrc: "/demos/case-study-visuals/filters-before.html",
      embedAlt: "Before: nine filter controls at equal visual weight — capability without clarity",
      embedAspect: "3/2",
    },
    {
      label: "WHAT FILTERING DOES",
      heading: "What Filtering Is Really Doing",
      paragraphs: [
        "Before rethinking how filters look, it's worth being precise about what they're for.",
        "Filtering is, fundamentally, a form of progressive narrowing. It takes an overwhelming set of possibilities and allows a user to eliminate options that don't match their current intent — reducing cognitive load by reducing scope. Done well, a filtering interface doesn't just let users control a dataset. It scaffolds their thinking.",
        "This matters because the opposite is also true. A poorly structured filtering interface doesn't just fail to help — it actively increases cognitive load. Every additional filter the user has to evaluate, every ambiguous control they have to interpret, every active filter they lose track of: these are moments where the interface is transferring its own complexity onto the person trying to use it.",
        "Vitaly Friedman has written about this kind of cognitive cost in the context of interface patterns broadly: that the best interfaces reduce the number of decisions a user has to make, not by removing capability, but by making the right paths easier to follow. Filtering interfaces are a direct expression of that principle — or a direct failure of it.",
      ],
    },
    {
      label: "INVESTIGATION",
      heading: "The Audit",
      paragraphs: [
        "To understand what was actually happening across the product, I ran a focused audit of the filtering interfaces within the key flows: search, results, and booking. Rather than building an exhaustive component inventory, the goal was to identify where the same user need — narrow a set of results — was being solved in different ways.",
        "I mapped instances of filter chips, sort controls, active state patterns, and empty states across flows. What emerged was a pattern familiar from design system work generally: the inconsistencies weren't random. They followed the shape of how the product had been built — sprint by sprint, team by team, with each local solution making sense at the time it was made.",
        "The audit made the problem concrete. We weren't just managing a UI. We were managing a set of undocumented decisions that had accreted into something no one had chosen.",
      ],
    },
    {
      label: "INVESTIGATION",
      heading: "Studying Mature Systems",
      paragraphs: [
        "One pattern that appears consistently across well-designed filtering systems is the deliberate prioritisation of a small number of high-signal filters upfront — the criteria that resolve the most uncertainty for the most users most of the time. In travel products, that tends to be price and departure time. In e-commerce, price and availability. In job search, location and work arrangement.",
        "This isn't a new idea. Airbnb's filter model surfaces a handful of controls immediately and puts everything else behind a single 'Filters' button. The result isn't less capability — it's capability staged to match how decisions actually unfold. The interface trusts that most users don't need all the options at once, and makes it easy to find more when they do.",
        "Brad Frost's atomic design framework offers a useful lens here. Its real insight isn't just structural — it's the reminder that reliable primitives are a prerequisite for consistent patterns. If the foundational components are ambiguous or inconsistent, every pattern built from them will carry that inconsistency forward. Nathan Curtis's work on design system governance adds another dimension: a filter chip that lives only in one product flow will diverge from one that lives in the system, and divergence is how fragmentation begins.",
      ],
    },
    {
      label: "KEY INSIGHTS",
      heading: "Key Insights",
      paragraphs: [
        "Most inconsistencies weren't intentional design choices. They were local solutions created under time pressure by people doing their best with what they had. Nobody set out to fragment the filtering experience. It accumulated quietly, one sprint at a time.",
        "What made this costly was compounding. A small variation in a filter chip component forced downstream differences in how sort controls had to be positioned, which in turn affected how empty states were laid out when no filtered results appeared.",
        "To make this concrete: the filter chip existed in four variations across the product. Two used an icon-left layout; two used text-only. Because the booking flow used a different variant than the search flow, sort controls above each had to be positioned differently to maintain visual alignment. When no results appeared, the empty state in each flow therefore sat at a different vertical position — an inconsistency that users would feel as a subtle wrongness without being able to name it. Four components, one root cause.",
        "The cost showed up in two places simultaneously. Users had to relearn patterns that should have felt familiar. Teams had to rebuild or reinterpret the same UI decisions, often unaware that a prior solution already existed somewhere in the design files.",
      ],
    },
    {
      label: "DESIGN STRATEGY",
      heading: "Design Strategy",
      paragraphs: [
        "These insights pointed toward a clear shift in approach. Rather than redesigning individual filter components, the effort needed to move upstream — toward a shared model for what filtering should do and how its components should behave across the product.",
        "The strategy had four parts: establish core filtering primitives that could work across all flows without modification; define interaction patterns, not just visual styles; reduce the number of valid variations to a set flexible enough to handle real edge cases without requiring new components; and align every design decision with how engineering would actually implement and reuse the system.",
        "Less pixel perfection. More decision clarity. The goal was a filtering system that a designer or engineer could reach into and find exactly what they needed — already made, already documented, already tested.",
      ],
      embedSrc: "/demos/case-study-visuals/filters-after.html",
      embedAlt: "After: progressive disclosure — three high-priority filters visible, rest accessible via More Filters",
      embedAspect: "3/2",
    },
    {
      label: "SYSTEM DESIGN",
      heading: "Three-Level Architecture",
      paragraphs: [
        "The filtering system was designed for reuse at three levels. At the foundation: atomic components — filter chips, dropdowns, toggle controls — the primitives that appear everywhere and need to behave identically across every context. Above those: filtering patterns — multi-select, range selection, contextual filter panels, sort controls — the combinations that appear across flows. Above those: composition rules — how filtering components relate to result counts, empty states, and loading states so that the overall behaviour is predictable regardless of where in the product it appears.",
        "The value of this architecture is that decisions made at the atomic level propagate upward reliably. Define the filter chip's active state once, clearly, with documented behaviour for keyboard and pointer interactions — and every pattern that uses it inherits that definition without requiring additional decisions downstream.",
      ],
    },
    {
      label: "SYSTEM DESIGN",
      heading: "Filtering as a Reusable Interaction Pattern",
      paragraphs: [
        "One of the more important system design decisions was treating filtering not as a bespoke solution for each screen or dataset, but as a reusable interaction pattern with a consistent contract across the product. Whether a user was filtering a list of bookings, a set of search results, or a data table in the internal tooling, the core behaviours — how filters are applied, how active states are indicated, how results respond, how filters are cleared — would feel the same.",
        "This matters for two reasons. First, it reduces relearning. When filtering behaves consistently across contexts, users build a mental model once and apply it everywhere. Second, it reduces build cost. When engineering can reach for a shared filtering pattern instead of interpreting a new spec, the design decisions have already been made. The implementation work narrows to configuration, not reinvention.",
        "The risk of not taking this approach is visible in products that have grown without it. Filtering in the search flow works one way. Filtering in the dashboard works another. Each individually defensible, but collectively requiring users to relearn the same basic action in different dialects.",
      ],
    },
    {
      label: "SYSTEM DESIGN",
      heading: "Governance: The Part That Prevents Drift",
      paragraphs: [
        "The most valuable output of this work wasn't the components themselves. It was the documentation layer: shared definitions, usage examples, and explicit guidance on when to use each component versus when to build something new.",
        "For filtering, that meant documenting not just how the components look, but what they're for — the user need each pattern addresses, the contexts it's appropriate in, and the questions to ask when deciding whether a new filter type is warranted or whether an existing one can be extended.",
        "Accessibility considerations shaped a number of system decisions, and not just for compliance reasons. Inconsistency in component behaviour is a usability barrier. For filtering interfaces specifically, this meant paying close attention to active state contrast, focus ring behaviour across filter chips and dropdowns, clear error and empty state messaging. An accessible filter chip is also a more usable filter chip.",
      ],
    },
    {
      label: "COLLABORATION",
      heading: "Collaboration",
      paragraphs: [
        "This kind of work only holds if it is shared. A filter system that lives only in Figma isn't a system — it's a reference document that will quietly fall out of date the moment the next sprint begins.",
        "Working closely with engineering throughout — not just at handoff — meant agreeing on which filter components were system-level and which were feature-specific, and deciding where flexibility was genuinely worth the complexity versus where standardisation mattered more. Real upcoming features became live test cases: if an engineer could reach for an existing, well-defined filter pattern instead of building something from scratch, the system was earning its place.",
      ],
    },
    {
      label: "OUTCOMES",
      heading: "Outcome & Expected Impact",
      paragraphs: [
        "The outcome wasn't a single redesign. It was a more scalable foundation — a shared language for how filtering should work, and why.",
        "Concretely: duplicated filter components were consolidated into a smaller set of flexible, well-defined building blocks. Interaction patterns for multi-select filtering, range selection, sort integration, and empty states were defined so that users would encounter predictable behaviour across flows. Component states and usage guidance were documented so that design intent wouldn't be lost between Figma and code.",
        "Without formal metrics in place at the start of this project, quantifying the impact precisely isn't possible. What can be said is that the expected direction of change was clear: fewer decisions being made repeatedly from scratch, fewer inconsistencies accumulating quietly across flows, easier onboarding for new team members, and more confidence when scaling because the foundation was designed to hold.",
      ],
    },
    {
      label: "REFLECTION",
      heading: "Reflection",
      paragraphs: [
        "The most useful shift on this project was recognising that filtering inconsistency is rarely the root problem. It's a symptom — of missing structure, of undocumented decisions, of patterns that grew faster than the rules that were supposed to govern them.",
        "Filtering interfaces, when done well, are not a visual design exercise. They are a cognitive scaffolding exercise. They make complex information spaces navigable by giving users a structured way to reduce scope without requiring them to hold the entire problem in their heads.",
        "Design systems are the organisational tool that makes this possible at scale. They reduce the cognitive overhead of repeated decision-making for the teams building the product — which is, ultimately, the same thing good filtering does for the people using it. The parallel is not coincidental. Both are about designing for human decision-making under real cognitive constraints: finite attention, incomplete information, and goals that matter.",
        "Good filtering doesn't expose everything a dataset contains. It reveals what a user needs to decide. That distinction — between interface as data pipe and interface as decision support — is where the real design work begins.",
      ],
    },
  ],
};

export default study;
