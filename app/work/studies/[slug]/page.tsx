import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { BRIEF_CREDIT, STUDIES, findStudy, type StudyBrief, type StudySection } from "@/content/studies";
import styles from "@/components/WorkLibrary.module.css";

/* A course-brief study (Elleta, 19 Sep 2026): one template. Sections run
   in a fixed order and drop out when empty; a draft section stays hidden
   until Elleta approves it. Never a placeholder. */

const ORDER: { key: Exclude<keyof StudyBrief, "walkthrough">; heading: string }[] = [
  { key: "brief", heading: "The brief" },
  { key: "constraints", heading: "Constraints" },
  { key: "framing", heading: "How I framed it" },
  { key: "decisions", heading: "Decisions and trade-offs" },
  { key: "skipped", heading: "What I skipped, and why" },
  { key: "ai", heading: "Where AI helped, and where it didn't" },
  { key: "next", heading: "What I'd change next" },
];

const shows = (s?: StudySection): s is StudySection => !!s && !s.draft && s.paragraphs.length > 0;

export function generateStaticParams() {
  return STUDIES.filter((s) => s.page).map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const study = findStudy((await params).slug);
  if (!study) return {};
  return { title: `${study.title}, Elleta McDaniel`, description: `${study.project}. ${study.line}` };
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = findStudy((await params).slug);
  if (!study?.page) notFound();
  const page = study.page;
  const sections = ORDER.filter(({ key }) => shows(page[key]));

  return (
    <main id="main-content" className="page-shell min-h-screen">
      <OverlayNav />

      <Section id="study-hero" labelledBy="study-hero-title">
        <p className={`text-code ${styles.heroNote}`}>
          <Link href="/work#studies" className={styles.back}>
            ← Pattern studies
          </Link>{" "}
          · {study.year} / {study.kind}
        </p>
        <SectionHeader as="h1" id="study-hero-title" heading={study.title} lead={`${study.project}. ${study.line}`}>
          {study.demo ? (
            <p>
              <a href={study.demo} className={styles.more}>
                Try the demo →
              </a>
            </p>
          ) : null}
        </SectionHeader>
      </Section>

      {sections.map(({ key, heading }) => (
        <Section key={key} id={`study-${key}`} labelledBy={`study-${key}-title`}>
          <SectionHeader id={`study-${key}-title`} heading={heading}>
            {page[key]!.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {key === "brief" ? <p>{BRIEF_CREDIT}</p> : null}
          </SectionHeader>
        </Section>
      ))}

      {page.walkthrough ? (
        <Section id="study-walkthrough" labelledBy="study-walkthrough-title">
          <SectionHeader id="study-walkthrough-title" heading="Walkthrough">
            <div className={styles.video}>
              <iframe
                src={page.walkthrough.embed}
                title={`Walkthrough: ${study.project}`}
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
            <p>{page.walkthrough.about}</p>
          </SectionHeader>
        </Section>
      ) : null}
    </main>
  );
}
