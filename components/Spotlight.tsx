"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/* Spotlight (Elleta, 20 Sep 2026): the ONE highlight engine on the site.
   It was born inside CaseSection for the case studies' linked phrases;
   Part J's scan-and-read sections need exactly the same behaviour, so it
   moved out here rather than growing a second copy.

   A control names a key. Every element inside the same provider carrying
   data-t="<key>" gets .is-lit. Hover and focus light it, a click pins it,
   a second click or Escape clears it.

   HIGHLIGHT, NEVER FADE: the targets gain emphasis and nothing else
   changes. Nothing is dimmed, moved or hidden. */

type Ctx = {
  active: string | null;
  pinned: string | null;
  hover: (key: string | null) => void;
  toggle: (key: string) => void;
  /** 1-based number for a control's superscript, from `keys` */
  numberOf: (key: string) => number | undefined;
};

const SpotlightContext = createContext<Ctx | null>(null);

export function useSpotlight() {
  return useContext(SpotlightContext);
}

export default function Spotlight({
  keys = [],
  /** scroll the first lit target into view inside its own scroller (the
   *  case studies' framed examples); off for prose, which is already
   *  on screen beside its control */
  scrollIntoView = false,
  className,
  children,
  as: Tag = "div",
  ...rest
}: {
  keys?: string[];
  scrollIntoView?: boolean;
  className?: string;
  children: ReactNode;
  as?: "div" | "section";
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = pinned ?? hovered;

  const hover = useCallback((key: string | null) => setHovered(key), []);
  const toggle = useCallback((key: string) => setPinned((p) => (p === key ? null : key)), []);
  const numberOf = useCallback(
    (key: string) => {
      const i = keys.indexOf(key);
      return i < 0 ? undefined : i + 1;
    },
    [keys]
  );

  /* Escape clears a pin, wherever focus is */
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pinned]);

  /* the targets are DOM this component does not own (a visual or a
     paragraph marks its own parts), so the class is set here rather than
     threaded through every one as props */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    for (const el of root.querySelectorAll<HTMLElement>("[data-t]")) {
      const ks = (el.dataset.t ?? "").split(/\s+/);
      el.classList.toggle("is-lit", active !== null && ks.includes(active));
    }
    if (active === null || !scrollIntoView) return;
    const first = root.querySelector<HTMLElement>("[data-t].is-lit");
    if (!first) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    first.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [active, scrollIntoView]);

  const ctx = useMemo<Ctx>(() => ({ active, pinned, hover, toggle, numberOf }), [active, pinned, hover, toggle, numberOf]);

  return (
    <SpotlightContext.Provider value={ctx}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Tag ref={ref as any} className={className} {...rest}>
        {children}
      </Tag>
    </SpotlightContext.Provider>
  );
}
