"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Case.module.css";

/* A picture swipe for the 390 frames (Site v3 "phone figures: swipe"):
   one picture per screen, scroll-snap, no pan past the track, dots and
   "N of M · <name> · swipe" under it. Above 640px the figure shows its
   wide picture instead (CaseFigure's art decides which). Each item is a
   node: an <img>, or a live picture that names itself (role="img").
   `fit` lets each item hug its picture instead of taking 82% of the track. */
export default function Swipe({
  items,
  label,
  fit = false,
}: {
  items: { key: string; node: ReactNode; short: string }[];
  /** the track's accessible name */
  label: string;
  fit?: boolean;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const kids = [...el.children] as HTMLElement[];
      const left = el.getBoundingClientRect().left;
      const off = (k: HTMLElement) => Math.abs(k.getBoundingClientRect().left - left);
      let best = 0;
      kids.forEach((k, n) => {
        if (off(k) < off(kids[best])) best = n;
      });
      setAt(Math.max(0, Math.min(items.length - 1, best)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);
  return (
    <div className={styles.swipe}>
      <ul className={styles.swipeTrack} ref={track} aria-label={label}>
        {items.map((it) => (
          <li key={it.key} className={styles.swipeItem} data-fit={fit || undefined}>
            {it.node}
          </li>
        ))}
      </ul>
      <p className={styles.swipeMeta} aria-live="polite">
        <span className={styles.swipeDots} aria-hidden="true">
          {items.map((it, k) => (
            <span key={it.key} className={k === at ? styles.swipeDotOn : styles.swipeDot} />
          ))}
        </span>
        {at + 1} of {items.length} · {items[at].short} · swipe
      </p>
    </div>
  );
}
