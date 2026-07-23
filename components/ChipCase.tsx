"use client";
/* client boundary like CodeFirstV2: passing the readiness-map rows
   array through a server->client slot trips React's dev key
   validation (false positive, every map inside is keyed); rendering
   the composition client-side like the worked reference clears it */

import CaseBeat from "@/components/CaseBeat";
import CaseCard from "@/components/CaseCard";
import CasePlaceholder from "@/components/CasePlaceholder";
import ChipReadinessMap from "@/components/ChipReadinessMap";
import SectionHeader from "@/components/ui/SectionHeader";
import { P, Scannable } from "@/components/CaseProse";
import { WORK_ITEMS } from "@/lib/workLibrary";
import type { CaseStudy } from "@/lib/content";

/**
 * CHIP on the CaseBeat template (case-migration kickoff step 2 of 2,
 * Elleta 23 Jul; worked references CodeFirstV2 / DriftV2). STRUCTURAL
 * MIGRATION, NOT A REWRITE: every rendered sentence is her approved
 * copy from content/case-studies/chip.ts redistributed into four
 * beats; the one mechanical split (the approach paragraph, at her
 * "Then I wired" sentence boundary) is cited below; every NEW word a
 * slot needs is marked TODO(elleta). Visuals: the three evidence
 * figures and the ChipReadinessMap (the kickoff's named reuse; its
 * built-in approve interaction ships as-is, no new gizmos).
 *
 * Beat map (headlines = her decision titles / lessons close,
 * keylines = her why lines / lessons lead, all verbatim):
 * 01 the judgment layer -> 02 my own systems -> 03 in public ->
 * 04 the machine.
 */

/* kickers: mechanical extractions of her own phrases ("the judgment
   layer", "my own systems", "building in public", "let it change the
   machine"). TODO(elleta): confirm all four. */
const KICKERS = ["The judgment layer", "My own systems", "In public", "The machine"];

/* the approach paragraph splits at her sentence boundary: the course
   + own-systems sentences tell beat 02, the CHIP-wiring + governing
   decision sentences tell beat 01. Cited mechanical split, no words
   changed. */
const WIRE_SENTENCE = "Then I wired the readiness map into CHIP";

/* lessons: sentence 2 is beat 04's display headline, sentence 1 its
   keyline, both verbatim */
const LESSONS_KEYLINE =
  "The hard part of agent-ready design systems isn't the tokens, it's keeping a human in control while the machine moves fast.";
const LESSONS_HEADLINE =
  "The best thing I did with a course wasn't take notes, it was let it change the machine.";

type FigureBlock = { kind: string; src: string; alt: string; caption?: string };

export default function ChipCase({ cs }: { cs: CaseStudy }) {
  const summary = cs.blocks?.find((b) => b.kind === "summary") as
    | { context: string; approach: string; outcome: string }
    | undefined;
  const decision = (index: string) =>
    cs.blocks?.find((b) => b.kind === "decision" && (b as { index?: string }).index === index) as
      | { title: string; why?: string; evidence?: { kind: string; rows?: unknown } }
      | undefined;
  const d1 = decision("01");
  const d2 = decision("02");
  const d3 = decision("03");
  const figures = (cs.blocks?.filter((b) => b.kind === "figure") ?? []) as FigureBlock[];
  const figure = (key: string) => figures.find((f) => f.src.includes(key));
  const inboxFig = figure("approve-inbox");
  const systemMapFig = figure("system-map");
  const frictionFig = figure("friction-log");
  const mapRows = (d1?.evidence?.kind === "readinessMap" ? d1.evidence.rows : undefined) as
    | Parameters<typeof ChipReadinessMap>[0]["rows"]
    | undefined;
  const paragraphs = (cs.blocks?.filter((b) => b.kind === "paragraph") ?? []) as { text: string }[];
  const constraints = paragraphs.find((p) => p.text.startsWith("Constraints:"))?.text ?? "";
  const credit = paragraphs.find((p) => p.text.startsWith("Credit:"))?.text ?? "";
  /* the cited approach split (WIRE_SENTENCE) */
  const approach = summary?.approach ?? "";
  const wireAt = approach.indexOf(WIRE_SENTENCE);
  const approachOwnSystems = wireAt >= 0 ? approach.slice(0, wireAt).trim() : approach;
  const approachGoverning = wireAt >= 0 ? approach.slice(wireAt).trim() : "";
  const nextItem = WORK_ITEMS.find((i) => i.id === "code-first"); /* the three stars loop: chip -> code-first -> drift -> chip */

  const fig = (f?: FigureBlock) =>
    f ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={f.src}
        alt={f.alt}
        loading="lazy"
        style={{ width: "100%", height: "auto", borderRadius: "var(--radius-xl)", display: "block" }}
      />
    ) : (
      <CasePlaceholder />
    );

  return (
    <div className="cs2-body-col">
      {/* 01 · the judgment layer: the governing decision; the approve
          inbox is the watch/catch/draft/approve/log UI itself */}
      <CaseBeat
        index="01"
        kicker={KICKERS[0]}
        headline={d1?.title ?? ""}
        keyline={d1?.why}
        id="chip-b1"
        body={
          <>
            <Scannable text={summary?.context ?? ""} />
            <Scannable text={approachGoverning} />
          </>
        }
        visual={fig(inboxFig)}
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>{inboxFig?.caption}</p>}
      />

      {/* 02 · my own systems: the inspection pointed inward; the
          readiness map IS the evidence (kickoff's named reuse, its
          approve loop intact) */}
      <CaseBeat
        index="02"
        kicker={KICKERS[1]}
        headline={d2?.title ?? ""}
        keyline={d2?.why}
        id="chip-b2"
        flip
        body={<Scannable text={approachOwnSystems} />}
        visual={mapRows ? <ChipReadinessMap rows={mapRows} /> : <CasePlaceholder />}
      />

      {/* 03 · in public: the honest prototype; the friction log kept
          in the open */}
      <CaseBeat
        index="03"
        kicker={KICKERS[2]}
        headline={d3?.title ?? ""}
        keyline={d3?.why}
        id="chip-b3"
        body={
          <>
            <Scannable text={summary?.outcome ?? ""} />
            <P text={constraints} />
          </>
        }
        visual={fig(frictionFig)}
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>{frictionFig?.caption}</p>}
      />

      {/* 04 · the machine: the lessons close over the system map;
          credit line as the body (the course that changed the machine) */}
      <CaseBeat
        index="04"
        kicker={KICKERS[3]}
        headline={LESSONS_HEADLINE}
        keyline={LESSONS_KEYLINE}
        id="chip-b4"
        flip
        body={<P text={credit} />}
        visual={fig(systemMapFig)}
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>{systemMapFig?.caption}</p>}
      />

      {/* next case: the ONE surviving card, the three stars in a loop */}
      {nextItem && (
        <section className="cs2-beat cs2-nextcase" aria-label="Next case">
          <SectionHeader label="Next case" tier="case" title={nextItem.title} className="cs2-screen__head" />
          <div className="cs2-next">
            <CaseCard item={nextItem} />
          </div>
        </section>
      )}
    </div>
  );
}
