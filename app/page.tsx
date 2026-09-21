import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import { CaseStudyCard } from "@/components/WorkLibrary";
import WorkedWith from "@/components/WorkedWith";
import Card from "@/components/ui/Card";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Container from "@/components/layout/Container";
import { WORK_CASES } from "@/lib/workLibrary";
import { TESTIMONIALS } from "@/content/testimonials";
import styles from "@/components/Home.module.css";

/* Home (home rebuild, 19 Sep 2026): hero, the teams row, the three
   cases, three doors into the system, one quote. The shared layout
   renders the closing section and the footer. */

/* the doors: the whole card is the link. A Process door ("How a
   request gets fetched") returns when /process exists. */
const DOORS = [
  { kind: "System", title: "BELLA, inspected live", body: "Tokens, components and the docs an AI can read.", href: "/design-system" },
  { kind: "Learning", title: "Where I learned it", body: "Courses, certificates and the people I follow.", href: "/learning" },
];

/* the one sentence around the bold phrase, verbatim from the source */
const QUOTE = TESTIMONIALS[0];
const SENTENCE = QUOTE.quote.split(" … ").find((s) => s.includes(QUOTE.bold)) ?? QUOTE.quote;
const [BEFORE, AFTER] = SENTENCE.split(QUOTE.bold);

export default function Home() {
  return (
    <main id="main-content">
      <OverlayNav />
      <Hero />

      <div className={styles.logos}>
        <Container>
          <WorkedWith layout="row" label="Worked with" />
        </Container>
      </div>

      <Section id="selected-work" label="Selected work">
        <SectionHeader
          heading="Start with the"
          accent="work"
          after="."
          lead="Four cases, up close: what drifted, what I built, and what changed."
        />
        <div className="home-work-row reveal-group">
          {WORK_CASES.map((c) => (
            <CaseStudyCard key={c.id} item={c} quiet />
          ))}
        </div>
      </Section>

      <Section id="how-i-work" label="How I work">
        <SectionHeader
          heading="The system behind the"
          accent="site"
          after="."
          lead="This site runs on BELLA, my own design system. Pick a door."
        />
        <div className="home-work-row reveal-group">
          {DOORS.map((d) => (
            <Card key={d.kind} href={d.href}>
              <span className={`text-code ${styles.kicker}`}>{d.kind}</span>
              <span className={`heading-item ${styles.title}`}>{d.title}</span>
              <span className={`card-body ${styles.body}`}>{d.body}</span>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="word-of-mouth" label="Word of mouth">
        <figure className={styles.quote}>
          <span className={styles.mark} aria-hidden="true">
            “
          </span>
          <blockquote className={styles.words}>
            <p>
              {BEFORE}
              <strong>{QUOTE.bold}</strong>
              {AFTER}
            </p>
          </blockquote>
          <figcaption className={styles.cite}>
            <b>{QUOTE.name}</b> · {QUOTE.role} ·{" "}
            <Link href="/about#word-of-mouth" className={styles.more}>
              More on About <span aria-hidden="true">→</span>
            </Link>
          </figcaption>
        </figure>
      </Section>
    </main>
  );
}
