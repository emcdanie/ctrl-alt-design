"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ShowAll from "./ShowAll";
import styles from "./Case.module.css";

/* A figure's phone version (below 640px; CaseFigure's art shows the wide
   picture above it). Mobile first (job 42, Elleta, 5 Oct 2026; her 3 Oct
   research: on a phone, don't scroll sideways, stack and don't shrink):

   - default, a STACK: each item its own full-width card, in reading order,
     at its own size. A sequence or a diagram's parts always stacks.
   - `reel`: only for peers you compare (three versions of one card), when
     a stack would run past about two screens. The Reel pattern (Every
     Layout, Inclusive Components): full-bleed to the screen edges so the
     next card leaves at the screen edge, never a frame line; equal
     heights; room for the shadow; snap; a named tab stop and "N of M";
     it never moves by itself.

   Each item is a node that names itself (role="img") or an <img>. `fit`
   is kept for the callers; it no longer changes anything. */
export default function Swipe({
  items,
  label,
  reel = false,
  keep,
}: {
  items: { key: string; node: ReactNode; short: string }[];
  /** the list's accessible name */
  label: string;
  fit?: boolean;
  reel?: boolean;
  /** a stack longer than a phone screen or two: the first `keep` stay in
   *  view, the rest sit behind "Show the other N" (job O1, 6 Oct 2026) */
  keep?: number;
}) {
  if (!reel) {
    const list = (its: typeof items, name: string) => (
      <ul className={styles.stack} aria-label={name}>
        {its.map((it) => (
          <li key={it.key} className={styles.stackItem}>
            {it.node}
          </li>
        ))}
      </ul>
    );
    if (keep && keep < items.length) {
      const rest = items.length - keep;
      return (
        <>
          {list(items.slice(0, keep), label)}
          <ShowAll total={rest} label={`Show the other ${rest}`}>
            {list(items.slice(keep), `${label}, the rest`)}
          </ShowAll>
        </>
      );
    }
    return list(items, label);
  }
  return <Reel items={items} label={label} />;
}

function Reel({ items, label }: { items: { key: string; node: ReactNode; short: string }[]; label: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const kids = [...el.children] as HTMLElement[];
      const left = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");
      const off = (k: HTMLElement) => Math.abs(k.getBoundingClientRect().left - left);
      let best = 0;
      kids.forEach((k, n) => {
        if (off(k) < off(kids[best])) best = n;
      });
      setAt(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);
  /* equal heights: every item's card, its largest filled or bordered box,
     takes the tallest card's height; content stays at the top */
  useEffect(() => {
    const el = track.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const cardOf = (li: Element) => {
      let best: HTMLElement | null = null;
      let area = 0;
      for (const e of li.querySelectorAll<HTMLElement>("*")) {
        const cs = getComputedStyle(e);
        const filled = !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0;
        if (!filled) continue;
        const r = e.getBoundingClientRect();
        if (r.width * r.height > area) {
          area = r.width * r.height;
          best = e;
        }
      }
      return best;
    };
    const fit = () => {
      const cards = [...el.children].map(cardOf);
      for (const c of cards) if (c) c.style.minHeight = "";
      const tallest = Math.max(0, ...cards.map((c) => (c ? c.getBoundingClientRect().height : 0)));
      if (!tallest) return;
      for (const c of cards) if (c) c.style.minHeight = `${tallest}px`;
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    return () => ro.disconnect();
  }, [items.length]);
  return (
    <div className={styles.reel}>
      <ul className={styles.reelTrack} ref={track} role="region" aria-label={label} tabIndex={0}>
        {items.map((it) => (
          <li key={it.key} className={styles.reelItem}>
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
