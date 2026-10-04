"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Case.module.css";

/* A picture swipe for the 390 frames (Site v3 "phone figures: swipe"):
   one picture per screen, scroll-snap, no pan past the track, dots and
   "N of M · swipe" under it. Above 640px the figure shows its wide
   picture instead (CaseFigure's art decides which). */
export default function Swipe({
  items,
  label,
}: {
  items: { src: string; width: number; height: number; alt: string; short: string }[];
  /** the track's accessible name */
  label: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.firstElementChild;
      const w = first instanceof HTMLElement ? first.offsetWidth : el.clientWidth;
      setAt(Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / Math.max(1, w)))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);
  return (
    <div className={styles.swipe}>
      <ul className={styles.swipeTrack} ref={track} aria-label={label}>
        {items.map((it) => (
          <li key={it.src} className={styles.swipeItem}>
            <img src={it.src} width={it.width} height={it.height} alt={it.alt} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <p className={styles.swipeMeta} aria-live="polite">
        <span className={styles.swipeDots} aria-hidden="true">
          {items.map((it, k) => (
            <span key={it.src} className={k === at ? styles.swipeDotOn : styles.swipeDot} />
          ))}
        </span>
        {at + 1} of {items.length} · {items[at].short} · swipe
      </p>
    </div>
  );
}
