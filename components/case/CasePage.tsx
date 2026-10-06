import type { ReactNode } from "react";
import Section from "@/components/layout/Section";
import Heading from "@/components/ui/Heading";
import { Icon, type IconName } from "@/components/ui/Icon";
import styles from "./Case.module.css";

/* Template / Case page (Site v3, Figma 291:2303; Elleta, 4 Oct 2026):
   Hero, Results, Overview, Beats, Reflection, Next case, More work, on
   Layout B. The Hero slot is the white hero band and the grey showcase
   under it (CaseHero, CaseShowcase; 4 Oct late: no kicker, no back link,
   no Figure 1 cover). The rest is one layout Section on the case body
   (1056); the slots inside it keep the template's rhythm (--case-gap-*),
   and text sits on the 696 column. A case composition fills the slots. */

export function CasePage({
  hero,
  showcase,
  results,
  resultSize = "section",
  facts,
  tags,
  children,
}: {
  /** the case hero band (CaseHero): the h1 lives there, id "case-title" */
  hero: ReactNode;
  /** the showcase under it (CaseShowcase) */
  showcase: ReactNode;
  /** none on a case whose facts carry it (Theming, CHIP) */
  results?: { n: string; label: string }[];
  /** one size per page: Display/Page or Display/Section */
  resultSize?: "page" | "section";
  facts: { label: string; value: string }[];
  /** signal tags under the facts (Theming) */
  tags?: string[];
  /** the beats, the reflection and the case end */
  children: ReactNode;
}) {
  return (
    <>
      {hero}
      {showcase}
      <Section width="case" labelledBy="case-title">
        <div className={styles.page}>
          {results?.length ? (
            <ul className={styles.results} aria-label="Results">
              {results.map((r) => (
                <li key={r.n + r.label} className={styles.result}>
                  <span className={styles.resultBar} aria-hidden="true" />
                  <p className={styles.resultValue} data-size={resultSize}>
                    {r.n}
                  </p>
                  <p className={styles.resultLabel}>{r.label}</p>
                </li>
              ))}
            </ul>
          ) : null}

          <div className={styles.overview}>
            <dl className={`${styles.facts} ${styles.col}`}>
              {facts.map((f) => (
                <div key={f.label} className={styles.fact}>
                  <dt className={styles.factLabel}>{f.label}</dt>
                  <dd className={styles.factValue}>{f.value}</dd>
                </div>
              ))}
            </dl>
            {tags?.length ? (
              <ul className={`${styles.signalTags} ${styles.col}`} aria-label="This case is evidence for">
                {tags.map((t) => (
                  <li key={t} className={styles.signalTag}>
                    {t}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {children}
        </div>
      </Section>
    </>
  );
}

/** a numbered beat: header (badge + label, heading, lead), then its
 *  body copy and figures */
export function Beat({
  id,
  num,
  label,
  heading,
  lead,
  lead2,
  leadSize = "lead",
  align = "col",
  children,
}: {
  id: string;
  num: string;
  label: string;
  heading: string;
  lead?: string;
  /** a second line under the lead, same style (Theming beats 2 and 5) */
  lead2?: string;
  /** Body/Lead (22, Drift) or Body/Base (20, Federated): the frames differ */
  leadSize?: "lead" | "base";
  /** the header on the text column (Drift, Federated) or on the body's
   *  left edge (About, a page on the case-edge frame) */
  align?: "col" | "edge";
  children?: ReactNode;
}) {
  return (
    <section id={id} className={styles.beat} aria-labelledby={`${id}-h`}>
      <div className={`${styles.beatHeader} ${align === "edge" ? styles.edge : styles.col}`}>
        <p className={styles.beatLabel}>
          <span className={styles.badge}>{num}</span>
          {label}
        </p>
        <Heading tier="section" id={`${id}-h`} className={styles.beatHeading}>
          {heading}
        </Heading>
        {lead ? <p className={leadSize === "base" ? styles.leadBase : styles.lead}>{lead}</p> : null}
        {lead2 ? <p className={leadSize === "base" ? styles.leadBase : styles.lead}>{lead2}</p> : null}
      </div>
      {children}
    </section>
  );
}

/** body copy on the text column, Body/Lead */
export function BeatText({ children }: { children: ReactNode }) {
  return <p className={`${styles.body} ${styles.col}`}>{children}</p>;
}

/** Site/Quote (Figma 59:147, locked: do not restyle) */
export function CaseQuote({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    /* the mark hangs above the card (Figma), so it sits on the wrapper,
       outside the bordered box */
    <div className={styles.quoteWrap}>
      <span className={`${styles.quoteMark} pattern-mark`} aria-hidden="true">
        “
      </span>
      <figure className={styles.quote}>
        <blockquote className={styles.quoteText}>
          <p>{quote}</p>
        </blockquote>
        <figcaption className={styles.quoteBy}>
          <span className={styles.quoteName}>{name}</span>
          <span className={styles.quoteRole}>{role}</span>
        </figcaption>
      </figure>
    </div>
  );
}

/** Reflection: "What I'd do differently", three lessons */
export function Lessons({
  items,
  label = "What I’d do differently",
}: {
  items: { icon: IconName; title: string; body: string }[];
  label?: string;
}) {
  return (
    <>
      <p className={`${styles.lessonsLabel} ${styles.col}`}>{label}</p>
      <ul className={styles.lessons}>
        {items.map((l) => (
          <li key={l.title} className={styles.lesson}>
            <span className={styles.lessonIcon} aria-hidden="true">
              <Icon name={l.icon} size="lg" />
            </span>
            <h3 className={`heading-item ${styles.lessonTitle}`}>{l.title}</h3>
            <p className={styles.lessonBody}>{l.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
