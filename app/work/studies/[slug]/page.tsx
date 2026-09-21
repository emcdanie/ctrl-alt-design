import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OverlayNav from "@/components/OverlayNav";
import Breadcrumb from "@/components/Breadcrumb";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { BRIEF_CREDIT, STUDIES, findStudy, type StudyBrief, type StudySection } from "@/content/studies";
import styles from "@/components/WorkLibrary.module.css";

/* A course-brief study (Elleta, 19 Sep 2026): one template. Sections run
   in a fixed order and drop out when empty; a draft section stays hidden
   until Elleta approves it. Never a placeholder. */

const ORDER: { key: keyof StudyBrief; heading: string }[] = [
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
        {/* three levels deep, so a breadcrumb rather than a page label
            (Part G): Work / Pattern studies / this brief */}
        <Breadcrumb
          trail={[
            { label: "Work", href: "/work" },
            { label: "Pattern studies", href: "/work#studies" },
            { label: study.title },
          ]}
        />
        <SectionHeader
          as="h1"
          id="study-hero-title"
          heading={study.title}
          lead={`${study.project}. ${study.line}`}
        >
          {/* Part G: the breadcrumb is the label, so the year and kind
              sit under the lead rather than stacking above the h1 */}
          <p className="text-code">
            {study.year} / {study.kind}
          </p>
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

    </main>
  );
}
