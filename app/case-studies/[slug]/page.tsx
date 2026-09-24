import { notFound } from "next/navigation";
import { getCaseStudy, getAllSlugs } from "@/lib/content";
import { findWorkItemBySlug } from "@/lib/workLibrary";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseShellV2 from "@/components/CaseShellV2";
import CodeFirstV2 from "@/components/CodeFirstV2";
import DriftCase from "@/components/DriftCase";
import ChipCase from "@/components/ChipCase";
import BookingCase from "@/components/BookingCase";
import SearchCase from "@/components/SearchCase";
import CheckoutCase from "@/components/CheckoutCase";
import ThemingCase from "@/components/ThemingCase";
import type { CaseStudy } from "@/lib/content";
import { Tag } from "@/components/ui/Tag";

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
    /** the mock layout (Geist refresh, 22 Sep 2026): an eyebrow instead
     *  of the breadcrumb, the lead AND the at-a-glance strip, the signal
     *  tags, and no end reveal */
    mock?: {
      eyebrow: string;
      signals: { label?: string; tags: { text: string; tone?: "c2" | "c3"; outline?: boolean }[] };
    };
  }
> = {
  /* Part B of case-study-mock.html (Geist refresh, 22 Sep 2026) */
  "design-system-transformation": {
    title: "The system is the agreements, not the library.",
    lead: "A first design system for a B2B travel platform that had outgrown its UI, built by one designer and one developer, then funded and handed to every product team.",
    caseFact: false,
    facts: [
      { label: "role", value: "Lead product designer, design systems" },
      { label: "team", value: "Every squad, one per product, plus admin and invoicing" },
      { label: "scope", value: "Audit, tokens, library in code, governance" },
      { label: "outcome", value: "A funded team and six product areas live" },
    ],
    note: "Under NDA. Diagrams are my own, redrawn to show the approach; no client screens or data.",
    mock: {
      eyebrow: "Case · Design systems · 2024 to 2026",
      signals: {
        label: "this case is evidence for",
        tags: [
          { text: "systems at scale" },
          { text: "contribution & governance", tone: "c2" },
          { text: "tokens figma → code", tone: "c3" },
          { text: "close with engineers", outline: true },
          { text: "shipped impact", outline: true },
        ],
      },
    },
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
    note: "Under NDA. Diagrams are my own, redrawn to show the approach; no client screens or data.",
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
  /* theming-case-study.html (Geist refresh, 22 Sep 2026) */
  theming: {
    title: "One system, many faces.",
    lead: "Themes in BELLA swap the values, never the components. Watch the same screen change, token by token. Nothing to scroll or click.",
    caseFact: false,
    facts: [
      { label: "role", value: "Design systems lead, and the person who builds it" },
      { label: "system", value: "BELLA, my own open design system" },
      { label: "scope", value: "Token tiers, themes, contrast gate, Figma ⇄ code" },
      { label: "proof", value: "Light and dark live on this site; axe runs clean in both" },
    ],
    mock: {
      eyebrow: "Case · Theming · BELLA, 2026",
      signals: {
        tags: [
          { text: "token strategy figma → code" },
          { text: "consistency without fragmentation", tone: "c3" },
          { text: "accessibility in every theme", tone: "c2" },
          { text: "ai-ready structure", outline: true },
        ],
      },
    },
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
  "design-system-transformation": DriftCase,
  chip: ChipCase,
  "booking-platform": BookingCase,
  "search-experts": SearchCase,
  checkout: CheckoutCase,
  theming: ThemingCase,
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
          article?.mock
            ? article.mock.eyebrow
            : article
            ? `Case · ${sentenceCase(cs.category)} · ${fullYears(cs.year)}`
            : spans(cs.eyebrow ?? `${sentenceCase(cs.category)} · ${cs.year}`)
        }
        title={article ? article.title : cs.title}
        accent={article?.accent}
        after={article?.after}
        subhead={cs.summary ?? cs.description}
        readingMinutes={readingMinutes}
        tags={cs.tags}
        /* every case opens with "← All work" (W1 release, 22 Sep 2026),
           the mock-built cases included */
        endReveal={article?.mock ? false : undefined}
        glance={Boolean(article?.mock)}
        className={article?.mock ? "cs2--mock" : undefined}
        heroExtra={
          article?.mock ? (
            <div className={article.mock.signals.label ? "case-hero__signals" : "case-hero__signals case-hero__signals--bare"}>
              {article.mock.signals.label ? <p className="case-hero__signals-meta">{article.mock.signals.label}</p> : null}
              <div className="case-hero__tags">
                {article.mock.signals.tags.map((t) => (
                  <Tag key={t.text} tone={t.tone} outline={t.outline}>
                    {t.text}
                  </Tag>
                ))}
              </div>
            </div>
          ) : undefined
        }
        facts={
          article && (!article.lead || article.mock)
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
