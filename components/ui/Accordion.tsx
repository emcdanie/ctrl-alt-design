"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/* Accordion item (APG disclosure pattern): a <button> inside a heading,
   aria-expanded + aria-controls, the panel a labelled region. BELLA has
   no accordion yet; this is the site's one, upstream it when BELLA needs
   it. The chevron is decorative. The panel stays in the DOM so the
   open/close can animate (grid rows 0fr to 1fr); closed, it is
   visibility: hidden, so it leaves the tab order and the a11y tree.
   Without JavaScript every panel stays open: the server renders them
   all open, and only after hydration do the non-default ones collapse.
   Transitions switch on after that (data-ready), so the collapse on
   load doesn't animate. Reduced motion drops them (globals.css). No names or copy
   live here: callers pass them in. */
export default function AccordionItem({
  heading,
  level = 3,
  defaultOpen = false,
  className = "",
  children,
}: {
  /** the trigger's content; it becomes the button's accessible name */
  heading: ReactNode;
  level?: 2 | 3 | 4;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  // server render: open, so the content is there without JavaScript
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);
  const id = useId();
  useEffect(() => {
    setOpen(defaultOpen);
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, [defaultOpen]);
  const H = `h${level}` as const;
  return (
    <div className={`accordion ${open ? "is-open" : ""} ${className}`.trim()} data-ready={ready || undefined}>
      <H className="accordion__heading">
        <button
          type="button"
          id={`${id}-trigger`}
          className="accordion__trigger"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
        >
          {heading}
          <Icon name="NavArrowDown" size="md" className="accordion__chev" />
        </button>
      </H>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} className="accordion__panel">
        <div className="accordion__inner">{children}</div>
      </div>
    </div>
  );
}
