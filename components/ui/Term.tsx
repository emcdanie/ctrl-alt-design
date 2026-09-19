"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { GLOSSARY, type TermId } from "@/content/glossary";

/* Term (19 Sep 2026): a word you can tap to learn. A toggletip: the
   <button> (named by the word, aria-label) opens a role="tooltip"
   popover on hover, focus and tap, and it closes on Esc, blur and
   scroll. The popover lives in a portal on <body>, so its text never
   joins a heading's accessible name; aria-describedby points at it (it
   stays in the DOM, hidden, so the description is there on focus).

   The letters are aria-hidden spans so they can bounce one after
   another on hover-in and tap (globals.css, off with reduced motion).
   The dotted iris underline is drawn under the word, thicker inside
   headings. Definitions live in content/glossary.ts. */

const GAP = 8; // popover distance from the word, px
const EDGE = 12; // popover never comes closer than this to the viewport edge, px

export default function Term({ id, children }: { id: TermId; children?: ReactNode }) {
  const entry = GLOSSARY[id];
  const text = typeof children === "string" ? children : entry.word;
  const tipId = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const pointerDown = useRef(false);
  const leaveTimer = useRef<number>(0);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [bounce, setBounce] = useState(0);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, []);

  // place the popover under the word, inside the viewport
  useEffect(() => {
    if (!open) return;
    const b = btnRef.current?.getBoundingClientRect();
    const tip = tipRef.current;
    if (!b || !tip) return;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const below = b.bottom + GAP + h <= window.innerHeight - EDGE;
    setPos({
      top: below ? b.bottom + GAP : Math.max(EDGE, b.top - GAP - h),
      left: Math.min(Math.max(EDGE, b.left), window.innerWidth - w - EDGE),
    });
  }, [open]);

  // Esc and scroll close it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { passive: true, capture: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, { capture: true });
    };
  }, [open, close]);

  const hop = () => setBounce((n) => n + 1);
  const enter = () => {
    window.clearTimeout(leaveTimer.current);
    if (!open) hop();
    setOpen(true);
  };
  // leaving the word or the popover closes it, unless a tap pinned it;
  // the short delay lets the pointer cross from the word to the popover
  const leave = () => {
    if (pinned) return;
    leaveTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  const tip = (
    <span
      ref={tipRef}
      id={tipId}
      role="tooltip"
      className="term-tip"
      hidden={!open}
      style={{ top: pos.top, left: pos.left }}
      onMouseEnter={() => window.clearTimeout(leaveTimer.current)}
      onMouseLeave={leave}
    >
      <span className="term-tip__tag">
        <span aria-hidden="true">&lt;dfn&gt; </span>
        <dfn>{entry.word}</dfn>
      </span>
      <span className="term-tip__def">{entry.definition}</span>
      <span className="term-tip__when">When: {entry.when}</span>
    </span>
  );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="term"
        data-term={id}
        aria-label={text}
        aria-describedby={tipId}
        data-open={open || undefined}
        onMouseEnter={enter}
        onMouseLeave={leave}
        onPointerDown={() => {
          pointerDown.current = true;
        }}
        onFocus={() => {
          // a pointer press focuses too; the click decides then
          if (!pointerDown.current) setOpen(true);
        }}
        onBlur={close}
        onClick={() => {
          pointerDown.current = false;
          if (pinned) {
            close();
          } else {
            hop();
            setOpen(true);
            setPinned(true);
          }
        }}
      >
        <span key={bounce} className={bounce ? "term__word is-bouncing" : "term__word"} aria-hidden="true">
          {[...text].map((ch, i) => (
            <span key={i} className="term__l" style={{ ["--i" as string]: i }}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
      </button>
      {mounted ? createPortal(tip, document.body) : null}
    </>
  );
}
