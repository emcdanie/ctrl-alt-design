/* Pattern studies (Work, 19 Sep 2026): one hard UI problem each, worked
 * through. The /work list reads every row; the four course briefs also
 * get a page at /work/studies/<id> from the one template.
 *
 * Brief-page sections render in a fixed order and drop out when empty.
 * A section marked `draft: true` is hidden on the site until Elleta
 * approves it (drafted from what the demo and the Loom about text show,
 * nothing more). Flip `draft` off, or delete the flag, to publish. */

export type StudyKind = "Course brief" | "Prototype" | "Hackathon";
export const STUDY_KINDS: StudyKind[] = ["Course brief", "Prototype", "Hackathon"];

export interface StudySection {
  paragraphs: string[];
  /** hidden on the site until approved */
  draft?: boolean;
}

export interface StudyBrief {
  brief: StudySection;
  constraints: StudySection;
  framing?: StudySection;
  decisions?: StudySection;
  skipped?: StudySection;
  ai?: StudySection;
  next?: StudySection;
  walkthrough?: { embed: string; about: string };
}

export interface Study {
  id: string;
  /** problem first */
  title: string;
  /** the project name, in the line under the title */
  project: string;
  /** one sentence after the project name */
  line: string;
  kind: StudyKind;
  year: string;
  /** the demo, for prototypes and hackathons */
  demo?: string;
  thumb: { src: string; width: number; height: number };
  /** course briefs only: the page at /work/studies/<id> */
  page?: StudyBrief;
}

export const BRIEF_CREDIT = "Brief from Vitaly Friedman's Smart Interface Design Patterns training.";

