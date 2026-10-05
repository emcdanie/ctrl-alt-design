"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./Case.module.css";

/* Show all N (job F, Elleta, 5 Oct 2026: every beat fits one screen): a
   long figure keeps its key parts in view and the rest behind this one
   44px button, closed by default. Nothing is dropped: the parts are in
   the page, hidden until asked for. */
/** `label`: the closed button's words, when "Show all N" would not name
 *  what opens (one panel, not a set) */
export default function ShowAll({ total, label, children }: { total: number; label?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <div className={styles.moreBar}>
        <button type="button" className={styles.toolButton} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          {open ? "Show fewer" : (label ?? `Show all ${total}`)}
        </button>
      </div>
    </>
  );
}
