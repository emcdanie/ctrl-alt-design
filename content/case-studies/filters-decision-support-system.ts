import type { CaseStudy } from "@/lib/content";

const study: CaseStudy = {
  slug: "filters-decision-support-system",
  /* Statement headline (Elleta, 18 Jul, verbatim): the case THESIS is
   * the display headline; the case NAME (Travel Booking) lives in the
   * library, sidebar, and breadcrumb surfaces. CSS sets it all-caps.
   * The former problem.title carried the same phrase and is deleted:
   * the phrase renders exactly once, as this headline. */
  title: "Capability without clarity is just a different kind of friction.",
  category: "UX STRATEGY",
  year: "2024-2025",
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
      "Rethinking how filtering interfaces shape user cognition, and why fixing them requires system thinking, not just visual cleanup.",
    body: "Nine filter controls, all at equal visual weight, with no sense of which ones matter for the decision at hand. On a B2B travel platform, filtering had been designed as data exposure, not decision support. This case study explores what happened when we reframed filtering as a cognitive scaffolding problem, and built a system architecture to match.",
  },
  images: [],
  outcomes: {
    title: "A Shared Language, Not Just Better Components",
    body: "Duplicated filter components consolidated into a smaller set of flexible, well-defined building blocks. Interaction patterns for multi-select filtering, range selection, sort integration, and empty states defined so that users encounter predictable behaviour across flows. The most important outcome was structural: a reusable filtering interaction pattern with a consistent contract across the product.",
    completionTag: "PROJECT COMPLETE · 2025",
  },
  tags: ["Figma", "Interaction Design", "Cognitive UX", "Search UX", "B2B Travel"],
  clientName: "B2B Travel",
  demoLinks: [
    { label: "Search prototype (recreated)", href: "/demos/travel-search.html" },
    { label: "Filter demo (recreated)", href: "/demos/travel-filter-demo.html" },
    { label: "ctrl+travel v2", href: "/demos/ctrl-travel-v2.html" },
  ],
  description:
    "Designing decision support for a multi-vertical B2B travel platform.",
  /* ── The ONE render path — decision-led blocks (restructured per the
   * 20 Jul approved mapping, CHIP as the structural reference; every
   * paragraph moved verbatim) ── */
  summary:
    "Designing a decision-support system for complex B2B travel booking, where search, filtering, and results operate as one integrated flow rather than three separate features.",
  blocks: [
    {
      kind: "summary",
      context:
        "The product is a B2B travel management platform used by companies across Europe to book and manage business travel. When I joined, it had scaled quickly, flights, car rentals, hotels, trains, but each vertical had developed its own approach to search, filtering, and results presentation. There was no shared vocabulary for how a user should move from intent to decision.",
      approach:
        "Search and filtering as one flow. The AI search input, filter strip, preset buttons, and sort controls are not separate features, they are different entry points into the same narrowing operation. The user can start with any of them and the system responds coherently.",
      outcome:
        "Structured comparison. The compare function generates an AI-enabled side-by-side analysis with pros, cons, and a recommendation. This supports the final stage of the decision: not just finding options, but choosing between them with confidence.",
    },
    {
      kind: "section",
      eyebrow: "INTRODUCTION",
      heading: "The Problem Wasn't the Controls",
      children: [
        { kind: "paragraph", text: "A travel manager in Munich types \"London Monday morning refundable\" into the search bar and hits enter. She gets 47 results. She starts filtering: price range, departure window, number of stops. Each control works. Each result updates. But ten minutes later she's still scrolling, still adjusting, still unsure whether the flight she's looking at is the best option or just the one she happened to land on. The interface gave her capability. What it didn't give her was a path to a decision." },
        { kind: "paragraph", text: "That was the real problem. On a B2B travel platform managing flights, hotels, rail, and car rentals across multiple booking verticals, search, filters, and results had been designed as three separate features, built at different times, by different teams, with different assumptions about user intent. But users experienced them as a single decision flow: start with intent, narrow the options, compare trade-offs, choose. The interface did not reflect that experience." },
        { kind: "paragraph", text: "Users needed to explore many options quickly, understand pricing constraints, see company policy restrictions, and compare travel combinations, often across verticals in a single booking session. The fragmentation was not just a visual problem. It was a cognitive one. Every time a user moved between verticals, they had to relearn how to find what they needed." },
      ],
    },
    {
      kind: "section",
      eyebrow: "THE DECISION PROBLEM",
      heading: "Capability Without Clarity",
      children: [
        { kind: "paragraph", text: "Consider a user who wants to find a reasonably priced flight arriving before noon. A typical filter panel for this task might expose simultaneously: price range, outbound departure time, return departure time, number of stops, airline, layover duration, baggage allowance, refundability, and booking class." },
        /* Pull quote deleted (18 Jul rule): promoted to the display
           headline; a promoted quote never also renders as a pull quote. */
        { kind: "paragraph", text: "The problem was not that the controls were broken. The problem was that they had been designed as isolated data-exposure mechanisms rather than as parts of a decision flow. There was no progressive structure to the exploration. No prioritisation of what mattered first. No feedback loop between what the user had done and what remained possible. Filtering was a feature. It needed to become a system." },
      ],
    },
    { kind: "embed", src: "/demos/case-study-visuals/filters-before.html", title: "Before: nine filter controls at equal visual weight", aspect: "3/2", minHeight: 360, frame: "light" },
    {
      kind: "decision",
      index: "01",
      title: "Search and filtering as one flow",
      why: "The user stays in one mental model throughout: expressing intent, seeing interpretation, refining constraints, evaluating options.",
      evidence: { kind: "demoStep", index: "01 · Early Exploration", description: "Initial search interface patterns, testing how users approach travel queries and understanding baseline interaction models.", href: "/demos/travel-search.html", linkLabel: "Search Prototype (recreated)" },
      children: [
        { kind: "paragraph", text: "In most travel interfaces, the search bar and the filter panel are visually and functionally separate. The user types a destination, hits search, and then switches cognitive modes to operate a completely different set of controls. The redesign treats search as the opening act of the same decision flow that filters continue." },
        { kind: "paragraph", text: "The prototype explores a natural-language search input that parses user intent into structured parameters. A query like “business class London Monday refundable” becomes visible, editable filter chips, making the system's interpretation transparent and correctable." },
        { kind: "paragraph", text: "Progressive filtering means that users begin with a broad view and narrow gradually, rather than being asked to specify all criteria upfront. This aligns with how people actually make travel decisions: they start with a rough sense of what they need and refine as they see what is available." },
        { kind: "paragraph", text: "The prototype supports this through layered entry points. The AI search input accepts vague intent. Preset filter buttons offer common constraint packages with a single click. Individual faceted filters allow granular control. And the compare function lets users hold two or three options side by side once they have narrowed sufficiently. Each layer is available, but none is required, the user decides how deep to go based on the complexity of their decision." },
      ],
    },
    {
      kind: "decision",
      index: "02",
      title: "Policy as a visible dimension",
      why: "Treating policy not as a blocker that appears at checkout but as a visible dimension of every result.",
      evidence: { kind: "embed", src: "/demos/case-study-visuals/filters-after.html", title: "After: progressive disclosure with prioritised filters", aspect: "3/2", minHeight: 360, frame: "light" },
      children: [
        { kind: "paragraph", text: "Faceted filtering, the ability to narrow results along multiple independent dimensions simultaneously, is well-established in e-commerce but underused in complex enterprise products. The challenge is not implementing it. The challenge is deciding which facets matter, in what order, and how they interact." },
        { kind: "paragraph", text: "For travel booking, the most decision-relevant facets are price, departure time, number of stops, airline, and class. But there is a second layer that enterprise travel adds: policy compliance. A flight might be the cheapest option and still be wrong if it exceeds the company's travel policy. The faceted model here layers business constraints alongside personal preference, treating policy not as a blocker that appears at checkout but as a visible dimension of every result." },
        { kind: "paragraph", text: "**Policy as a visible dimension.** Travel policy compliance appears on every result card, green for within policy, amber for near limit. This turns an institutional constraint into a scannable attribute, not a surprise rejection at checkout." },
      ],
    },
    {
      kind: "decision",
      index: "03",
      title: "Making it safe to experiment",
      why: "The cost of reversing any decision is visibly low.",
      evidence: { kind: "demoStep", index: "02 · Filter Interaction Experiments", description: "Exploring faceted filtering mechanics, how constraints combine, how state is communicated, and how users recover from over-filtering.", href: "/demos/travel-filter-demo.html", linkLabel: "Filter Demo (recreated)" },
      children: [
        { kind: "paragraph", text: "One of the most common failures in filtering interfaces is invisible state. The user applies three filters, sees 12 results, and cannot quickly answer: which filters are active? How many results existed before? What happens if I remove one? This uncertainty makes exploration feel risky rather than fluid." },
        { kind: "paragraph", text: "The redesign makes filter state continuously visible through several mechanisms: active filters change visual state immediately, a persistent result count updates in real time, preset filter combinations (Direct, Within Policy, Cheapest, Business) provide common starting points, and individual filter values can be cleared independently or all at once. The goal is to make the user feel safe experimenting, because the cost of reversing any decision is visibly low." },
        { kind: "paragraph", text: "A well-designed filtering system should feel like a conversation, not a commitment. Every constraint the user applies should be easy to see, easy to modify, and easy to undo. This is what Vitaly Friedman describes as reversible exploration, the principle that users engage more confidently with complex systems when they know they can always step back." },
        { kind: "paragraph", text: "In the prototype, this manifests as instant feedback on every interaction. Toggling a filter immediately updates the result count and the visible results. Clearing all filters resets to the full set. The compare function allows adding and removing flights without losing the broader search context. There is no dead-end state where the user has to start over. The system remembers where they were and makes it easy to adjust course." },
      ],
    },
    {
      kind: "section",
      eyebrow: "PROTOTYPE JOURNEY",
      heading: "From Exploration to Decision System",
      children: [
        { kind: "paragraph", text: "These prototypes trace the evolution of the search and filtering system, from early pattern exploration through to the final integrated decision flow." },
        /* demoSteps 01 and 02 moved into decisions 01 and 03 as evidence
           (decision placement wins; the same demo never renders twice). */
        { kind: "demoStep", index: "03 · Final Decision System", description: "The complete integrated prototype, search, filtering, comparison, and booking operating as one unified decision flow with AI-enabled search and policy awareness." },
        { kind: "prototype", src: "/demos/ctrl-travel-v2.html", title: "ctrl+travel, Search & Filtering System", height: "700px", poster: "/images/case-studies/ctrl-travel-v2-poster.png", posterAlt: "ctrl+travel prototype: a natural-language search bar with preset filter chips (Direct to Frankfurt, Business class London, Cheapest within policy), a faceted filter row for stops, price, airline, departure, class, and policy, and flight results showing prices, durations, and within-policy badges" },
        { kind: "paragraph", text: "**Progressive booking.** Selecting a flight opens a booking panel with pre-filled traveller details, a seat map with preference memory, and a price breakdown, reducing the transition from decision to action." },
      ],
    },
    {
      kind: "lessons",
      text: "The system thinking behind this work, progressive disclosure, faceted filtering, visible state, reversible exploration, still holds. The patterns are sound. But the input model still assumes users know which parameters matter. The search input accepts natural language, but the underlying model is still translating intent into the system's vocabulary rather than the user's.",
    },
    {
      kind: "section",
      eyebrow: "REFLECTION",
      heading: "What I Would Do Next",
      children: [
        { kind: "paragraph", text: "If I were extending this today, I would invest in two areas. First, adaptive defaults: learning from booking patterns to pre-populate search with likely parameters, so the system starts closer to the answer for repeat travellers. Second, constraint negotiation: when no results match all criteria, rather than showing an empty state, surfacing which constraint could be relaxed to unlock the most options, and letting the user make that trade-off explicitly." },
        { kind: "paragraph", text: "The goal is not a smarter search bar. It is a system that understands the shape of the decision and meets the user where they are within it, whether that is a vague intent, a specific requirement, or a comparison between two close options. That is the gap between a good filtering interface and a genuine decision-support system." },
      ],
    },
  ],
};

export default study;
