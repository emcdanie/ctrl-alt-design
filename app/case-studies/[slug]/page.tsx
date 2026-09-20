import { notFound } from "next/navigation";
import { getCaseStudy, getAllSlugs } from "@/lib/content";
import { findWorkItemBySlug } from "@/lib/workLibrary";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseShellV2 from "@/components/CaseShellV2";
import CodeFirstV2 from "@/components/CodeFirstV2";
import DriftV2 from "@/components/DriftV2";
import ChipCase from "@/components/ChipCase";
import type { CaseStudy } from "@/lib/content";

/* metadata reads in sentence case: "DESIGN SYSTEMS" -> "Design systems" */
const sentenceCase = (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();

/* header dates read "2024 to 25", like /work: "2024-2025" -> "2024 to 25" */
const spans = (t: string) => t.replace(/\b(20\d\d)-(?:20)?(\d\d)\b/g, "$1 to $2");

/* the article hero writes FULL years: "2024-2026" -> "2024 to 2026" */
const fullYears = (t: string) => t.replace(/\b(20\d\d)-(20\d\d)\b/g, "$1 to $2");

/* ── The case-study article (Elleta, 20 Sep 2026, Part C) ───────────
   A case on the new pattern declares the one iris word of its thesis
   here; the facts row and the NDA line come from its content file, so
   nothing is restated. Cases not yet migrated keep the old head. */
const ARTICLE: Record<
  string,
  { title: string; accent: string; after: string; facts?: { label: string; value: string }[] }
> = {
  "design-system-transformation": {
    title: "The system is the set of",
    accent: "agreements",
    after: ", not the component library.",
  },
  "brad-frost": {
    title: "Working",
    accent: "code-first",
    after: " changes what you pay attention to.",
  },
  chip: {
    title: "AI builds whatever your system already is. I built CHIP to",
    accent: "see it first",
    after: ".",
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
  const nda = (cs.blocks?.find((b) => b.kind === "disclosure") as { text: string } | undefined)?.text;

  /* reading time, mechanical: every narrative string in the content
     file at 220 wpm, rounded up */
  const words = JSON.stringify(cs.blocks ?? [])
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 220));

  return (
    <CaseStudyLayout>
      <div className="layout-container">
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
            article
              ? [
                  { label: "Case", value: `${sentenceCase(cs.category)} · ${fullYears(cs.year)}` },
                  ...(article.facts ?? facts(cs)),
                ]
              : undefined
          }
          nda={article ? nda : undefined}
        >
          <Composition cs={cs} />
        </CaseShellV2>
      </div>
    </CaseStudyLayout>
  );
}
