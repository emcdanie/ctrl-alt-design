import type { ReactNode } from "react";
import Container from "@/components/layout/Container";
import styles from "./Case.module.css";

/* The case showcase (build-spec "Case hero band + showcase", Elleta,
   4 Oct late): the grey ground under the hero band, three white cards of
   real UI from the case at real size, each with a Label/Table title. Three
   equal columns from 960px, the cards one height; below, a sideways swipe
   of 280-wide cards with the next one peeking, scrolled inside its own
   track so the page never scrolls sideways. Each card's pieces are a
   picture: one role="img" with a label, everything inside aria-hidden.
   (Not the figure Swipe: that one is a picture-per-screen with dots and
   an "N of M" line, which the frames do not draw here.) `case-showcase`
   names the band for audit:frame. */

export type ShowcaseCard = { title: string; label: string; node: ReactNode };

/** `hook`: an optional line under the strip (Drift, Elleta, 5 Oct) */
export default function CaseShowcase({ label, cards, hook }: { label: string; cards: ShowcaseCard[]; hook?: string }) {
  return (
    <div className={`case-showcase ${styles.showcase}`}>
      <Container className="container--case">
        {/* focusable so a keyboard can scroll the phone track */}
        <ul className={styles.showcaseTrack} aria-label={label} tabIndex={0}>
          {cards.map((c) => (
            <li key={c.title} className={styles.showcaseCard}>
              <p className={styles.showcaseTitle}>{c.title}</p>
              <div className={styles.showcasePieces} role="img" aria-label={c.label}>
                <div aria-hidden="true">{c.node}</div>
              </div>
            </li>
          ))}
        </ul>
        {hook ? <p className={styles.showcaseHook}>{hook}</p> : null}
      </Container>
    </div>
  );
}
