import type { Skill } from "@/content/skills";
import { VOICES } from "@/content/voices";

/* The learning record behind /learning (Elleta, 19 Sep 2026). Seeded from
 * the verified record (Gmail confirmations + LinkedIn certifications,
 * 19 Sep 2026), not from the mock. Every open question from that record
 * stays below as a [CHECK] comment until she confirms it.
 *
 * `took` is the "What I took from it" line, in her words. Where the
 * approved mock had a line for the same entry it is used here; an empty
 * string means no line yet and the page leaves the row out.
 * `usedIn` holds WORK_ITEMS ids (lib/workLibrary.ts). `certified` marks
 * an event that also earned a certificate, so it joins the badges while
 * keeping its own type. Reading entries are not written here: they are
 * generated from content/voices.ts, only for voices marked verified. */

export const LEARNING_TYPES = [
  "Course",
  "Certificate",
  "Workshop",
  "Conference",
  "Hackathon",
  "Reading",
  "Podcast",
  "Off the clock",
] as const;
export type LearningType = (typeof LEARNING_TYPES)[number];

export type LearningEntry = {
  id: string;
  type: LearningType;
  title: string;
  /** teacher, author or organiser (credits) */
  from: string;
  /** YYYY-MM */
  date: string;
  /** the month isn't confirmed yet: the page underlines it, dotted */
  dateToConfirm?: boolean;
  status: "done" | "in-progress";
  topics: Skill[];
  /** WORK_ITEMS ids */
  usedIn: string[];
  took: string;
  link?: string;
  certificateUrl?: string;
  /** an event that also earned a certificate (joins the badges) */
  certified?: boolean;
  /** grouped entries: the titles inside */
  items?: string[];
};

