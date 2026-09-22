import type { Metadata } from "next";
import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { StudiesList, WorkIndex } from "@/components/WorkLibrary";
import styles from "@/components/WorkLibrary.module.css";

export const metadata: Metadata = {
  title: "Work, Elleta McDaniel",
  description:
    "Case studies from real teams, plus pattern studies where I take one hard UI problem and work it through.",
};

/* Work (Elleta, 19 Sep 2026, pattern-studies direction): the hero, the
   three case studies, then the pattern studies as one list with a sticky
   head. The shared footer carries the contact. */
export default function WorkPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen">
      <OverlayNav />

      {/* the index (Geist refresh, 22 Sep 2026): Part A of the case-study
          mock, five rows, then the pattern studies as they were */}
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

      <Section id="studies" label="Pattern studies">
        <div className={styles.studiesSplit}>
          <div className={styles.studiesHead}>
            <SectionHeader
              heading="One problem,"
              accent="worked through"
              after="."
              lead={
                <>
                  Four started as course briefs from Vitaly Friedman&apos;s Smart Interface Design Patterns training. The
                  rest are hackathon builds and tools I made for myself.
                </>
              }
            >
              <p>
                <Link href="/learning" className={styles.more}>
                  Where these came from →
                </Link>
              </p>
            </SectionHeader>
          </div>
          <StudiesList />
        </div>
      </Section>
    </main>
  );
}
