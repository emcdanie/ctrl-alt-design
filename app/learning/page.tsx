import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Term from "@/components/ui/Term";
import LearningLibrary, { DateLabel, TypePill, UsedIn } from "@/components/LearningLibrary";
import VoicesNetwork from "@/components/VoicesNetwork";
import { CERTIFICATES, COUNTS, LEARNING, NEXT_UP } from "@/content/learning";
import styles from "@/components/Learning.module.css";

export const metadata: Metadata = {
  title: "Learning, Elleta McDaniel",
  description:
    "Where I learned it, where I used it: the courses, certificates, workshops and reading behind my work, and the projects where they paid off.",
};

/* /learning (specs/learning, replaces /skills): the opening, the
   library, the people I follow, and where I showed up. Stats and every
   count read COUNTS in content/learning.ts (one source).

   The hero (Elleta, 20 Sep 2026): text left, bella-curious right and
   centred on it. Under the h1 sit the lead, the stats line, what is
   next, and ONE quiet line of certificates in the code role. The four
   pill badges it replaces looked like buttons, were not, and truncated
   their titles; the line uses each certificate's short name and ends in
   a real link, "+6 →", that filters the library to Certificate. */

const STATS = [
  [COUNTS.certificates, "certificates"],
  [COUNTS.coursesAndWorkshops, "courses and workshops"],
  [COUNTS.conferences, "conferences"],
  [COUNTS.hackathons, "hackathons"],
  [COUNTS.reading, "pieces of reading"],
  [COUNTS.projects, "projects it shows up in"],
].filter(([n]) => (n as number) > 0) as [number, string][];
/* the newest four by short name, then a link to the rest */
const SHOWN = CERTIFICATES.slice(0, 4);
const MORE = CERTIFICATES.length - SHOWN.length;
const EVENTS = LEARNING.filter((e) => ["Conference", "Workshop", "Hackathon"].includes(e.type)).sort(
  (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
);

export default function LearningPage() {
  return (
    <main id="main-content" className={`page-shell min-h-screen ${styles.page}`}>
      <OverlayNav />

      <Section id="learning-hero" labelledBy="learning-hero-title">
        <SectionHeader
          as="h1"
          id="learning-hero-title"
          kicker="Learning"
          heading="Where I learned it, where I"
          accent={<Term id="used" />}
          after=" it."
          lead="Everything I know has a source and a use. Here's both: the courses, workshops and reading behind my work, and the projects where they paid off."
          figure={
            <figure
              className="section-figure"
              style={{ "--header-figure-shape": "url(/images/bella/set/bella-reading.webp)", "--header-figure-w": "36%" } as React.CSSProperties}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="section-figure__art"
                src="/images/bella/set/bella-reading.webp"
                alt="Bella the papillon reading an open book."
                width={960}
                height={900}
              />
            </figure>
          }
        >
          <p className={`text-code ${styles.stats}`}>
            {STATS.map(([n, label]) => (
              <span key={label} className={styles["stat-meta"]}>
                <b>{n}</b> {label}
              </span>
            ))}
          </p>
          {NEXT_UP && <p className={`text-code ${styles["next-up-meta"]}`}>Next up: {NEXT_UP}</p>}
          <p className={`text-code ${styles.certs}`}>
            Certificates:{" "}
            {SHOWN.map((e, i) => (
              <Fragment key={e.id}>
                {i > 0 ? " · " : null}
                {e.short ?? e.title}
              </Fragment>
            ))}
            {MORE > 0 && (
              <>
                <span aria-hidden="true"> · </span>
                <Link className={styles.certsMore} href="/learning?type=certificate#library">
                  +{MORE}<span className="sr-only"> more certificates</span> <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </p>
        </SectionHeader>
      </Section>

      <Section id="library" label="The library">
        <SectionHeader
          heading="Everything,"
          accent="findable"
          after="."
          lead="Filter by type or topic, then switch the view."
        />
        {/* useSearchParams requires a Suspense boundary */}
        <Suspense fallback={null}>
          <LearningLibrary />
        </Suspense>
      </Section>

      <Section id="who-i-follow" label="Who I follow">
        <SectionHeader
          heading="The people I"
          accent="learn"
          after=" from."
          lead="Twelve voices I read closely, and how their ideas connect. Click a name for the piece, the line that stuck, and where it shaped my work."
        />
        <VoicesNetwork />
      </Section>

      <Section id="out-in-the-world" label="Out in the world">
        <SectionHeader
          heading="Where I"
          accent="showed up"
          after="."
          lead="Conferences, workshops and hackathons: the rooms where the reading turned into conversations."
        />
        <ul className={styles.events}>
          {EVENTS.map((e) => (
            <li key={e.id}>
              <article className={styles.eventCard}>
                <p className={styles.meta}>
                  <TypePill entry={e} />
                  <DateLabel entry={e} />
                </p>
                <h3 className={`heading-item ${styles.eventTitle}`}>{e.title}</h3>
                <p className={styles["event-meta"]}>{e.from}</p>
                {e.took && <p className={styles.eventTook}>{e.took}</p>}
                {e.usedIn.length > 0 && (
                  <p className={styles.eventUsed}>
                    <UsedIn ids={e.usedIn} />
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
