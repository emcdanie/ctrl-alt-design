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
  href: string;
  tags: { text: string; tone?: "c2" | "c3"; outline?: boolean }[];
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
    meta: "Design systems · BELLA · 2026",
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
];

/* Home shows the first three (Elleta, 22 Sep 2026): Drift, B2B travel,
 * Theming. The order above is theirs, so /work numbers them the same. */
export const HOME_CASES: CaseRowData[] = CASES.slice(0, 3);
