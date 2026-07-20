import type { CaseStudy } from "@/lib/content";

/* Conformance (Pass E task 11, honest): an ESSAY, zero live decision
 * blocks (scaffold commented at the foot of this file); disclosure +
 * one summary present; no lessons block yet. The editorial reshaping
 * happens with Elleta in Cowork, then lands as content edits. */
const study: CaseStudy = {
  slug: "un-operational-dashboard",
  /* Statement headline (Elleta, 18 Jul, verbatim): the case THESIS is
   * the display headline; the case NAME (Operational Clarity) lives in
   * the library, sidebar, and breadcrumb surfaces. CSS sets it all-caps. */
  title: "Six operational domains. One interface. Eight weeks.",
  category: "DATA VIZ",
  year: "2025",
  scope: "Information Architecture, Role-Based UX, Enterprise Platform Design",
  timeline: "3 months",
  liveUrl: "",
  heroImage: "",
  metrics: {
    role: "Product Designer, Contract",
    team: "ICT division stakeholders",
    timeline: "3 months",
    scope: "Information architecture, dashboard design, interactive prototype",
  },
  overview: {
    headline:
      "A unified ICT platform concept for a complex international organisation, built around visibility, dependency awareness, and role-based clarity.",
    body: "Forty minutes into a critical incident, the operations engineer is still assembling context, monitoring in one tool, tickets in another, asset ownership in a spreadsheet last updated three months ago. At a UN agency in Geneva, the challenge wasn't missing data. It was that operational information lived in silos with no model connecting them. I designed a unified platform prototype that made the case for what becomes possible once that architecture exists.",
  },
  images: [],
  problem: {
    title: "Operationally Capable, Informationally Opaque",
    body: "At the surface level, the problem looked like a dashboard problem. But the deeper issue was structural. Services, infrastructure assets, and operational workflows existed in separate systems with no consistent data model connecting them. Ownership of infrastructure assets was unclear, slowing incident response. Reporting was inconsistent across teams, reducing trust in the numbers. Without visibility into dependencies between assets and services, change impact analysis required significant manual effort.",
  },
  outcomes: {
    title: "A Shared Reference Point",
    body: "The prototype functioned as a vision artifact: a concrete, interactive expression of what a unified operational platform could look like, and why the underlying architecture mattered. Stakeholders who had been working in parallel, solving the same problems with different tools and different definitions, had a common reference point for the first time. The most valuable outcome wasn't any individual screen. It was the shared understanding the prototype created.",
    completionTag: "CONTRACT COMPLETE · 2025",
  },
  tags: ["Figma", "Data Visualisation", "Enterprise UX", "Public Sector"],
  clientName: "A UN agency",
  demoLinks: [
    { label: "Grand Prix Dashboard prototype", href: "/demos/grandprix-dashboard.html" },
  ],
  description:
    "A Unified ICT Platform Concept for a Complex International Organization",
  blocks: [
    /* TODO(elleta): confirm the disclosure wording (pattern from the
       17 Jul brief; industry-not-client, recreated artifacts,
       illustrative data, no metrics) */
    {
      kind: "disclosure",
      text: "This work is under strict NDA. Client specifics are withheld; the role, the process, and the decisions follow. Artifacts shown are recreated, data is illustrative, and the client appears as an industry descriptor only.",
    },
    {
      kind: "summary",
      context:
        "An operations engineer at a UN agency in Geneva gets an alert: a critical service is degrading. She opens the monitoring dashboard, but it only shows infrastructure health, not which services depend on the affected asset. She switches to the ticketing system to check recent incidents, different tool, different login, different data model. She opens a spreadsheet to find the asset owner, last updated three months ago. Forty minutes into the incident, she's still assembling context that should have been available in the first ten seconds.",
      approach:
        "The fragmentation wasn't a tooling failure, it was an architectural one. The fix wasn't a prettier dashboard. It was a platform that modelled the relationships correctly and surfaced them in a way that matched how operational decisions are actually made.",
      outcome:
        "The most valuable outcome wasn't any individual screen. It was the shared understanding the prototype created. Alignment on what a problem looks like, and what solving it would require, is often the hardest part of enterprise platform work, and it's rarely achieved through documents alone.",
    },
    /* TODO(elleta): decision blocks, your words (see the scaffold
       comment below). Sections carry the existing prose verbatim. */
    {
      kind: "section",
      eyebrow: "BACKGROUND",
      heading: "Project Context",
      children: [
        { kind: "paragraph", text: "This wasn't a tooling failure. The tools existed. The data existed. The teams were capable. But the information lived in silos, monitoring platforms, ticketing systems, spreadsheets, with no consistent model connecting them. Answering a basic operational question like 'what depends on this server?' required manual assembly from multiple sources, every single time." },
        { kind: "paragraph", text: "The engagement was a contract to design a high-fidelity prototype for a unified operational platform, something concrete enough for senior stakeholders to evaluate, challenge, and decide whether to build. Not a dashboard mockup. A working vision of what operational clarity could actually look like." },
      ],
    },
    {
      kind: "section",
      eyebrow: "ENGAGEMENT",
      heading: "My Role",
      children: [
        { kind: "paragraph", text: "I was responsible for the full design process: stakeholder discovery, information architecture, interaction design, and the delivery of a high-fidelity, interactive prototype in Figma." },
        { kind: "paragraph", text: "Working directly with the ICT division, I translated operational workflows and technical constraints into a platform design that non-technical stakeholders could navigate and evaluate. The goal was not to design a system in the abstract, it was to make the value of the architectural decisions legible through the design itself." },
      ],
    },
    {
      kind: "section",
      eyebrow: "THE PROBLEM",
      heading: "Operationally Capable, Informationally Opaque",
      children: [
        { kind: "paragraph", text: "At the surface level, the problem looked like a dashboard problem. A team that can't see what it needs must need a better dashboard. But the deeper issue was structural." },
        { kind: "paragraph", text: "Services, infrastructure assets, and operational workflows existed in separate systems with no consistent data model connecting them. Ownership of infrastructure assets was unclear, slowing incident response. Reporting was inconsistent across teams, reducing trust in the numbers and leading to duplicated reconciliation efforts. And without visibility into dependencies between assets and services, change impact analysis required significant manual effort, someone had to hold the dependency map in their head, or piece it together from multiple sources before making a call." },
      ],
    },
    {
      kind: "section",
      eyebrow: "INVESTIGATION",
      heading: "Cross-Functional Discovery",
      children: [
        { kind: "paragraph", text: "The discovery phase involved structured conversations with stakeholders across infrastructure engineering, service delivery, operations management, and finance. The goal was not just to collect pain points, but to find the connective tissue, the moments where the same underlying problem surfaced in different language across different teams." },
        { kind: "paragraph", text: "A recurring theme emerged: people were answering the same questions repeatedly, using different tools, arriving at slightly different answers, and spending time reconciling the discrepancy rather than acting on the information. The platform needed to make the authoritative answer easy to find, not easier to argue about." },
        { kind: "paragraph", text: "This research also shaped the role-based framing. Different stakeholders needed different entry points to the same underlying data. An operations engineer managing an incident needed a very different view from a department head reviewing service delivery performance against SLAs. A platform that presented both audiences with the same interface would serve neither well." },
      ],
    },
    {
      kind: "section",
      eyebrow: "INFORMATION ARCHITECTURE",
      heading: "System Entity Mapping & IA",
      children: [
        { kind: "paragraph", text: "Before designing any screens, I mapped the core entities in the operational domain and the relationships between them: services, infrastructure assets, incidents, SLAs, capacity and consumption data, and the people and teams responsible for each. Understanding which relationships mattered most for operational decisions was the prerequisite for designing anything useful." },
        { kind: "paragraph", text: "From this mapping, I structured the platform around four connected layers. A global operational dashboard gave leadership a real-time overview of service health, incident status, and key operational indicators. Role-based dashboards provided each team with a view calibrated to their responsibilities. A service and asset explorer allowed users to navigate the dependency graph, to follow a service through to the infrastructure assets underlying it, and to understand the blast radius of a change or failure. And a set of reporting views supported the recurring management and compliance reporting tasks that currently required manual data assembly." },
        { kind: "paragraph", text: "The architecture was designed to feel like one product, not four disconnected tools bolted together. Navigation between layers was intentional, a status indicator on the global dashboard could drill down to a service detail, which could continue to the specific asset involved in an incident." },
      ],
    },
    {
      kind: "section",
      eyebrow: "DESIGN",
      heading: "Interactive Prototype",
      children: [
        { kind: "paragraph", text: "The deliverable was a high-fidelity, interactive prototype built in Figma. The brief called for something that stakeholders could actually navigate, not a static deck of screens, but a working prototype that would let them follow real operational paths and encounter the decisions the design had made on their behalf." },
        { kind: "paragraph", text: "That constraint shaped how the design was built. Rather than optimising for visual polish, I prioritised navigability and the integrity of the information architecture. Every screen needed to answer the question: what would a user do next, and does the platform make that obvious?" },
        { kind: "paragraph", text: "The prototype was used in stakeholder presentations to walk leadership through scenarios: a service degradation alert, the path to identifying the affected asset, the steps to assess impact and initiate a change request. Watching stakeholders navigate those paths surfaced questions that no amount of documentation could have anticipated, which is precisely what the prototype was for." },
        { kind: "prototype", src: "/demos/grandprix-dashboard.html", title: "Recreated, abstracted dashboard prototype, structure and interaction patterns only, no real data or screens", designWidth: 1280, designHeight: 1193, poster: "/images/case-studies/grandprix-dashboard-poster.png", posterAlt: "Recreated operational dashboard: service health tiles, incident feed, dependency indicators, and role-based analytics panels with illustrative data" },
      ],
    },
    {
      kind: "section",
      eyebrow: "RESULTS",
      heading: "A Shared Reference Point",
      children: [
        { kind: "paragraph", text: "The prototype functioned as a vision artifact: a concrete, interactive expression of what a unified operational platform could look like, and why the underlying data architecture mattered to achieve it." },
        { kind: "paragraph", text: "Stakeholders who had been working in parallel, solving the same problems with different tools and different definitions, had a common reference point for the first time. The platform design made the case for data unification more effectively than a presentation could, because it showed what became possible once that unification was in place." },
      ],
    },
    /* TODO(elleta): a lessons block ("What this changed") is absent;
       the template renders it when your words land. */
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
