/* The case rows (W1 release, 22 Sep 2026): the ONE data source for every
 * case listing. /work shows them all and Home the first three, both
 * through components/CaseRow.tsx. Part A of
 * bella/docs/reference/case-study-mock.html: a line thumbnail
 * (components/diagrams/workThumbs.ts, keyed by id), a Mono meta line, the
 * one-line claim and the signal tags the case is evidence for. Case
 * identity (colour, slug parity) stays on WORK_ITEMS in lib/workLibrary.ts. */
/** a card cover exported from Figma's "Covers final" row (529:84898, job
 *  43): the specimen stage as a flat picture, light and dark, at 3x. A
 *  picture because the recreated UI in it runs under the 14px floor at
 *  card size (CLAUDE.md section 9). Files: /images/case/covers/<name>-<theme>.webp */
/** `focus`: what the card's cropped stage keeps (object-position; H4,
 *  cards fit one screen), centre when unset */
export type CoverPicture = { name: string; alt: string; width: number; height: number; focus?: string;
  /** phones: cropped in on the one part that matters (O9, stopgap for compact covers): scale, and the point it grows from */
  phone?: { zoom: number; at: string } };

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
  specimen?: { path: string; mode: string; caption: string; picture?: CoverPicture };
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
    tags: [{ text: "token strategy figma → code" }, { text: "no fragmentation", tone: "c3" }, { text: "accessibility in every theme", tone: "c2" }, { text: "ai-ready structure", outline: true }],
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

/* Home (Elleta, 6 Oct 2026, H4, back to the 4 Oct map; supersedes Home ·
 * v2's lead three): the three READY cases, Drift featured, then Federated
 * and Theming as cards. CHIP waits on /work with "Update coming". */
const byId = (id: string) => CASES.find((c) => c.id === id)!;
const DRIFT: CaseRowData = {
  ...byId("drift"),
  specimen: {
    path: "drift / buttons · audit",
    mode: "before → after",
    caption: "Recreated from my audit. No client UI.",
    picture: { name: "drift", phone: { zoom: 1.7, at: "46% 62%" }, width: 1458, height: 1020, alt: "Before: a drifted Stays in Lisbon list with two different Book buttons, marked with a red cross. After: the Harbour loft card on BELLA, marked with a green tick." },
  },
};
const FEDERATED: CaseRowData = {
  id: "federated",
  n: "02",
  meta: "Design systems · federated · 2026",
  title: "They stopped telling me what they\u2019d done",
  claim: "Proves a federated system can run without me as the bottleneck.",
  href: "/case-studies/federated",
  tags: [],
  specimen: {
    path: "federated / contribution",
    mode: "one system",
    caption: "Recreated. One chip, a new slot, nothing forked.",
    picture: { name: "federated", phone: { zoom: 1.6, at: "68% 50%" }, width: 1392, height: 1008, focus: "50% 0%", alt: "A product page with its size chips, beside a panel: kept the old chip, added a slot. Colour and Text kept, Slot new, and three fills for the slot: size and stock, kids' age and height, a colour filter." },
  },
};
const CHIP: CaseRowData = {
  ...byId("chip"),
  n: "03",
  /* CHIP 2.0 is in progress (Elleta, 6 Oct 2026, H4): the card stays a link */
  status: "Update coming",
  specimen: {
    path: "chip 2.0 / atlas",
    mode: "filter chip",
    caption: "CHIP 2.0 checks every layer of a component.",
    picture: { name: "chip", phone: { zoom: 1.35, at: "50% 50%" }, width: 1392, height: 1008, alt: "CHIP's Atlas anatomy of the FilterChip: the Accessible chip with six numbered parts." },
  },
};
const THEMING: Omit<CaseRowData, "n"> = {
  ...byId("theming"),
  specimen: {
    path: "theming / theme switcher",
    mode: "on BELLA",
    caption: "Three brands, one set of components.",
    picture: { name: "theming", phone: { zoom: 1.5, at: "50% 72%" }, width: 1392, height: 1008, alt: "A night, coast and market switcher over the bel·la homes listing screen on night, with the saltstay and verdello faces fanned behind it." },
  },
};
export const HOME_LEAD: CaseRowData[] = [DRIFT, FEDERATED, { ...THEMING, n: "03" }];

/* /work (Site v3, job 33, Elleta 5 Oct 2026): Home's case cards, four
 * cases in this order: Drift, Federated (live since 4 Oct), CHIP,
 * Theming. Booking, Search and Code First leave /work; their pages stay
 * live, unlinked from it. */
/* tags only where Figma 486:57509 has them: CHIP (K2, 6 Oct 2026) */
export const WORK_CASES: CaseRowData[] = [{ ...DRIFT, tags: [] }, FEDERATED, CHIP, { ...THEMING, n: "04", tags: [] }];
