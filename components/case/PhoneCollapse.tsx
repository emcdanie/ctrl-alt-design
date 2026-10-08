"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";
import styles from "./Case.module.css";

/* A figure's other parts, folded away on phones (job P, 7 Oct 2026). Mark
   each part to fold with `data-phone-rest`; under 640px those parts are
   display: none until "Show the other N", from 640px up nothing is hidden
   and there is no button. The layout stays the figure's own (no wrapper
   inside its grid), and a hidden part leaves the accessibility tree and
   the tab order, so nothing is cropped, only not drawn. Focus stays on the
   button, which keeps its place under the revealed parts. */
const Ctx = createContext<{ open: boolean; toggle: () => void; id: string; text: string } | null>(null);

/** the button, placed by the figure where the folded parts will appear;
 *  without one, PhoneCollapse puts it after everything */
export function PhoneCollapseBar() {
  const c = useContext(Ctx);
  if (!c) return null;
  return (
    <div className={`${styles.moreBar} ${styles.moreBarPhone}`}>
      <button type="button" className={styles.toolButton} aria-expanded={c.open} aria-controls={c.id} onClick={c.toggle}>
        {c.open ? "Show fewer" : c.text}
      </button>
    </div>
  );
}

export default function PhoneCollapse({ rest, label, inline = false, open: openProp, onOpenChange, children }: { rest: number; /** the figure places <PhoneCollapseBar /> itself */ inline?: boolean; /** the closed button's words, when "Show the other N" would not say what opens */ label?: string; /** controlled: the figure decides when it is open (the accessibility tour opens it before it reaches a folded card) */ open?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode }) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (f: (o: boolean) => boolean) => {
    const next = f(open);
    onOpenChange?.(next);
    if (openProp === undefined) setOpenState(next);
  };
  const id = useId();
  const text = label ?? `Show the other ${rest}`;
  return (
    <Ctx.Provider value={{ open, toggle: () => setOpen((o) => !o), id, text }}>
      <div id={id} className={styles.collapse} data-collapsed={!open}>
        {children}
      </div>
      {inline ? null : <PhoneCollapseBar />}
    </Ctx.Provider>
  );
}
