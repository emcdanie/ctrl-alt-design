export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface CaseStudyMetrics {
  role: string;
  team?: string;
  timeline: string;
  scope: string;
}

export interface NarrativeSection {
  label?: string;
  heading: string;
  paragraphs: string[];
}

export interface CaseStudy {
  slug: string;
  href?: string;
  title: string;
  category: string;
  year: string;
  scope: string;
  timeline: string;
  liveUrl?: string;
  heroImage: string;
  heroVideo?: string;
  metrics?: CaseStudyMetrics;
  overview: {
    headline: string;
    body: string;
  };
  images: string[];
  problem: {
    title: string;
    body: string;
  };
  process: {
    title: string;
    steps: ProcessStep[];
  };
  outcomes: {
    title: string;
    body: string;
    completionTag: string;
  };
  fullWidthImage?: string;
  tags: string[];
  description: string;
  narrative?: NarrativeSection[];
  clientLogo?: string;
  clientName?: string;
  demoLinks?: { label: string; href: string }[];
}

const caseStudies: CaseStudy[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. FROM DRIFT TO FOUNDATION
  // ─────────────────────────────────────────────────────────────────
  {
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
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. DESIGNING OPERATIONAL CLARITY
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "un-operational-dashboard",
    title: "Designing Operational Clarity",
    category: "DATA VIZ",
    year: "2025",
    scope: "Information Architecture, Role-Based UX, Enterprise Platform Design",
    timeline: "3 months",
    liveUrl: "",
    heroImage: "/images/thumbnails/FormularOne.png",
    heroVideo: "/videos/prism.mp4",
    metrics: {
      role: "Product Designer — Contract",
      team: "UNOG ICTS stakeholders",
      timeline: "3 months",
      scope: "Information architecture, dashboard design, interactive prototype",
    },
    overview: {
      headline:
        "A unified ICT platform concept for a complex international organisation — built around visibility, dependency awareness, and role-based clarity.",
      body: "Large organisations running complex ICT infrastructure face a particular kind of invisible problem. The tools exist. The data exists. The teams are capable. But the information is scattered across monitoring platforms, ticketing systems, and spreadsheets in ways that make it genuinely difficult to answer basic operational questions reliably. The challenge wasn't a lack of data — it was that the data lived in silos, was inconsistently defined across teams, and couldn't be brought together without significant manual effort.",
    },
    images: [],
    problem: {
      title: "Operationally Capable, Informationally Opaque",
      body: "At the surface level, the problem looked like a dashboard problem. But the deeper issue was structural. Services, infrastructure assets, and operational workflows existed in separate systems with no consistent data model connecting them. Ownership of infrastructure assets was unclear, slowing incident response. Reporting was inconsistent across teams, reducing trust in the numbers. Without visibility into dependencies between assets and services, change impact analysis required significant manual effort.",
    },
    process: {
      title: "How It Came Together",
      steps: [
        {
          number: "01",
          title: "Cross-Functional Discovery",
          description:
            "Conducted stakeholder conversations across infrastructure, service delivery, operations leadership, and finance — looking for the connective tissue where the same pain appeared under different labels across teams.",
        },
        {
          number: "02",
          title: "System Entity Mapping",
          description:
            "Mapped core entities — services, infrastructure assets, incidents, SLAs, consumption data — and the relationships between them. Understanding which relationships mattered most for operational decisions was a prerequisite for designing anything useful.",
        },
        {
          number: "03",
          title: "Role-Based IA & Progressive Disclosure",
          description:
            "Structured the platform around four connected layers: a global operational dashboard, role-based dashboards, a service and asset explorer, and reporting views — designed to feel like one product, not a collection of dashboards.",
        },
        {
          number: "04",
          title: "Interactive Prototype",
          description:
            "Built a high-fidelity interactive prototype so stakeholders could follow real paths — from a service health alert through to the specific asset context behind it — surfacing questions that wouldn't emerge from a presentation.",
        },
      ],
    },
    outcomes: {
      title: "A Shared Reference Point",
      body: "The prototype functioned as a vision artifact: a concrete, interactive expression of what a unified operational platform could look like, and why the underlying architecture mattered. Stakeholders who had been working in parallel — solving the same problems with different tools and different definitions — had a common reference point for the first time. The most valuable outcome wasn't any individual screen. It was the shared understanding the prototype created.",
      completionTag: "CONTRACT COMPLETE · 2025",
    },
    tags: ["Figma", "Data Visualisation", "Enterprise UX", "UNOG ICTS"],
    clientLogo: "/images/logos/united_nations_office_at_geneva_logo.jpeg",
    clientName: "United Nations",
    demoLinks: [
      { label: "Grand Prix Dashboard prototype", href: "/demos/grandprix-dashboard.html" },
    ],
    description:
      "A Unified ICT Platform Concept for a Complex International Organization",
    narrative: [
      {
        label: "CONTEXT",
        heading: "Project Context",
        paragraphs: [
          "Large organisations running complex ICT infrastructure face a particular kind of invisible problem. The tools exist. The data exists. The teams are capable. But the information is scattered across monitoring platforms, ticketing systems, and spreadsheets in ways that make it genuinely difficult to answer basic operational questions reliably.",
          "At the United Nations Office at Geneva, the ICT department managed a significant infrastructure estate: servers, network assets, services, and the teams responsible for their operation. The existing tooling was siloed. Each team had its own system and its own view of the operational picture — but there was no single place where those views converged.",
          "The engagement was a contract to design a high-fidelity prototype for a unified operational platform — something that would make the vision concrete enough for senior stakeholders to evaluate, challenge, and ultimately decide whether to build.",
        ],
      },
      {
        label: "ROLE",
        heading: "My Role",
        paragraphs: [
          "I was responsible for the full design process: stakeholder discovery, information architecture, interaction design, and the delivery of a high-fidelity, interactive prototype in Figma.",
          "Working directly with the ICTS team, I translated operational workflows and technical constraints into a platform design that non-technical stakeholders could navigate and evaluate. The goal was not to design a system in the abstract — it was to make the value of the architectural decisions legible through the design itself.",
        ],
      },
      {
        label: "THE PROBLEM",
        heading: "Operationally Capable, Informationally Opaque",
        paragraphs: [
          "At the surface level, the problem looked like a dashboard problem. A team that can't see what it needs must need a better dashboard. But the deeper issue was structural.",
          "Services, infrastructure assets, and operational workflows existed in separate systems with no consistent data model connecting them. Ownership of infrastructure assets was unclear, slowing incident response. Reporting was inconsistent across teams, reducing trust in the numbers and leading to duplicated reconciliation efforts. And without visibility into dependencies between assets and services, change impact analysis required significant manual effort — someone had to hold the dependency map in their head, or piece it together from multiple sources before making a call.",
          "The fragmentation wasn't a tooling failure — it was an architectural one. The fix wasn't a prettier dashboard. It was a platform that modelled the relationships correctly and surfaced them in a way that matched how operational decisions are actually made.",
        ],
      },
      {
        label: "INVESTIGATION",
        heading: "Cross-Functional Discovery",
        paragraphs: [
          "The discovery phase involved structured conversations with stakeholders across infrastructure engineering, service delivery, operations management, and finance. The goal was not just to collect pain points, but to find the connective tissue — the moments where the same underlying problem surfaced in different language across different teams.",
          "A recurring theme emerged: people were answering the same questions repeatedly, using different tools, arriving at slightly different answers, and spending time reconciling the discrepancy rather than acting on the information. The platform needed to make the authoritative answer easy to find, not easier to argue about.",
          "This research also shaped the role-based framing. Different stakeholders needed different entry points to the same underlying data. An operations engineer managing an incident needed a very different view from a department head reviewing service delivery performance against SLAs. A platform that presented both audiences with the same interface would serve neither well.",
        ],
      },
      {
        label: "INFORMATION ARCHITECTURE",
        heading: "System Entity Mapping & IA",
        paragraphs: [
          "Before designing any screens, I mapped the core entities in the operational domain and the relationships between them: services, infrastructure assets, incidents, SLAs, capacity and consumption data, and the people and teams responsible for each. Understanding which relationships mattered most for operational decisions was the prerequisite for designing anything useful.",
          "From this mapping, I structured the platform around four connected layers. A global operational dashboard gave leadership a real-time overview of service health, incident status, and key operational indicators. Role-based dashboards provided each team with a view calibrated to their responsibilities. A service and asset explorer allowed users to navigate the dependency graph — to follow a service through to the infrastructure assets underlying it, and to understand the blast radius of a change or failure. And a set of reporting views supported the recurring management and compliance reporting tasks that currently required manual data assembly.",
          "The architecture was designed to feel like one product, not four disconnected tools bolted together. Navigation between layers was intentional — a status indicator on the global dashboard could drill down to a service detail, which could continue to the specific asset involved in an incident.",
        ],
      },
      {
        label: "DESIGN",
        heading: "Interactive Prototype",
        paragraphs: [
          "The deliverable was a high-fidelity, interactive prototype built in Figma. The brief called for something that stakeholders could actually navigate — not a static deck of screens, but a working prototype that would let them follow real operational paths and encounter the decisions the design had made on their behalf.",
          "That constraint shaped how the design was built. Rather than optimising for visual polish, I prioritised navigability and the integrity of the information architecture. Every screen needed to answer the question: what would a user do next, and does the platform make that obvious?",
          "The prototype was used in stakeholder presentations to walk leadership through scenarios: a service degradation alert, the path to identifying the affected asset, the steps to assess impact and initiate a change request. Watching stakeholders navigate those paths surfaced questions that no amount of documentation could have anticipated — which is precisely what the prototype was for.",
        ],
      },
      {
        label: "OUTCOMES",
        heading: "A Shared Reference Point",
        paragraphs: [
          "The prototype functioned as a vision artifact: a concrete, interactive expression of what a unified operational platform could look like, and why the underlying data architecture mattered to achieve it.",
          "Stakeholders who had been working in parallel — solving the same problems with different tools and different definitions — had a common reference point for the first time. The platform design made the case for data unification more effectively than a presentation could, because it showed what became possible once that unification was in place.",
          "The most valuable outcome wasn't any individual screen. It was the shared understanding the prototype created. Alignment on what a problem looks like — and what solving it would require — is often the hardest part of enterprise platform work, and it's rarely achieved through documents alone.",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. FILTERS ARE A DECISION-SUPPORT SYSTEM
  // ─────────────────────────────────────────────────────────────────
  {
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
      body: "Most products treat filters as a feature. A set of checkboxes, a dropdown, maybe a few chips along the top of a results list. What they rarely are, by design, is a decision-support system — a structured way to help users narrow a large problem space toward something meaningful. This case study explores the intersection of filtering interface design, design system thinking, and cognitive load. It draws on a complex SaaS platform context where multiple booking flows and internal tooling were evolving in parallel, and where filtering had accumulated into something fragmented and inconsistent across the product.",
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
          "Most products treat filters as a feature. A set of checkboxes, a dropdown, maybe a few chips along the top of a results list. Something to hand off once the interaction model is roughly in place.",
          "What they rarely are, by design, is a decision-support system — a structured way to help users narrow a large problem space toward something meaningful. That distinction matters more than it might appear.",
          "This case study explores the intersection of filtering interface design, design system thinking, and cognitive load. It draws on a complex SaaS platform context where multiple booking flows and internal tooling were evolving in parallel, and where filtering had accumulated into something fragmented and inconsistent across the product.",
          "The business goals were straightforward: help users find what they need faster, reduce support overhead from user confusion, and create a filtering pattern that could scale as the product grew. What became clear, quickly, was that the visible interface problems were symptoms of a deeper structural issue.",
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
  },
  // ─────────────────────────────────────────────────────────────────
  // 4. BRAD FROST — CODE FIRST
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "brad-frost",
    href: "/case-studies/brad-frost",
    title: "Code First",
    category: "DESIGN SYSTEMS",
    year: "2024–2025",
    scope: "Component Architecture, Token Alignment, Figma–Storybook Integration",
    timeline: "Oct 2024 – Jan 2025",
    heroImage: "/images/thumbnails/BradFrostCommandCenter.png",
    heroVideo: "/videos/eddie.mp4",
    metrics: {
      role: "Design System Collaborator",
      team: "Brad Frost Web Maker Program",
      timeline: "Oct 2024 – Jan 2025",
      scope: "Component Architecture, Token Alignment, Figma–Storybook Integration, MCP",
    },
    overview: {
      headline: "Building Brad Frost's component system in reverse — code-first, token-aligned, AI-assisted.",
      body: "Working as part of Brad Frost's Maker Program, I joined a project where the code already existed. The challenge was to understand an existing system deeply enough to contribute meaningfully at the component and token level, bring Figma into alignment with code reality, and use AI tooling to close the loop between the two.",
    },
    images: [],
    problem: {
      title: "Starting From Code",
      body: "Most design system work starts in Figma. This project inverted that entirely. Every decision had to be justified against an existing, principled structure rather than invented from first principles — which turned out to be enormously useful.",
    },
    process: {
      title: "Component Archaeology",
      steps: [
        {
          number: "01",
          title: "System Investigation",
          description: "Reading Storybook stories, tracing prop structures, and mapping how existing components composed.",
        },
        {
          number: "02",
          title: "Figma Alignment",
          description: "Rebuilding Figma components to match code counterparts — matching variant names to prop names, ensuring token consistency.",
        },
        {
          number: "03",
          title: "AI-Assisted Investigation",
          description: "Using Claude via MCP to surface token relationships and accelerate structural investigation.",
        },
      ],
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
  },
];

export default caseStudies;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getAdjacentStudies(slug: string): {
  prev: CaseStudy | null;
  next: CaseStudy | null;
} {
  const index = caseStudies.findIndex((cs) => cs.slug === slug);
  return {
    prev: index > 0 ? caseStudies[index - 1] : null,
    next: index < caseStudies.length - 1 ? caseStudies[index + 1] : null,
  };
}
