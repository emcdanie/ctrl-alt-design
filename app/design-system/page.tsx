import type { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseShellV2 from "@/components/CaseShellV2";
import BellaSpine, { HeroStats } from "@/components/BellaSpine";
import { auditCount, spellCount } from "@/lib/bella/gate";

export const metadata: Metadata = {
  title: "BELLA, the system behind this site",
  description:
    "BELLA is my open design system, and it runs this site: how I make one, who decides, where AI helps, and the gate that stops drift from shipping.",
};

/* The System page renders through the case shell (CaseStudyLayout ->
   CaseShellV2), with no work-library row: audit:parity requires slugs
   and WORK_ITEMS rows to be 1:1, so a BELLA row would fail it. Rebuilt
   from system-page-mock.html (Elleta, 22 Sep 2026, W1 release). */
const SLUG = "bella";

export default function DesignSystemPage() {
  /* every number this page states is derived at build, never typed */
  const audits = auditCount();

  return (
    <CaseStudyLayout>
      <CaseShellV2
        slug={SLUG}
        eyebrow="System · BELLA"
        title="A design system people trust"
        accent="and AI can build with"
        subhead="BELLA is my open design system, and it runs the site you're reading."
        lead="BELLA is my open design system, and it runs the site you're reading. This page shows how I make one: who decides, where AI helps, and what stops drift from shipping."
        readingMinutes={6}
        tags={[]}
        endReveal={false}
        /* System is its own nav item, not reached through /work */
        crumbs={false}
        identity={{ text: "var(--case-clarity-text)", hi: "var(--case-clarity-hi)" }}
        heroExtra={<HeroStats auditCount={audits} />}
      >
        <BellaSpine auditCount={audits} auditCountWord={spellCount(audits)} />
      </CaseShellV2>
    </CaseStudyLayout>
  );
}
