import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import CaseRow from "@/components/CaseRow";
import { WORK_CASES } from "@/content/cases";
import caseStyles from "@/components/WorkLibrary.module.css";
import homeStyles from "@/components/Home.module.css";
import { WorkScrollMemory } from "@/components/CaseBackLink";

export const metadata: Metadata = {
  title: "Work, Elleta McDaniel",
  description:
    "Case studies from real teams: what I claimed, what proves it, and what changed.",
};

const [FEATURED, ...REST] = WORK_CASES;

/* Work: the hero and the case cards. The pattern studies left /work on
   22 Sep 2026 (W1 release); their pages stay live, unlinked. The shared
   footer carries the contact. WorkScrollMemory keeps the scroll so
   "← All work" on a case can put the reader back. */
export default function WorkPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen">
      <OverlayNav />

      {/* the cases (Site v3, job 33, 5 Oct 2026): Home's case cards, the
          lead card full width, the other three two up from 900px */}
      <Section id="work-hero" labelledBy="work-hero-title">
        <SectionHeader
          as="h1"
          id="work-hero-title"
          kicker="Work"
          heading="Selected work."
          lead="Each one says what I claimed, what proves it, and what changed. Tags show the signals it's evidence for."
        />
        <div className={homeStyles.cases}>
          <CaseRow row={FEATURED} layout="featured" />
          <div className={caseStyles.cardPair}>
            {REST.map((row) => (
              <CaseRow key={row.id} row={row} layout="card" />
            ))}
          </div>
        </div>
      </Section>

      <WorkScrollMemory />
    </main>
  );
}
