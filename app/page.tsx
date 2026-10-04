import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import ProofLine from "@/components/ProofLine";
import CaseRow from "@/components/CaseRow";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { TextLink } from "@/components/ui/TextLink";
import { HOME_LEAD } from "@/content/cases";
import { HOME_PROOF } from "@/lib/copy";
import { TESTIMONIALS } from "@/content/testimonials";
import caseStyles from "@/components/WorkLibrary.module.css";
import styles from "@/components/Home.module.css";

/* Home · v2 (Gate 2, 3 Oct 2026; Figma "Home · v2"), hero v3 (Elleta,
   4 Oct 2026): the designer and code hero, the proof row (18d), the
   quote card, the lead
   three as cards (Drift featured), the system beat, then the site
   footer (the Home closing card is retired). The anatomy specimen joins
   the system section once AtlasSpecimen is on main. */

/* the one sentence around the bold phrase, verbatim from the source */
const QUOTE = TESTIMONIALS[0];
const SENTENCE = QUOTE.quote.split(" … ").find((s) => s.includes(QUOTE.bold)) ?? QUOTE.quote;
const [BEFORE, AFTER] = SENTENCE.split(QUOTE.bold);

const [FEATURED, ...PAIR] = HOME_LEAD;

export default function Home() {
  return (
    <main id="main-content" className="site-ground-page">
      <OverlayNav />
      <Hero />

      {/* the proof row (18d, 4 Oct 2026): quiet, no box, no label */}
      <Section id="proof" flushBottom="Home proof row: equal gaps either side (Elleta, 4 Oct 2026)">
        <div className={styles.proof}>
          {HOME_PROOF.map((p) => (
            <ProofLine key={p.label} label={p.label} line={p.line} href={p.href} />
          ))}
        </div>
      </Section>

      <Section id="word-of-mouth" label="Word of mouth">
        <figure className={styles.quote}>
          <span className={`${styles.mark} pattern-mark`} aria-hidden="true">
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
            <TextLink href="/about#word-of-mouth">
              More on About <span aria-hidden="true">→</span>
            </TextLink>
          </figcaption>
        </figure>
      </Section>

      <Section id="selected-work" label="Selected work">
        <SectionHeader
          heading="Start with the"
          accent="work"
          after="."
          lead="Three cases, up close: what drifted, what I built, and what changed."
        />
        <div className={styles.cases}>
          <CaseRow row={FEATURED} layout="featured" />
          <div className={caseStyles.cardPair}>
            {PAIR.map((row) => (
              <CaseRow key={row.id} row={row} layout="card" />
            ))}
          </div>
          <p className={styles.more}>
            <TextLink href="/work">
              See all work <span aria-hidden="true">→</span>
            </TextLink>
          </p>
        </div>
      </Section>

      <Section id="how-i-work" label="How I work">
        <SectionHeader
          heading="The system behind the"
          accent="site"
          after="."
          lead="This site runs on BELLA, my own design system."
        />
        <p className={styles.links}>
          <TextLink href="/design-system">
            Inspect BELLA <span aria-hidden="true">→</span>
          </TextLink>
          <TextLink href="/learning">
            Where I learned it <span aria-hidden="true">→</span>
          </TextLink>
        </p>
      </Section>
    </main>
  );
}
