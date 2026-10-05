/* The case rows (W1 release, 22 Sep 2026): the ONE data source for every
 * case listing. /work shows them all and Home the first three, both
 * through components/CaseRow.tsx. Part A of
 * bella/docs/reference/case-study-mock.html: a line thumbnail
 * (components/diagrams/workThumbs.ts, keyed by id), a Mono meta line, the
 * one-line claim and the signal tags the case is evidence for. Case
 * identity (colour, slug parity) stays on WORK_ITEMS in lib/workLibrary.ts. */
export interface CaseRowData {
  id: string;
  n: string;
  meta: string;
  lead?: string;
  title: string;
  claim: string;
  /** no href: the case isn't live yet, and `status` says so */
  href?: string;
  status?: string;
  tags: { text: string; tone?: "c2" | "c3"; outline?: boolean }[];
  /** the specimen frame's strips on the card layouts (Home · v2) */
  specimen?: { path: string; mode: string; caption: string; cover?: "product" };
}

export const CASES: CaseRowData[] = [
  {
    id: "drift",
    n: "01",
    meta: "Design systems · 2024 to 2026",
    lead: "Lead case",
    title: "From Drift to Foundation",
    claim: "Nobody asked for a system. I built one anyway, got a CTO to fund a team, then handed it to every product team.",
    href: "/case-studies/design-system-transformation",
    tags: [{ text: "systems at scale" }, { text: "governance", tone: "c2" }, { text: "tokens figma → code", tone: "c3" }, { text: "close with engineers", outline: true }],
  },
  {
    id: "booking",
    n: "02",
    meta: "Product design · 2024 to 2026",
    title: "B2B travel platform",
    claim: "Two years of redesign, nothing live. Six product areas shipped on the new system.",
    href: "/case-studies/booking-platform",
    tags: [{ text: "shipped impact" }, { text: "problem framing", tone: "c2" }, { text: "stakeholders", outline: true }],
  },
  {
    id: "theming",
    n: "03",
    meta: "Design systems · theming · 2026",
    title: "One system, many faces",
    claim: "Themes in BELLA swap the values, never the components.",
    href: "/case-studies/theming",
    tags: [{ text: "token strategy figma → code" }, { text: "consistency without fragmentation", tone: "c3" }, { text: "accessibility in every theme", tone: "c2" }, { text: "ai-ready structure", outline: true }],
  },
  {
    id: "search",
    n: "04",
    meta: "Pattern · 2024 to 2026",
    title: "Search for people who know what they want",
    claim: "One search for flights, stays, trains and cars, each with its supplier\u2019s rules.",
    href: "/case-studies/search-experts",
    tags: [{ text: "consistency vs exceptions", tone: "c3" }, { text: "states & variants", outline: true }],
  },
  {
    id: "chip",
    n: "05",
    meta: "AI-enabled design · 2026",
    title: "CHIP",
    claim: "An agent that watches the system and never moves silently. I show it live.",
    href: "/case-studies/chip",
    tags: [{ text: "ai-compatible system" }, { text: "judgement over ai", outline: true }],
  },
  /* Code First (24 Sep audit, B6; Brad Frost Web, permission given) */
  {
    id: "code-first",
    n: "06",
    meta: "Design systems · Brad Frost Web · 2025 to 2026",
    title: "Code First",
    claim: "Working code-first changes what you notice.",
    href: "/case-studies/brad-frost",
    tags: [{ text: "tokens figma → code", tone: "c3" }, { text: "close with engineers", outline: true }],
  },
];

/* Home shows the first three (Elleta, 22 Sep 2026): Drift, B2B travel,
 * Theming. The order above is theirs, so /work numbers them the same. */
export const HOME_CASES: CaseRowData[] = CASES.slice(0, 3);

/* Home · v2 (Gate 2, 3 Oct 2026): the lead three in /work order, Drift
 * featured, then Federated (live since 4 Oct) and CHIP as cards. Numbers
 * follow the Gate 2 /work order (01 Drift, 02 Federated, 03 CHIP). */
const byId = (id: string) => CASES.find((c) => c.id === id)!;
export const HOME_LEAD: CaseRowData[] = [
  { ...byId("drift"), specimen: { path: "drift / buttons · audit", mode: "one kept", caption: "Redrawn from my own audit." } },
  {
    id: "federated",
    n: "02",
    meta: "Design systems · federated · 2026",
    title: "They stopped telling me what they\u2019d done",
    claim: "Proves a federated system can run without me as the bottleneck.",
    href: "/case-studies/federated",
    tags: [],
    specimen: { path: "federated / product card", mode: "published", caption: "One chip, a new slot, nothing forked.", cover: "product" },
  },
  { ...byId("chip"), n: "03", specimen: { path: "chip / watch loop", mode: "watching", caption: "Drawn from CHIP\u2019s watch loop." } },
];

/* /work (Site v3, job 33, Elleta 5 Oct 2026): Home's case cards, four
 * cases in this order: Drift, Federated (live since 4 Oct), CHIP,
 * Theming. Booking, Search and Code First leave /work; their pages stay
 * live, unlinked from it. */
export const WORK_CASES: CaseRowData[] = [
  HOME_LEAD[0],
  HOME_LEAD[1],
  HOME_LEAD[2],
  { ...byId("theming"), n: "04" },
];
