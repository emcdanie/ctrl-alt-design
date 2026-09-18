"use client";

import { useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

/* Accordion item (APG disclosure pattern): a <button> inside a heading,
   aria-expanded + aria-controls, the panel a labelled region. BELLA has
   no accordion yet; this is the site's one, upstream it when BELLA needs
   it. The chevron is decorative. The panel stays in the DOM so the
   open/close can animate (grid rows 0fr to 1fr); closed, it is
   visibility: hidden, so it leaves the tab order and the a11y tree.
   Reduced motion drops the transition (globals.css). No names or copy
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
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const H = `h${level}` as const;
  return (
    <div className={`accordion ${open ? "is-open" : ""} ${className}`.trim()}>
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
          <Icon name="NavArrowDown" size="sm" className="accordion__chev" />
        </button>
      </H>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} className="accordion__panel">
        <div className="accordion__inner">{children}</div>
      </div>
    </div>
  );
}