const RECORD: LearningEntry[] = [
  /* ── Certificates (earned) ── */
  {
    id: "subatomic",
    type: "Certificate",
    title: "Subatomic: The Complete Guide to Design Tokens",
    from: "Brad Frost, Ian Frost",
    date: "2026-08",
    status: "done",
    topics: ["Design Tokens", "Figma ⇄ Code"],
    usedIn: ["code-first"],
    took: "Tokens are the contract between Figma and code.",
    // [CHECK] certificateUrl: the credential is on LinkedIn, add its URL
  },
  {
    id: "atomic-design",
    type: "Certificate",
    title: "Atomic Design Certification Course",
    from: "Brad Frost",
    // [CHECK] email says Jul 2026 (24 Jul); LinkedIn says Jun 2026, and the
    // LinkedIn description has a typo and describes tokens. Fix on LinkedIn.
    date: "2026-07",
    status: "done",
    topics: ["Design Systems", "Component Libraries"],
    usedIn: ["drift"],
    took: "Start small, compose up, and name every level.",
  },
  {
    id: "smart-interface-design-patterns",
    type: "Certificate",
    title: "Smart Interface Design Patterns",
    from: "Vitaly Friedman",
    // training Oct to Nov 2025, certificate Jan 2026. Not on LinkedIn yet.
    date: "2026-01",
    status: "done",
    topics: ["Product Design", "Accessibility"],
    usedIn: ["drift"],
    took: "Judge the pattern against the task before judging the pixels.",
  },
  {
    id: "ixdf-mobile-ux",
    type: "Certificate",
    title: "Mobile UX Design: The Beginner's Guide",
    from: "Interaction Design Foundation",
    date: "2024-06",
    status: "done",
    topics: ["Product Design", "UX Research"],
    usedIn: [],
    took: "",
  },
  {
    id: "ixdf-better-world",
    type: "Certificate",
    title: "Design for a Better World with Don Norman",
    from: "Interaction Design Foundation, Don Norman",
    date: "2024-04",
    status: "done",
    topics: ["Product Design"],
    usedIn: [],
    took: "",
  },
  {
    id: "ixdf-21st-century",
    type: "Certificate",
    title: "Design for the 21st Century with Don Norman",
    from: "Interaction Design Foundation, Don Norman",
    date: "2024-04",
    status: "done",
    topics: ["Product Design"],
    usedIn: [],
    took: "",
  },
  {
    id: "ixdf-ux-beginners",
    type: "Certificate",
    title: "User Experience: The Beginner's Guide",
    from: "Interaction Design Foundation",
    // [CHECK] date: on LinkedIn without one
    date: "2024-01",
    dateToConfirm: true,
    status: "done",
    topics: ["Product Design", "UX Research"],
    usedIn: [],
    took: "",
  },

  /* ── Courses ── */
  {
    id: "measure-ux-impact-course",
    type: "Course",
    title: "How To Measure UX & Design Impact",
    from: "Vitaly Friedman",
    // [CHECK] completed; certificate requested 4 Aug 2026, no reply found yet.
    // Becomes a Certificate (and a badge) once it arrives.
    date: "2026-08",
    status: "done",
    topics: ["UX Research", "Product Design"],
    usedIn: [],
    took: "Set the baseline before you promise the lift.",
  },
  {
    id: "ixdf-master-classes",
    type: "Course",
    title: "Master Classes",
    from: "Interaction Design Foundation",
    // participation certificates, grouped as one entry (2023 to 2025)
    date: "2025-09",
    status: "done",
    topics: ["Design Systems", "Design Tokens", "Accessibility", "AI-enabled Design", "UX Research", "Product Design"],
    usedIn: [],
    took: "",
    items: [
      "Complex UI Design: Practical Techniques (2023)",
      "Design KPIs: From Insights to Impact (2023)",
      "Design for a Better World, discussion (2023)",
      "Accessible and Inclusive Design Patterns (2024)",
      "The Importance of Emotional Intelligence in UX (2024)",
      "Disruptive Design (2024)",
      "Design for Adaptability: Component-Driven IA (2024)",
      "Design Patterns for AI UX (2024)",
      "Design Systems Blueprint (2024)",
      "Design Tokens: Powering Your Design System (2024)",
      "How to Design Better Error Messages (2024)",
      "Systems Thinking for Designers (2024)",
      "User Research for Everyone (2024)",
      "Design Sprints in 2025 (2025)",
      "Hooked (2025)",
      // [CHECK] plus 4 more from Mar, Mar, Apr, May and Sep 2025: titles
      // are truncated in the emails
    ],
  },
  {
    id: "ai-and-design-systems",
    type: "Course",
    title: "AI and Design Systems",
    from: "Brad Frost, Ian Frost, TJ Pitre",
    // [CHECK] enrolled May 2026, no completion email. Not a certificate yet.
    date: "2026-05",
    status: "in-progress",
    topics: ["AI-enabled Design", "Design System Governance", "Design Systems"],
    // in progress, not a certificate: no "Used in" until it's finished
    usedIn: [],
    took: "A system an AI can read is a system people can read too.",
  },
  // [CHECK] Design Tokens Mastery (Romina Kavčić): no trace in Gmail. Other
  // email or platform? Left out until confirmed.
  // Not learning: the "Maker Program" was paid project work (agreements
  // Oct 2025 and Mar 2026). It stays in Experience.

  /* ── Conferences ── */
  {
    id: "ids-conference-2025",
    type: "Conference",
    title: "Into Design Systems Conference 2025",
    from: "Into Design Systems, online",
    // conference 28 to 30 May 2025, certificate Jun 2025
    date: "2025-05",
    status: "done",
    certified: true,
    topics: ["Design Systems", "Design System Governance"],
    usedIn: ["drift"],
    took: "Governance is a people problem wearing a process costume.",
  },
  {
    id: "ids-ai-conference-2026",
    type: "Conference",
    title: "Into Design Systems AI Conference 2026",
    from: "Into Design Systems, online",
    // 19 to 20 Mar 2026
    date: "2026-03",
    status: "done",
    topics: ["AI-enabled Design", "Design Systems"],
    usedIn: [],
    took: "",
  },
  {
    id: "smashingconf-amsterdam-2026",
    type: "Conference",
    title: "SmashingConf Amsterdam 2026",
    from: "Smashing, Amsterdam",
    date: "2026-04",
    status: "done",
    topics: ["Design Systems", "Accessibility", "AI-enabled Design"],
    usedIn: [],
    took: "Everyone is solving the same drift problem, just with different tools.",
  },

  /* ── Workshops and live sessions ── */
  {
    id: "advanced-design-systems-workshop",
    type: "Workshop",
    title: "Advanced Design Systems",
    from: "Brad Frost, SmashingConf Freiburg 2025",
    date: "2025-09",
    status: "done",
    topics: ["Design Systems", "Component Libraries", "Design System Governance"],
    usedIn: [],
    took: "",
  },
  {
    id: "design-patterns-for-ai",
    type: "Workshop",
    title: "Design Patterns For AI in 2026",
    from: "Vitaly Friedman, live session",
    date: "2025-10",
    status: "done",
    topics: ["AI-enabled Design", "Product Design"],
    usedIn: [],
    took: "",
  },
  {
    id: "complex-uis",
    type: "Workshop",
    title: "Designing For Complex UIs in 2026",
    from: "Vitaly Friedman, live session",
    date: "2026-01",
    status: "done",
    topics: ["AI-enabled Design", "Product Design"],
    usedIn: [],
    took: "Verifiability beats transparency: let people check the output.",
  },
  {
    id: "measuring-ux-impact-workshop",
    type: "Workshop",
    title: "Measuring UX Impact",
    from: "Vitaly Friedman, SmashingConf Amsterdam 2026",
    // certificates sent 27 Apr 2026. [CHECK] the email says "Certificates",
    // plural: did a conference certificate come too? Not on LinkedIn yet.
    date: "2026-04",
    status: "done",
    certified: true,
    topics: ["UX Research", "Product Design"],
    usedIn: [],
    took: "",
  },
  {
    id: "context-based-design-systems",
    type: "Workshop",
    title: "Building Context-Based Design Systems",
    from: "TJ Pitre, SmashingConf Freiburg 2026",
    date: "2026-09",
    status: "done",
    topics: ["Design Tokens", "AI-enabled Design"],
    usedIn: ["chip"],
    took: "Tokens as the primary contract for AI tools.",
  },

  /* ── Hackathons ── */
  {
    id: "ids-ai-hackathon",
    type: "Hackathon",
    title: "Into Design Systems AI Hackathon",
    from: "Into Design Systems",
    // 6 Feb 2026, certificate. Not on LinkedIn yet.
    date: "2026-02",
    status: "done",
    certified: true,
    topics: ["AI-enabled Design", "Design Systems"],
    usedIn: [],
    took: "",
  },
  {
    id: "built-with-opus",
    type: "Hackathon",
    title: "Built with Opus 4.7: a Claude Code hackathon",
    from: "Anthropic, Cerebral Valley",
    // project submitted 26 Apr 2026 (CHIP); over 20K applicants
    date: "2026-04",
    status: "done",
    topics: ["AI-enabled Design", "Design System Governance", "Design Systems"],
    usedIn: ["chip"],
    took: "The human stays in the judgment layer. The agent never moves silently.",
  },
  // [CHECK] Guardian hackathon: organiser and date unknown, nothing in
  // Gmail. Left out until confirmed.
];

