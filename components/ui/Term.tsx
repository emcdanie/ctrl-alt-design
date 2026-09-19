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

/* the popover opens 28px past the inspector cursor's corner brackets
   (which sit 8px outside the word), so it never meets the cursor's
   label (8px under the brackets, about 14px tall) */
const BRACKETS = 8;
const GAP = BRACKETS + 28;
const EDGE = 12; // popover never comes closer than this to the viewport edge, px
const OPENED = "term-opened"; // sessionStorage: a Term has been opened this visit
const OPEN_EVENT = "term:open";

/* the first open of any Term retires the help line (TermHelp) */
function markOpened() {
  try {
    sessionStorage.setItem(OPENED, "1");
  } catch {}
  window.dispatchEvent(new Event(OPEN_EVENT));
}

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

  useEffect(() => {
    if (open) markOpened();
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
  // the delay lets the pointer cross the gap from the word to the popover
  const leave = () => {
    if (pinned) return;
    leaveTimer.current = window.setTimeout(() => setOpen(false), 300);
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

/* The help line above a page's first Terms: "// hover or tap a dotted
   word ...", in .text-code. It shows until someone opens a Term for the
   first time this visit (sessionStorage), then stays gone. It needs
   JavaScript, like the Terms, so it only appears after hydration. The
   visible line is aria-hidden; screen readers always get the
   instruction from the sr-only sentence instead. */
export function TermHelp() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let opened = false;
    try {
      opened = sessionStorage.getItem(OPENED) === "1";
    } catch {}
    setShow(!opened);
    const hide = () => setShow(false);
    window.addEventListener(OPEN_EVENT, hide);
    return () => window.removeEventListener(OPEN_EVENT, hide);
  }, []);
  return (
    <>
      <p className="sr-only">Words with a dotted underline are buttons: focus or press one to hear what it means and when it matters.</p>
      {show ? (
        <p className="text-code term-help" aria-hidden="true">
          {"// hover or tap a dotted word: the cursor shows the tag and a short \"what + when\""}
        </p>
      ) : null}
    </>
  );
}
