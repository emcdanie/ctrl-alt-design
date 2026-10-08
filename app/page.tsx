import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import ProofCard from "@/components/ProofCard";
import CaseRow from "@/components/CaseRow";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import SystemBeat from "@/components/SystemBeat";
import { TextLink } from "@/components/ui/TextLink";
import { HOME_LEAD } from "@/content/cases";
import { HOME_PROOF } from "@/lib/copy";
import { TESTIMONIALS } from "@/content/testimonials";
import caseStyles from "@/components/WorkLibrary.module.css";
import styles from "@/components/Home.module.css";

/* Home · v2 (Gate 2, 3 Oct 2026; Figma "Home · v2"), hero v3 (Elleta,
   4 Oct 2026): the designer and code hero, the proof row (18d), the
   lead three as cards (Federated featured, Elleta 8 Oct 2026), the
   quotes after the work, the system beat, then the site footer (the Home closing card is retired). The anatomy
   specimen joins the system section once AtlasSpecimen is on main. */

/* the one sentence around the bold phrase, verbatim from the source */
const QUOTE = TESTIMONIALS[0];
/* the pair under it (H4, the 4 Oct map): Mario Mezini and Ian Frost,
   whole quotes, verbatim */
const PAIR_QUOTES = ["Mario Mezini", "Ian Frost"].map((n) => TESTIMONIALS.find((t) => t.name === n)!);
const SENTENCE = QUOTE.quote.split(" … ").find((s) => s.includes(QUOTE.bold)) ?? QUOTE.quote;
const [BEFORE, AFTER] = SENTENCE.split(QUOTE.bold);

const [FEATURED, ...PAIR] = HOME_LEAD;

export default function Home() {
  return (
    <main id="main-content" className="site-ground-page">
      <OverlayNav />
      <Hero />

      {/* the proof row (H4, 6 Oct 2026): three cards, the 4 Oct map */}
      <Section id="proof" flushBottom="Home proof row: equal gaps either side (Elleta, 4 Oct 2026)">
        <div className={styles.proof}>
          {HOME_PROOF.map((p) => (
            <ProofCard key={p.title} title={p.title} link={p.link} href={p.href} />
          ))}
        </div>
      </Section>

      <Section id="selected-work" label="Selected work">
        <SectionHeader
          heading="Start with the"
          accent="work"
          after="."
          lead="Three cases, up close: what drifted, what I built, and what changed."
        />
        <div className={styles.cases}>
          <CaseRow row={FEATURED} layout="featured" compact />
          <div className={caseStyles.cardPair}>
            {PAIR.map((row) => (
              <CaseRow key={row.id} row={row} layout="card" compact />
            ))}
          </div>
          <p className={styles.more}>
            <TextLink href="/work">
              See all work <span aria-hidden="true">→</span>
            </TextLink>
          </p>
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
            <b>{QUOTE.name}</b>
            <span>{QUOTE.role}</span>
            <TextLink href="/about#word-of-mouth">
              More on About <span aria-hidden="true">→</span>
            </TextLink>
          </figcaption>
        </figure>
        <ul className={styles.pair}>
          {PAIR_QUOTES.map((q) => (
            <li key={q.name}>
              <figure className={styles.pairQuote}>
                <span className={`${styles.mark} ${styles.pairMark} pattern-mark`} aria-hidden="true">
                  “
                </span>
                <blockquote className={styles.pairWords}>
                  <p>{q.quote}</p>
                </blockquote>
                <figcaption className={styles.pairCite}>
                  <b>{q.name}</b>
                  {q.role}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="how-i-work" label="How I work">
        <SectionHeader
          heading="The system behind the"
          accent="site"
          after="."
          lead="This site runs on BELLA, my own design system. Here’s one card, taken apart."
        />
        <SystemBeat />
        <p className={styles.links}>
          <TextLink href="/design-system">
            Inspect BELLA <span aria-hidden="true">→</span>
          </TextLink>
          <TextLink href="/learning">
            Where I learned it <span aria-hidden="true">→</span>
          </TextLink>
          {/* findability (job 34): the accessibility statement, from the system beat */}
          <TextLink href="/accessibility">
            Accessibility <span aria-hidden="true">→</span>
          </TextLink>
        </p>
      </Section>
    </main>
  );
}
