"use client";

import { useEffect, useRef, useState } from "react";
import ContactActions from "@/components/ContactActions";

/* "Get in touch" (about-rebuild lock, 18 Sep 2026): replaces Contact in
   the nav. A disclosure button, not a menu: it opens a small panel with
   the same two actions as About's "Say hi". Escape and outside clicks
   close it and focus returns to the trigger. Secondary weight, so it
   never competes with a page's one primary. */
export default function GetInTouch() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    wrapRef.current?.querySelector<HTMLElement>(".get-in-touch__panel button, .get-in-touch__panel a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="get-in-touch pointer-events-auto">
      <button
        ref={triggerRef}
        type="button"
        className="btn-key get-in-touch__trigger"
        aria-expanded={open}
        aria-controls="get-in-touch-panel"
        onClick={() => setOpen((o) => !o)}
      >
        Get in touch
      </button>
      {open && (
        <div id="get-in-touch-panel" className="get-in-touch__panel">
          <ContactActions layout="stack" />
        </div>
      )}
    </div>
  );
}
