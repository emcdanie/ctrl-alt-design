import { notFound } from "next/navigation";
import { getCaseStudy, getAllSlugs } from "@/lib/content";
import { findWorkItemBySlug } from "@/lib/workLibrary";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseShellV2 from "@/components/CaseShellV2";
import CodeFirstV2 from "@/components/CodeFirstV2";
import DriftV2 from "@/components/DriftV2";
import ChipCase from "@/components/ChipCase";
import type { CaseStudy } from "@/lib/content";

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

  /* reading time, mechanical: every narrative string in the content
     file at 200 wpm, rounded up */
  const words = JSON.stringify(cs.blocks ?? [])
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  return (
    <CaseStudyLayout>
      <div className="layout-container">
        <CaseShellV2
          slug={slug}
          eyebrow={cs.eyebrow ?? `${cs.category} · ${cs.year}`}
          title={cs.title}
          subhead={cs.summary ?? cs.description}
          readingMinutes={readingMinutes}
          tags={cs.tags}
        >
          <Composition cs={cs} />
        </CaseShellV2>
      </div>
    </CaseStudyLayout>
  );
}
