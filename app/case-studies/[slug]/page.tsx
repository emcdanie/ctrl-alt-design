import { notFound } from "next/navigation";
import { getCaseStudy, getAllSlugs } from "@/lib/content";
import { findWorkItemBySlug } from "@/lib/workLibrary";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseShellV2 from "@/components/CaseShellV2";
import CodeFirstV2 from "@/components/CodeFirstV2";
import DriftV2 from "@/components/DriftV2";
import ChipCase from "@/components/ChipCase";
import BookingCase from "@/components/BookingCase";
import SearchCase from "@/components/SearchCase";
import CheckoutCase from "@/components/CheckoutCase";
import type { CaseStudy } from "@/lib/content";

/* metadata reads in sentence case: "DESIGN SYSTEMS" -> "Design systems" */
const sentenceCase = (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();

/* header dates read "2024 to 25", like /work: "2024-2025" -> "2024 to 25" */
const spans = (t: string) => t.replace(/\b(20\d\d)-(?:20)?(\d\d)\b/g, "$1 to $2");

/* the article hero writes FULL years: "2024-2026" -> "2024 to 2026" */
const fullYears = (t: string) => t.replace(/\b(20\d\d)-(20\d\d)\b/g, "$1 to $2");

/* ── The case-study article (Elleta, 20 Sep 2026, Part C) ───────────
   A case on the new pattern declares the one iris word of its thesis
   here, and the one-line context note under its facts (mock v4, restored
   21 Sep). The facts row comes from its content file. Cases not yet
   migrated keep the old head. */
const ARTICLE: Record<
  string,
  {
    title: string;
    accent?: string;
    after?: string;
    note?: string;
    facts?: { label: string; value: string }[];
    /** no facts row: the hero opens on this lead instead (the mock does) */
    lead?: string;
    /** false when the facts already carry the years (the umbrella) */
    caseFact?: boolean;
  }
> = {
  "design-system-transformation": {
    title: "The system is the",
    accent: "agreements",
    after: ", not the library.",
    note: "Under NDA. The client appears as an industry only. Artifacts are recreated and the data is illustrative.",
  },
  "brad-frost": {
    title: "Working",
    accent: "code-first",
    after: " changes what you notice.",
    note: "Brad Frost's own system. Examples are recreated and simplified.",
  },
  /* the travel platform set (Part S, 21 Sep 2026): the mocks' copy */
  "booking-platform": {
    title: "A booking platform, rebuilt",
    accent: "mid-flight",
    after: ".",
    note: "Under NDA: a B2B travel platform. Screens are de-branded; names and codes are blurred.",
    caseFact: false,
    facts: [
      { label: "Role", value: "Lead product designer, design systems" },
      { label: "Team", value: "My squads: engineering and product" },
      { label: "Years", value: "2024 to 2026" },
      { label: "Shipped", value: "System, search, flights, cars, checkout, admin" },
    ],
  },
  "search-experts": {
    title: "Search for people who know what they want.",
    lead: "The people booking used it every day. They knew the route, the fare and the policy. I shipped a results page that kept their search in view and put filters behind one button. This is that page, and the version I'd build with the time for every micro-interaction.",
  },
  checkout: {
    title: "A checkout that knows who's paying.",
    lead: "Company travel has rules: who you book for, what your role allows, which cards you may see. I designed the checkout and payment step once, for every product, so those rules show up as fewer choices instead of more forms.",
  },
  chip: {
    title: "AI builds what your system is. CHIP",
    accent: "sees it first",
    after: ".",
    note: "A personal project on my own systems. Data is illustrative; nothing comes from a client.",
    /* CHIP keeps a metadata list rather than the metrics block, and its
       four facts are the mock's shortenings of those entries */
    facts: [
      { label: "Role", value: "Designer and builder, solo" },
      { label: "Built", value: "5 days, Claude Code hackathon, Apr 2026" },
      { label: "Tools", value: "Claude Code, MCP, BELLA tokens" },
      { label: "Status", value: "Honest prototype, CHIP 2.0 in progress" },
    ],
  },
};

/* house style for a span: "Oct 2024 - Jan 2025" reads "... to ...".
   The DATES themselves are untouched (Part N item 4); this is only the
   separator, which is ours and never a dash (CLAUDE.md section 6). */
const toSpan = (v: string) => v.replace(/\s+-\s+/g, " to ");

const facts = (cs: CaseStudy) =>
  [
    { label: "Role", value: cs.metrics?.role },
    { label: "Team", value: cs.metrics?.team },
    { label: "Timeline", value: cs.metrics?.timeline },
    { label: "Scope", value: cs.metrics?.scope },
  ]
    .filter((f): f is { label: string; value: string } => Boolean(f.value))
    .map((f) => ({ ...f, value: toSpan(f.value) }));

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* Per-case tab identity (Elleta, 21 Jul, audit finding 7): the tab wears
   the case NAME (the library title), never the thesis. Description is the
   top-level summary; where a case lacks one (Elleta, 21 Jul), the first
   sentence of its summary-block context, verbatim; else the route's
   existing description fallback. Unknown slug or missing library row
   inherits the root metadata. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  const caseItem = findWorkItemBySlug(slug);
  const summaryBlock = cs.blocks?.find((b) => b.kind === "summary");
  const contextFirstSentence =
    summaryBlock && "context" in summaryBlock
      ? summaryBlock.context.match(/^[\s\S]*?\./)?.[0]
      : undefined;
  return {
    ...(caseItem ? { title: `${caseItem.title}, Elleta McDaniel` } : {}),
    description: cs.summary ?? contextFirstSentence ?? cs.description,
  };
}

/* ── ONE render path (case-migration kickoff, completed 23 Jul):
   every case renders through CaseShellV2 + its CaseBeat composition.
   The old CaseStudyShell + Block renderer left with the chip
   migration (kickoff step 3: both cases out, shell deleted);
   audit:parity keeps the registry honest. ── */
const COMPOSITIONS: Record<string, React.ComponentType<{ cs: CaseStudy }>> = {
  "brad-frost": CodeFirstV2,
  "design-system-transformation": DriftV2,
  chip: ChipCase,
  "booking-platform": BookingCase,
  "search-experts": SearchCase,
  checkout: CheckoutCase,
};

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();
  const Composition = COMPOSITIONS[slug];
  if (!Composition) notFound();
  const article = ARTICLE[slug];

  /* reading time, mechanical: every narrative string in the content
     file at 220 wpm, rounded up */
  const words = JSON.stringify(cs.blocks ?? [])
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 220));

  return (
    <CaseStudyLayout>
      <CaseShellV2
        slug={slug}
        eyebrow={
          article
            ? `Case study · ${sentenceCase(cs.category)} · ${fullYears(cs.year)}`
            : spans(cs.eyebrow ?? `${sentenceCase(cs.category)} · ${cs.year}`)
        }
        title={article ? article.title : cs.title}
        accent={article?.accent}
        after={article?.after}
        subhead={cs.summary ?? cs.description}
        readingMinutes={readingMinutes}
        tags={cs.tags}
        facts={
          article && !article.lead
            ? [
                ...(article.caseFact === false
                  ? []
                  : [{ label: "Case", value: `${sentenceCase(cs.category)} · ${fullYears(cs.year)}` }]),
                ...(article.facts ?? facts(cs)),
              ]
            : undefined
        }
        lead={article?.lead}
        nda={article?.note}
      >
        <Composition cs={cs} />
      </CaseShellV2>
    </CaseStudyLayout>
  );
}
