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
import figStyles from "@/components/case/Case.module.css";
import styles from "@/components/Home.module.css";
import type { CSSProperties } from "react";

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

/* The system door (Figma Home 293:29910, Exploded card · Door B v2): the
   case card taken apart, top plate first. `y` is the plate's origin (its
   left corner) in the 993-wide design frame; the dot and leader sit level
   with it. */
const PLATES = [
  { n: 4, name: "Content", specs: ["Label/Eyebrow", "Heading/Card"], y: 94.4 },
  { n: 3, name: "Cover", specs: ["the picture (Case UI kit)", "radius/inner"], y: 334.4 },
  { n: 2, name: "Surface", specs: ["surface · border", "radius/card 16", "shadow.card"], y: 574.4 },
  { n: 1, name: "Tokens", specs: ["one source for every value"], y: 814.4 },
];
const CHIPS = [
  { t: "action.primary", dot: "ink" },
  { t: "text.primary", dot: "ink" },
  { t: "accent", dot: "accent" },
  { t: "radius/card 16" },
  { t: "shadow.card" },
  { t: "Heading/Card" },
];
const at = (k: number, y: number) => ({ "--k": k, "--y": y }) as CSSProperties;

function PlateArt({ n }: { n: number }) {
  if (n === 4)
    return (
      <>
        <span className={styles.plateEyebrow}>Complex SaaS · Design systems</span>
        <span className={styles.plateTitle}>From Drift to Foundation</span>
      </>
    );
  if (n === 3)
    return (
      <span className={styles.platePhoto}>
        {/* 1200px source: at most 600 CSS px wide at 1440 (audit:sharp) */}
        <img src="/images/kit/product-coat.jpg" width={1200} height={754} alt="" loading="lazy" decoding="async" />
        <span className={styles.photoBtn} data-at="start">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M7 11.08 2.92 7 7 2.92M11.08 7H2.92" />
          </svg>
        </span>
        <span className={styles.photoBtn} data-at="end">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M11.08 8.17c.87-.85 1.75-1.87 1.75-3.2a3.2 3.2 0 0 0-3.2-3.2c-1.03 0-1.75.29-2.63 1.17C6.12 2.06 5.4 1.77 4.37 1.77a3.2 3.2 0 0 0-3.2 3.2c0 1.34.87 2.36 1.75 3.2L7 12.25l4.08-4.08Z" />
          </svg>
        </span>
        <span className={styles.photoCount}>1 / 8</span>
      </span>
    );
  if (n === 2) return <span className={styles.plateCard} />;
  return (
    <span className={styles.plateChips}>
      {CHIPS.map((c) => (
        <span key={c.t} className={styles.plateChip}>
          {c.dot ? <span className={styles.chipDot} data-dot={c.dot} /> : null}
          {c.t}
        </span>
      ))}
    </span>
  );
}

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
        <figure className={styles.door}>
          <div className={figStyles.stage}>
            <div className={styles.doorFrame}>
              {/* plays once in view (RevealObserver); reduced motion and
                  no-JS show the exploded end state */}
              <div className={`${styles.explode} reveal`}>
                <div className={styles.plates} aria-hidden="true">
                  {PLATES.map((p, k) => (
                    <span key={p.n} className={styles.plate} data-n={p.n} style={at(k, p.y)}>
                      <PlateArt n={p.n} />
                    </span>
                  ))}
                  {PLATES.map((p, k) => (
                    <span key={p.n} className={styles.leader} style={at(k, p.y)} />
                  ))}
                </div>
                <ol className={styles.legend}>
                  {PLATES.map((p, k) => (
                    <li key={p.n} className={styles.legendRow} data-n={p.n} style={at(k, p.y)}>
                      <span className={styles.legendNum}>{p.n}</span>
                      <span className={styles.legendText}>
                        <span className={styles.legendName}>{p.name}</span>
                        {p.specs.map((t) => (
                          <span key={t} className={styles.legendSpec}>
                            {t}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <figcaption className={styles.doorCaption}>= the card on the site. Every value comes from BELLA.</figcaption>
        </figure>
        <p className={styles.links}>
          <TextLink href="/design-system">
            Inspect BELLA <span aria-hidden="true">→</span>
          </TextLink>
          <TextLink href="/learning">
            Where I learned it <span aria-hidden="true">→</span>
          </TextLink>
        </p>
        {/* findability (job 34): the accessibility statement, from the system beat */}
        <p className={styles.a11y}>
          Built to WCAG 2.2 AA,{" "}
          {/* the link keeps its words: the line breaks before them (job G3) */}
          <span className={styles.keep}>
            AAA contrast ·{" "}
            <TextLink href="/accessibility">
              Accessibility <span aria-hidden="true">→</span>
            </TextLink>
          </span>
        </p>
      </Section>
    </main>
  );
}
