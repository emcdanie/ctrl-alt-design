import CaseBeat from "@/components/CaseBeat";
import CaseCard from "@/components/CaseCard";
import CasePlaceholder from "@/components/CasePlaceholder";
import CaseArtifactEmbed from "@/components/CaseArtifactEmbed";
import DriftFoundationOutcome from "@/components/DriftFoundationOutcome";
import ScaledFrame from "@/components/ScaledFrame";
import SectionHeader from "@/components/ui/SectionHeader";
import { P, Scannable, para } from "@/components/CaseProse";
import { WORK_ITEMS } from "@/lib/workLibrary";
import type { CaseStudy } from "@/lib/content";

/**
 * From Drift to Foundation on the CaseBeat template (case-migration
 * kickoff, Elleta 23 Jul; the worked reference is CodeFirstV2).
 * STRUCTURAL MIGRATION, NOT A REWRITE: every rendered sentence is her
 * existing approved copy from content/case-studies/
 * design-system-transformation.ts restructured into four beats;
 * cited mechanical trims are commented at their site; every NEW word
 * a slot needs is marked TODO(elleta). Visuals are STATIC: the
 * case's recreated embeds and poster still; the outcome beat now carries
 * the recreated before/after maturity map (illustrative).
 *
 * Beat map (headlines = her decision titles / outcome statement,
 * keylines = her why lines / lessons lead, all verbatim; kickers and
 * trims approved at the PR 56 review, Elleta 23 Jul):
 * 01 the audit -> 02 the cascade -> 03 the governance -> 04 the foundation.
 * TODO(elleta): the beat-04 real-outcome line (NEW_OUTCOME) is draft copy.
 */

/* kickers approved (Elleta, 23 Jul, PR 56 review): audit / cascade /
   governance are her words; "The foundation" echoes the case title
   and beat 04's outcome. */
const KICKERS = ["The audit", "The cascade", "The governance", "The foundation"];