/* Reading entries come from the voices she has checked (verified: true):
   until a piece is confirmed real and has its URL, it lives in Who I
   follow only, never in the library. */
const READING: LearningEntry[] = VOICES.filter((v) => v.verified).map((v) => ({
  id: `reading-${v.id}`,
  type: "Reading",
  title: v.title,
  from: v.name,
  date: v.date,
  status: "done",
  topics: v.topics,
  usedIn: v.shaped,
  took: v.summary,
  link: v.url,
}));

export const LEARNING: LearningEntry[] = [...RECORD, ...READING];

/** entries the Map and Skills views leave out (Timeline and Table only) */
export const OFF_MAP: LearningType[] = ["Podcast", "Off the clock"];

/** an earned certificate: the Certificate type, or an event that earned one */
export const isCertificate = (e: LearningEntry) =>
  (e.type === "Certificate" || e.certified === true) && e.status === "done";

// [CHECK] Next up: her pick for what she learns next. The hero line
// renders only once this is set; placeholders never reach the page.
export const NEXT_UP: string | null = null;

/* ── Counts: the ONE source (Elleta, 19 Sep 2026). The hero stats, the
   Type and Topic chip counts, the result count and the map key all read
   these, so they can't disagree. The Certificate chip means "earned a
   certificate", the same set as the badges. ── */
export const matchesType = (e: LearningEntry, t: LearningType) =>
  t === "Certificate" ? isCertificate(e) : e.type === t;
export const onMap = (e: LearningEntry) => !OFF_MAP.includes(e.type) && e.topics.length > 0;
export const countType = (t: LearningType, list: LearningEntry[] = LEARNING) =>
  list.filter((e) => matchesType(e, t)).length;
export const countTopic = (s: Skill, list: LearningEntry[] = LEARNING) =>
  list.filter((e) => e.topics.includes(s)).length;
export const CERTIFICATES = LEARNING.filter(isCertificate).sort((a, b) => b.date.localeCompare(a.date));
export const COUNTS = {
  entries: LEARNING.length,
  certificates: CERTIFICATES.length,
  coursesAndWorkshops: countType("Course") + countType("Workshop"),
  conferences: countType("Conference"),
  hackathons: countType("Hackathon"),
  reading: countType("Reading"),
  onMap: LEARNING.filter(onMap).length,
  projects: new Set(LEARNING.flatMap((e) => e.usedIn)).size,
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2026-08" -> "Aug 2026" */
export const formatMonth = (d: string) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(0, 4)}`;
