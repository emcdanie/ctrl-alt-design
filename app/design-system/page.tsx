import type { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseShellV2 from "@/components/CaseShellV2";
import BellaSpine from "@/components/BellaSpine";
import { auditCount, auditFiles, spellCount } from "@/lib/bella/gate";

export const metadata: Metadata = {
  title: "BELLA, the system behind this site",
  description:
    "The design system behind elleta.design: tokens, type, controls, and the governance gate, with every value read live from the running stylesheet.",
};

/* ── ON THE REAL CASE SHELL (migration, 27 Jul 2026) ──
   This page is a case study of BELLA, so it renders through the SAME
   path every case route uses:

     CaseStudyLayout -> .layout-container -> CaseShellV2 -> CaseBeats

   It used to use the case COMPONENTS inside a bespoke page shell with
   its own rail and its own bands, which is why CaseBeat had no gutter,
   why the page had four different left edges, and why no two sections
   shared a structure. The shell is not forked and there is no
   system-page variant: CaseShellV2 optional-chains its work-library
   lookup throughout, so a slug with no WORK_ITEMS row degrades cleanly.

   The slug deliberately has NO registry row. audit:parity requires
   case-study slugs and WORK_ITEMS rows to be 1:1 in BOTH directions, so
   adding one for BELLA would fail the gate. */
const SLUG = "bella";

export default function DesignSystemPage() {
  /* every number this page states is derived at build, never typed */
  const audits = auditCount();

  return (
    <CaseStudyLayout>
      <div className="layout-container">
        <CaseShellV2
          slug={SLUG}
          eyebrow="An explorable explanation"
          title="BELLA, the system behind this site"
          subhead="A design system is only as useful to an AI as it is readable by a machine. This is that argument, demonstrated on the system running the page you are reading."
          readingMinutes={6}
          tags={["Design systems", "AI-enabled design", "Governance"]}
          /* not reached through /work: System is its own primary nav item
             (section 1b), so a back-to-Work crumb pointed somewhere the
             reader had not been. Every real case keeps its crumb. */
          crumbs={false}
          /* the clarity pair, which this page ALREADY treats as its
             identity: the frontier accent on the maturity radar and the
             Teenage badges. No new colour is invented, and no WORK_ITEMS
             row is added, which audit:parity would refuse. */
          identity={{ text: "var(--case-clarity-text)", hi: "var(--case-clarity-hi)" }}
        >
          <BellaSpine
            auditCount={audits}
            auditCountWord={spellCount(audits)}
            auditFiles={auditFiles()}
          />
        </CaseShellV2>
      </div>
    </CaseStudyLayout>
  );
}
