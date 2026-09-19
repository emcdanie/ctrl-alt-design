import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Term from "@/components/ui/Term";
import LearningLibrary, { DateLabel, TypePill, UsedIn } from "@/components/LearningLibrary";
import VoicesNetwork from "@/components/VoicesNetwork";
import { LEARNING, NEXT_UP, isCertificate } from "@/content/learning";
import styles from "@/components/Learning.module.css";

export const metadata: Metadata = {
  title: "Learning, Elleta McDaniel",
  description:
    "Where I learned it, where I used it: the courses, certificates, workshops and reading behind my work, and the projects where they paid off.",
};

/* /learning (specs/learning, replaces /skills): the opening, the
   library, the people I follow, and where I showed up. Stats and badges
   are computed from content/learning.ts. */

const count = (types: string[]) => LEARNING.filter((e) => types.includes(e.type)).length;
const CERTS = LEARNING.filter(isCertificate);
const PROJECTS = new Set(LEARNING.flatMap((e) => e.usedIn));
const STATS = [
  [CERTS.length, "certificates"],
  [count(["Course", "Workshop"]), "courses and workshops"],
  [count(["Conference"]), "conferences"],
  [count(["Hackathon"]), "hackathons"],
  [count(["Reading"]), "pieces of reading"],
  [PROJECTS.size, "projects it shows up in"],
].filter(([n]) => (n as number) > 0) as [number, string][];
const EVENTS = LEARNING.filter((e) => ["Conference", "Workshop", "Hackathon"].includes(e.type)).sort(
  (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
);

export default function LearningPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen">
      <OverlayNav />

      <Section id="learning-hero" labelledBy="learning-hero-title">
        <SectionHeader
          as="h1"
          id="learning-hero-title"
          heading="Where I learned it, where I"
          accent={<Term id="used" />}
          after=" it."
          lead="Everything I know has a source and a use. Here's both: the courses, workshops and reading behind my work, and the projects where they paid off."
        >
          <p className={`text-code ${styles.stats}`}>
            {STATS.map(([n, label]) => (
              <span key={label} className={styles["stat-meta"]}>
                <b>{n}</b> {label}
              </span>
            ))}
          </p>
          <ul className={styles.badges} aria-label="Certificates">
            {CERTS.map((e) => (
              <li key={e.id}>
                <Link
                  className={styles.badge}
                  href={e.certificateUrl ?? `/learning#entry-${e.id}`}
                  {...(e.certificateUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className={styles.badgeCheck} aria-hidden="true">
                    ✓
                  </span>
                  <span className={styles.badgeText}>
                    <span className={styles.badgeTitle}>{e.title}</span>
                    <span className={styles.badgeIssuer}>{e.from}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles["next-up-meta"]}>
            Next up: <span className={NEXT_UP ? undefined : styles.tbc}>{NEXT_UP ?? "[CHECK]"}</span>
          </p>
        </SectionHeader>
      </Section>

      <Section id="library" label="The library">
        <SectionHeader
          heading="Everything,"
          accent="findable"
          after="."
          lead="Filter by type or topic, then switch the view. The Skills view is the old matrix, now with where I learned each one."
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