export const STUDIES: Study[] = [
  {
    id: "travel-search",
    title: "Sort and filter at scale",
    project: "Travel search",
    line: "Search, filters and booking in one flow for a B2B travel product.",
    kind: "Prototype",
    year: "2025",
    demo: "/demos/ctrl-travel-v2.html",
    thumb: { src: "/images/studies/travel-search.webp", width: 640, height: 361 },
  },
  {
    id: "stock-screener",
    title: "Filters you can talk to",
    project: "AI stock screener",
    line: "Natural-language filters become editable chips, with a reasoning trace.",
    kind: "Course brief",
    year: "2026",
    demo: "/demos/finviz-3.html",
    thumb: { src: "/images/studies/stock-screener.webp", width: 640, height: 332 },
    page: {
      brief: {
        paragraphs: [
          "Finviz serves expert traders who build complex combinations of filters, and some of them run 50 to 60 portfolios from one screen. Exploring the data feels slow: they want to see trends sooner, and alerts that say how likely a move is.",
          "The business wants more Elite subscriptions. Ads get in the way of that, because they frustrate the people who would pay.",
        ],
      },
      constraints: {
        paragraphs: [
          "Dense tables with filters, sorting, batch actions and charts, all of which still have to work on a phone.",
        ],
      },
      framing: {
        draft: true,
        paragraphs: [
          "Every user need has to trace an unbroken path up to a business goal. The demo opens on that map, from why to where to what to how, so a feature with no path is visibly missing a reason.",
          "One plain-language question becomes a set of filters the trader can see and edit, instead of an answer they have to take on trust.",
        ],
      },
      decisions: {
        draft: true,
        paragraphs: [
          "The query turns into six editable filter chips, with a reasoning line for each one, so an expert can check the translation and change any part of it.",
          "Two modes, Teach me and Just do it, so the same screen serves someone learning the filters and someone who already knows them.",
          "When the data can't match the question, the screen says so: a ten-year dividend streak isn't a native filter, so it approximates with the five-year fields and shows the real streak in its own column.",
          "Elite earns its place by showing what it would have caught (a price drop the free plan only surfaces at the end of the day), not with an ad.",
        ],
      },
      ai: {
        draft: true,
        paragraphs: [
          "The AI translates the question into filters and watches the portfolios, and every read is a likelihood estimate with its source and freshness shown, never advice.",
          "When it doesn't have enough history, it says so and lists what to check instead. It never invents a number.",
        ],
      },
    },
  },
  {
    id: "race-day",
    title: "Dense data, read at a glance",
    project: "Race-day operations dashboard",
    line: "A control-room dashboard inspired by F1 telemetry.",
    kind: "Course brief",
    year: "2025",
    thumb: { src: "/images/studies/race-day.webp", width: 640, height: 443 },
    page: {
      brief: {
        paragraphs: [
          "Option two of a live-events brief: an AI-powered circuit dashboard for the Singapore Grand Prix. The circuit maps overwhelm the people using them, and the decisions they drive have to be made fast.",
        ],
      },
      constraints: {
        paragraphs: ["A lot of live data, and every action has to stay clear under pressure."],
      },
      framing: {
        draft: true,
        paragraphs: [
          "A high-density operational dashboard that borrows from race telemetry and control-room systems.",
        ],
      },
      walkthrough: {
        embed: "https://www.loom.com/embed/f93c664f6668417c81dbb774a2a7a4a3",
        about: "Designing a high-density operational dashboard inspired by F1 race telemetry and control room systems.",
      },
    },
  },
  {
    id: "insurance-forms",
    title: "Long forms that don't lose people",
    project: "Insurance forms",
    line: "Multilingual forms with inline validation and accessible patterns.",
    kind: "Course brief",
    year: "2025",
    thumb: { src: "/images/studies/insurance-forms.webp", width: 640, height: 316 },
    page: {
      brief: {
        paragraphs: [
          "A global insurer runs its inquiries on printed PDFs of 15 to 20 pages, five or six of them for each inquiry. The task is to turn them into digital journeys.",
          "The people filling them in span every age and language, including right-to-left scripts like Hebrew and Arabic, and Japanese and Korean. Advisors often fill the forms in for their customers. People give up at the first step when they see 20 or more steps ahead of them, or the price.",
        ],
      },
      constraints: {
        paragraphs: [
          "Multilingual and accessible, and it has to cut errors and the back-and-forth that follows them.",
        ],
      },
      framing: {
        draft: true,
        paragraphs: [
          "A form architecture that scales: multilingual content, validation logic and accessible interaction patterns as parts of one system, not fixes to one form.",
        ],
      },
      walkthrough: {
        embed: "https://www.loom.com/embed/1a13cb50b6ac4282952f85efa11f9d7e",
        about: "Designing scalable form architectures that support multilingual content, validation logic, and accessible interaction patterns.",
      },
    },
  },
  {
    id: "legal-search",
    title: "Search through regulation",
    project: "AI legal search + multimedia centre",
    line: "Search and media navigation for a dense EU regulatory site.",
    kind: "Course brief",
    year: "2025",
    thumb: { src: "/images/studies/legal-search.webp", width: 640, height: 76 },
    page: {
      brief: {
        paragraphs: [
          "The European Parliament runs a galaxy of an estimated 135 to 175 websites. Most visitors come from a search engine looking for one document, and many of them can't finish the task they came for. Search is either too broad or too narrow, and people land with no context.",
          "The top tasks: find legal texts, follow procedures and amendments, read summaries, and look up the measures each country uses to implement a law.",
        ],
      },
      constraints: {
        paragraphs: [
          "High completion on those top tasks, and a way back from errors. 24 languages. WCAG AA, and inclusive of neurodivergent and older users. GDPR. And everything on the site today has to stay reachable.",
        ],
      },
      framing: {
        draft: true,
        paragraphs: ["AI-enabled search and multimedia navigation, as patterns for a complex regulatory system."],
      },
      walkthrough: {
        embed: "https://www.loom.com/embed/685fc54dcb104d51baa15dcec8727da2",
        about: "Exploring AI-enabled legal search and multimedia navigation patterns for complex regulatory systems.",
      },
    },
  },
  {
    id: "command-center",
    title: "A design system you can inspect",
    project: "Design system command center",
    line: "Component analysis and governance in one dashboard.",
    kind: "Prototype",
    year: "2026",
    demo: "/demos/brad-frost-command-center.html",
    thumb: { src: "/images/studies/command-center.webp", width: 640, height: 295 },
  },
  {
    id: "pattern-mentor",
    title: "Pattern feedback, with sources",
    project: "Pattern Mentor plugin",
    line: "Design feedback that cites the pattern, with one-click fixes.",
    kind: "Prototype",
    year: "2026",
    demo: "/demos/pattern-mentor.html",
    thumb: { src: "/images/thumbnails/PatternMentor.svg", width: 800, height: 500 },
  },
  {
    id: "guardian",
    title: "An audit on the canvas",
    project: "Guardian",
    line: "Heuristics, drift and accessibility checks on a Figma-style canvas.",
    kind: "Hackathon",
    year: "2026",
    demo: "/demos/guardian-audit-tool.html",
    thumb: { src: "/images/thumbnails/GuardianAuditTool.svg", width: 800, height: 500 },
  },
];

/** where a row goes: its brief page, or its demo */
export const studyHref = (s: Study) => (s.page ? `/work/studies/${s.id}` : s.demo!);

export const findStudy = (id: string) => STUDIES.find((s) => s.id === id && s.page);
