import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { WorkIndex } from "@/components/WorkLibrary";
import { WorkScrollMemory } from "@/components/CaseBackLink";

export const metadata: Metadata = {
  title: "Work, Elleta McDaniel",
  description:
    "Case studies from real teams: what I claimed, what proves it, and what changed.",
};

/* Work: the hero and the case index. The pattern studies left /work on
   22 Sep 2026 (W1 release); their pages stay live, unlinked. The shared
   footer carries the contact. WorkScrollMemory keeps the scroll so
   "← All work" on a case can put the reader back. */
export default function WorkPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen">
      <OverlayNav />

      {/* the index (Geist refresh, 22 Sep 2026): Part A of the case-study
          mock, five rows */}
      <Section id="work-hero" labelledBy="work-hero-title">
        <SectionHeader
          as="h1"
          id="work-hero-title"
          kicker="Work"
          heading="Selected work."
          lead="Each one says what I claimed, what proves it, and what changed. Tags show the signals it's evidence for."
        />
        <WorkIndex />
      </Section>

      <WorkScrollMemory />
    </main>
  );
}
