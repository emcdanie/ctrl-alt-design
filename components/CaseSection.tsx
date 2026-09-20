"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/* CaseSection (Elleta, 20 Sep 2026, case-study rebuild, approved mock
   _private/specs/case-study/case-study-drift-mock-v4.html).

   The article pattern: one idea per section, a short text
   column on one side and one framed example on the other, alternating
   sides down the page, a hairline between sections. Two columns from
   900px (text 5fr, figure 6fr); on phones it stacks, text then figure.

   It also owns the linked-phrase state for its own subtree. A
   LinkedPhrase names a key; every element inside this section carrying
   data-t="<key>" gets .is-lit, and the first lit element scrolls into
   view inside its frame (never the page). Hover and focus light it;
   a click pins it; a second click, or Escape, clears.

   HIGHLIGHT, NEVER FADE (Elleta, 20 Sep 2026, standing rule): the
   targets gain the ring and the soft fill, and everything else stays at
   full opacity. Nothing in an annotation is dimmed or hidden. */

type Ctx = {
  /** the key currently lit, pinned or hovered */
  active: string | null;
  pinned: string | null;
  hover: (key: string | null) => void;
  toggle: (key: string) => void;
  /** 1-based number for the phrase's superscript, from `phrases` */
  numberOf: (key: string) => number | undefined;
};

const CaseSectionContext = createContext<Ctx | null>(null);

export function useCaseSection() {
  return useContext(CaseSectionContext);
}

export default function CaseSection({
  index,
  kicker,
  heading,
  flip = false,
  phrases = [],
  figure,
  children,
}: {
  /** the section number, "01" */
  index: string;
  /** what the section is about, "The drift" */
  kicker: string;
  heading: ReactNode;
  /** every other section flips the figure to the other side */
  flip?: boolean;
  /** the linked-phrase keys in reading order; the index is the number */
  phrases?: string[];
  /** one ExampleFrame */
  figure: ReactNode;
  /** the text column: 2 or 3 short paragraphs */
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = pinned ?? hovered;

  const hover = useCallback((key: string | null) => setHovered(key), []);
  const toggle = useCallback((key: string) => {
    setPinned((p) => (p === key ? null : key));
  }, []);
  const numberOf = useCallback((key: string) => {
    const i = phrases.indexOf(key);
    return i < 0 ? undefined : i + 1;
  }, [phrases]);

  /* Escape clears a pin, wherever focus is */
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pinned]);

  /* the highlight is applied to DOM the section does not own (a visual
     marks its own parts with data-t), so it is set here rather than
     threaded through every example as props */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const marked = Array.from(root.querySelectorAll<HTMLElement>("[data-t]"));
    for (const el of marked) {
      const keys = (el.dataset.t ?? "").split(/\s+/);
      el.classList.toggle("is-lit", active !== null && keys.includes(active));
    }
    if (active === null) return;
    const first = root.querySelector<HTMLElement>("[data-t].is-lit");
    if (!first) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    first.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [active]);

  const ctx = useMemo<Ctx>(() => ({ active, pinned, hover, toggle, numberOf }), [active, pinned, hover, toggle, numberOf]);

  return (
    <CaseSectionContext.Provider value={ctx}>
      <section
        ref={ref}
        className={`case-section${flip ? " case-section--flip" : ""}`}
        data-component="CaseSection"
        aria-labelledby={`case-section-${index}`}
      >
        <div className="case-section__text">
          <p className="text-code case-section__kicker">
            {index} · {kicker}
          </p>
          <h2 id={`case-section-${index}`} className="case-section__heading">
            {heading}
          </h2>
          {children}
        </div>
        {figure}
      </section>
    </CaseSectionContext.Provider>
  );
}
