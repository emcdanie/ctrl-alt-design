import type { Metadata } from "next";
import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { CaseStudyCard, StudiesList } from "@/components/WorkLibrary";
import { WORK_CASES } from "@/lib/workLibrary";
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

      <Section id="work-hero" labelledBy="work-hero-title">
        <p className={`text-code ${styles.heroNote}`}>{"// the work"}</p>
        <SectionHeader
          as="h1"
          id="work-hero-title"
          heading="Work that holds its"
          accent="shape"
          after="."
          lead="Case studies from real teams, plus pattern studies where I take one hard UI problem and work it through."
        />
      </Section>

      <Section id="case-studies" label="Case studies">
        <SectionHeader
          heading="Three systems,"
          accent="up close"
          after="."
          lead="Real teams, real drift. What I found, what I built, what changed."
        />
        <div className="card-grid">
          {WORK_CASES.map((c) => (
            <CaseStudyCard key={c.id} item={c} />
          ))}
        </div>
      </Section>

      <Section id="studies" label="Pattern studies">
        <div className={styles.studiesSplit}>
          <div className={styles.studiesHead}>
            <SectionHeader
              layout="stacked"
              heading="One problem,"
              accent="worked through"
              after="."
              lead="Four started as course briefs from Vitaly Friedman's Smart Interface Design Patterns training. The rest are hackathon builds and tools I made for myself."
            >
              <p>
                <Link href="/learning" className={styles.more}>
                  Where these came from →
                </Link>
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`illo ${styles.skate}`}
                src="/images/bella/set/bella-skate.webp"
                alt="Illustration of Bella riding a skateboard"
                width={340}
                height={340}
              />
            </SectionHeader>
          </div>
          <StudiesList />
        </div>
      </Section>
    </main>
  );
}
