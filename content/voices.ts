import type { Skill } from "@/content/skills";

/* Who I follow (Elleta, 19 Sep 2026): the twelve people from the approved
 * mock, their piece, the line that stuck, and how their ideas connect.
 * Names are credits. The pieces come from the CHIP research library and
 * are NOT verified yet: each needs its real URL, and the quote needs
 * checking against the piece. `verified: true` (after that check) is what
 * lets a voice's piece into the library as a Reading entry
 * (content/learning.ts); until then it shows here only.
 *
 * group: 1 = specs and tokens, 2 = rules and governance, 3 = AI experience.
 * connects: whose ideas this one builds on (drawn as wires).
 * shaped: WORK_ITEMS ids where the idea landed. */

export type Voice = {
  id: string;
  name: string;
  title: string;
  /** where the piece lives (a publication or the author's site) */
  source: string;
  quote: string;
  summary: string;
  connects: string[];
  group: 1 | 2 | 3;
  shaped: string[];
  topics: Skill[];
  /** YYYY-MM, when she read it */
  date: string;
  url?: string;
  verified: boolean;
};

export const VOICE_GROUPS: Record<Voice["group"], string> = {
  1: "Specs and tokens",
  2: "Rules and governance",
  3: "AI experience",
};

export const VOICES: Voice[] = [
  {
    id: "curtis",
    name: "Nathan Curtis",
    title: "specs-cli: 99.25% Figma compression",
    source: "EightShapes blog",
    quote: "AI belongs downstream of a mechanical spec.",
    summary: "Proves the three-layer idea with numbers. Context engineering, measured.",
    connects: ["friedman", "pandya"],
    group: 1,
    shaped: ["chip"],
    topics: ["Figma ⇄ code", "AI-enabled design"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "friedman",
    name: "Vitaly Friedman",
    title: "Five Levels of Context Engineering",
    source: "Smashing Magazine",
    quote: "The right compression of a brief is the brief.",
    summary: "Frames the brief as a compression problem. The bridge between specs and rules.",
    connects: ["curtis", "frost"],
    group: 3,
    shaped: ["chip"],
    topics: ["AI-enabled design"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "pandya",
    name: "Hardik Pandya",
    title: "LLM Design Systems: the three-layer contract",
    source: "pandya.io",
    quote: "Spec files, token layer, audit script, sync. Four pieces. One loop.",
    summary: "Names the structure: spec, tokens, audit, sync.",
    connects: ["curtis", "pitre"],
    group: 1,
    shaped: ["chip"],
    topics: ["AI-enabled design", "Design tokens"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "frost",
    name: "Brad Frost",
    title: "Atomic agentic systems",
    source: "bradfrost.com",
    quote: "The system is the rules that govern the components.",
    summary: "Atomic design for the agent era: the rules are the system.",
    connects: ["kavcic", "friedman"],
    group: 2,
    shaped: ["chip"],
    topics: ["Design system governance", "AI-enabled design"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "kavcic",
    name: "Romina Kavčić",
    title: "Design systems as infrastructure",
    source: "Substack",
    quote: "Operating principles first, components later.",
    summary: "The system as infrastructure, with permission tiers.",
    connects: ["frost", "cianfrani"],
    group: 2,
    shaped: ["drift"],
    topics: ["Design systems", "Design system governance"],
    date: "2026-03",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "cianfrani",
    name: "Mark Cianfrani",
    title: "Designer as agent-operator",
    source: "cianfrani.dev",
    quote: "What the operator approves is the system.",
    summary: "The operator is the contract. CHIP's approve gate is where this lands.",
    connects: ["pitre", "kavcic"],
    group: 2,
    shaped: ["chip"],
    topics: ["AI-enabled design"],
    date: "2026-03",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "pitre",
    name: "TJ Pitre",
    title: "Tokens as the primary contract",
    // [CHECK] source: the mock said SmashingConf Amsterdam 2026, but his
    // workshop was SmashingConf Freiburg, Sep 2026. Which is the piece?
    source: "SmashingConf Freiburg 2026",
    quote: "If the tokens aren't right, nothing downstream can be right.",
    summary: "Tokens as the load-bearing artifact.",
    connects: ["cianfrani", "pandya"],
    group: 1,
    shaped: ["code-first"],
    topics: ["Design tokens"],
    date: "2026-03",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "appleton",
    name: "Maggie Appleton",
    title: "LM Sketchbook: mental models for LLM systems",
    source: "maggieappleton.com",
    quote: "Daemons run quietly until summoned.",
    summary: "The daemon model behind CHIP's quiet, background agent.",
    connects: ["friedman", "frost", "cianfrani"],
    group: 3,
    shaped: ["chip"],
    topics: ["AI-enabled design"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "campbell",
    name: "Emily Campbell",
    title: "AI interaction pattern library",
    source: "Shape of AI",
    quote: "Patterns let us speak the same language.",
    summary: "The vocabulary BELLA's AI components extend.",
    connects: ["pandya", "curtis", "pitre"],
    group: 3,
    shaped: ["chip"],
    topics: ["AI-enabled design", "Product design"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "if",
    name: "Projects by IF",
    title: "Trust Patterns Catalogue",
    source: "projectsbyif.com",
    quote: "Trust is built in the small moments.",
    summary: "Don't block, make the override visible. The root of CHIP's inclusion gate.",
    connects: ["frost", "cianfrani"],
    group: 2,
    shaped: ["chip"],
    topics: ["AI-enabled design", "Accessibility"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "wattenberger",
    name: "Amelia Wattenberger",
    title: "Yay, Embeddings, Math!",
    source: "wattenberger.com",
    quote: "Semantic search is similarity made navigable.",
    summary: "Why connected entries like these can exist at all.",
    connects: ["friedman", "pandya", "curtis"],
    group: 3,
    shaped: [],
    topics: ["AI-enabled design"],
    date: "2026-04",
    // [CHECK] real URL
    verified: false,
  },
  {
    id: "wroblewski",
    name: "Luke Wroblewski",
    title: "Structured AI search interface",
    source: "lukew.com",
    quote: "Structured answers beat free-form chat for expertise.",
    summary: "Structured AI output. The same stance as CHIP's diagnosis cards.",
    connects: ["friedman", "kavcic", "pitre"],
    group: 3,
    shaped: [],
    topics: ["AI-enabled design", "Product design"],
    date: "2026-03",
    // [CHECK] real URL
    verified: false,
  },
];
