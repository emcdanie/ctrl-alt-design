"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Container from "@/components/layout/Container";
import styles from "./Case.module.css";

/* The case showcase (build-spec "Case hero band + showcase", Elleta,
   4 Oct late): the grey ground under the hero band, three white cards of
   real UI from the case at real size, each with a Label/Table title. Three
   equal columns from 960px, the cards one height; below, a sideways swipe
   of 280-wide cards with the next one peeking, scrolled inside its own
   track so the page never scrolls sideways. Each card's pieces are a
   picture: one role="img" with a label, everything inside aria-hidden.
   Below 960px the swipe has a cue: dots and "N of M · title · swipe",
   as the figure Swipe draws it, and the track pads below for the cards'
   shadow (job 38: the strips ran off screen with no cue and the band cut
   their shadows flat). `case-showcase` names the band for audit:frame. */

export type ShowcaseCard = { title: string; label: string; node: ReactNode };

/** `hook`: an optional line under the strip (Drift, Elleta, 5 Oct) */
/** `strip`: below 960px the cards scroll sideways, full-bleed (peers only;
 *  job 42). Without it they stack. */
export default function CaseShowcase({ label, cards, hook, strip = false }: { label: string; cards: ShowcaseCard[]; hook?: string; strip?: boolean }) {
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const kids = [...el.children] as HTMLElement[];
      const left = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft);
      const off = (k: HTMLElement) => Math.abs(k.getBoundingClientRect().left - left);
      let best = 0;
      kids.forEach((k, n) => {
        if (off(k) < off(kids[best])) best = n;
      });
      setAt(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`case-showcase ${styles.showcase}`}>
      <Container className="container--case">
        {/* focusable so a keyboard can scroll the phone track */}
        <ul className={styles.showcaseTrack} ref={track} aria-label={label} tabIndex={strip ? 0 : undefined} data-strip={strip || undefined} data-stack-open={!strip ? open : undefined}>
          {cards.map((c) => (
            <li key={c.title} className={styles.showcaseCard}>
              <p className={styles.showcaseTitle}>{c.title}</p>
              <div className={styles.showcasePieces} role="img" aria-label={c.label}>
                <div aria-hidden="true">{c.node}</div>
              </div>
            </li>
          ))}
        </ul>
        {strip ? (
        <p className={`${styles.swipeMeta} ${styles.showcaseMeta}`} aria-live="polite">
          <span className={styles.swipeDots} aria-hidden="true">
            {cards.map((c, k) => (
              <span key={c.title} className={k === at ? styles.swipeDotOn : styles.swipeDot} />
            ))}
          </span>
          {at + 1} of {cards.length} · {cards[at].title} · swipe
        </p>
        ) : null}
        {/* phones, stacked cards (job O1): the first card, the rest behind a button */}
        {!strip && cards.length > 1 ? (
          <div className={`${styles.moreBar} ${styles.moreBarPhone}`}>
            <button type="button" className={styles.toolButton} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              {open ? "Show fewer" : `Show the other ${cards.length - 1}`}
            </button>
          </div>
        ) : null}
        {hook ? <p className={styles.showcaseHook}>{hook}</p> : null}
      </Container>
    </div>
  );
}