export default function DriftV2({ cs }: { cs: CaseStudy }) {
  const summary = cs.blocks?.find((b) => b.kind === "summary") as
    | { context: string; approach: string; outcome: string }
    | undefined;
  const disclosure = cs.blocks?.find((b) => b.kind === "disclosure") as { text: string } | undefined;
  const lessons = cs.blocks?.find((b) => b.kind === "lessons") as { text: string } | undefined;
  const decision = (index: string) =>
    cs.blocks?.find((b) => b.kind === "decision" && (b as { index?: string }).index === index) as
      | { title: string; why?: string; evidence?: { src: string; title: string; designWidth: number; designHeight: number } }
      | undefined;
  const d1 = decision("01");
  const d2 = decision("02");
  const d3 = decision("03");
  /* her outcome statement (bold lead) is beat 04's headline; the rest
     of the outcome is body. Markers strip mechanically. */
  const outcomeLead = "A shared language for how the product should look, behave, and grow.";
  /* the REAL outcome that closes the impact gap, rendered as the beat-04
     lead paragraph. NEW draft copy, TODO(elleta): finalise the words.
     NDA-safe: abstract, no client name, no codename, no figures. */
  const NEW_OUTCOME =
    "The audit and the business case won investment for a dedicated design-systems team. The system became the foundation the larger team built on: the surface evolved, the components and the agreements held.";
  const outcomeRest = (summary?.outcome ?? "")
    .replace(/\*\*/g, "")
    .replace(outcomeLead, "")
    .replace(NEW_OUTCOME, "")
    .trim();
  /* lessons: first sentence is the keyline, verbatim; the rest is body */
  const lessonsKeyline =
    "Inconsistency is rarely the root problem, it is a symptom of missing structure and undocumented decisions.";
  const lessonsRest = (lessons?.text ?? "").replace(lessonsKeyline, "").trim();
  const nextItem = WORK_ITEMS.find((i) => i.id === "chip"); /* the three stars loop: chip -> code-first -> drift -> chip */

  return (
    <div className="cs2-body-col">
      {/* the NDA disclosure, her wording verbatim, quiet note before the beats */}
      {disclosure && (
        <p
          role="note"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-base)",
            lineHeight: 1.6,
            color: "var(--color-ink-soft)",
            borderLeft: "3px solid var(--color-border-medium)",
            paddingLeft: "var(--spacing-4)",
            margin: "0 0 var(--spacing-8)",
          }}
        >
          {disclosure.text}
        </p>
      )}

      {/* 01 · the audit: context + the audit decision. The visual is the
          INTERACTIVE recreated client surface (drift specimen), embedded
          live at the column's real width; it renders revealed and carries
          its own Before / On system toggle, so the beat has no control
          slot. The ctrl+travel links now sit under the body copy. */}
      <CaseBeat
        index="01"
        kicker={KICKERS[0]}
        headline={d1?.title ?? ""}
        keyline={d1?.why}
        id="drift-b1"
        body={
          <>
            <Scannable text={summary?.context ?? ""} />
            <Scannable text={para(cs, (b) => b.kind === "decision" && (b as { index?: string }).index === "01", 0)} />
            {/* her approach summary closes the beat: the upstream pivot */}
            <Scannable text={summary?.approach ?? ""} />
            {/* the ctrl+travel recreations from the case's demo links,
                moved under the body copy (Elleta, 24 Jul) */}
            <div className="drift-audit-links">
              {cs.demoLinks?.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="demo-link">
                  {l.label}
                </a>
              ))}
            </div>
          </>
        }
        visual={
          <CaseArtifactEmbed
            src="/demos/case-study-visuals/drift-specimen.html?embed=1"
            title="Recreated client surface: five UI parts in Before and On system states, with an audit annotation layer"
            channel="drift-specimen"
          />
        }
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>Recreated concept, illustrative. A B2B travel platform, abstracted.</p>}
      />

      {/* 02 · the cascade: tokens under everything. The visual is now the
          INTERACTIVE token pipeline (foundation -> semantic -> component,
          live propagation + the broken-link drift), embedded live at the
          column's real width; supersedes the static poster. Her decision
          -02 paragraph names "the interactive recreation below", which is
          now literally true, so the CASCADE_TRIM is gone. */}
      <CaseBeat
        index="02"
        kicker={KICKERS[1]}
        headline={d2?.title ?? ""}
        keyline={d2?.why}
        id="drift-b2"
        flip
        body={
          <>
            <Scannable
              text={para(cs, (b) => b.kind === "decision" && (b as { index?: string }).index === "02", 0)}
            />
            {/* TODO(elleta): optional affordance hint, her call to keep or cut */}
            <P text="**Change the foundation and watch it move. Break the link and watch it drift.**" />
          </>
        }
        visual={
          <CaseArtifactEmbed
            src="/demos/case-study-visuals/cascade.html?embed=1"
            title="Recreated token pipeline: foundation, semantic and component tiers with live propagation and a design-code parity check"
            channel="cascade"
          />
        }
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>Recreated concept, illustrative. A B2B travel platform&apos;s design system, abstracted.</p>}
      />

      {/* 03 · the governance: status not enforcement; the recreated
          system documentation as the visual */}
      <CaseBeat
        index="03"
        kicker={KICKERS[2]}
        headline={d3?.title ?? ""}
        keyline={d3?.why}
        id="drift-b3"
        body={
          <Scannable text={para(cs, (b) => b.kind === "decision" && (b as { index?: string }).index === "03", 0)} />
        }
        visual={
          d3?.evidence ? (
            <ScaledFrame
              src={d3.evidence.src}
              title={d3.evidence.title}
              designWidth={d3.evidence.designWidth}
              designHeight={d3.evidence.designHeight}
            />
          ) : (
            <CasePlaceholder />
          )
        }
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>{d3?.evidence?.title}</p>}
      />

      {/* 04 · the takeaway: her outcome statement leads, the real outcome
          (NEW_OUTCOME, TODO(elleta)) opens the body, lessons close. Visual
          is now the OUTCOME VISUAL (in-page, tokenised to BELLA,
          dark-adaptive): an outcome hero + a qualitative Before -> After
          of what changed. Supersedes the static maturity-map embed. */}
      <CaseBeat
        index="04"
        kicker={KICKERS[3]}
        headline={outcomeLead}
        keyline={lessonsKeyline}
        id="drift-b4"
        flip
        body={
          <>
            <P text={NEW_OUTCOME} />
            <P text={outcomeRest} />
            <Scannable text={lessonsRest} />
          </>
        }
        visual={<DriftFoundationOutcome />}
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>Recreated concept, illustrative. A B2B travel platform, abstracted; no client figures shown.</p>}
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
