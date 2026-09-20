"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import ContactActions from "@/components/ContactActions";

/* "Get in touch" (about-rebuild lock, 18 Sep 2026): replaces Contact in
   the nav. A disclosure button, not a menu: it opens a small panel with
   the same two actions as About's "Say hi". Secondary weight, so it
   never competes with a page's one primary.

   It closes on four things (Elleta, 20 Sep 2026, fix pass 2): Escape,
   an outside pointer, a scroll, and a route change. The panel is
   anchored under the trigger, so a page that scrolls under it would
   leave it floating over the heading row of whatever arrives. Escape
   and the outside pointer return focus to the trigger; a scroll does
   not, because the pointer or the wheel is already somewhere else. */
export default function GetInTouch() {
  const [open, setOpen] = useState(false);
  /* one id per instance: the nav and a page can both carry the button */
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  /* a route change closes it: the panel belongs to the page it opened on */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
    /* focusing the first action can itself nudge the scroll position, so
       the scroll close arms from where the page sits once it is open */
    const from = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - from) > 4) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="get-in-touch pointer-events-auto">
      <button
        ref={triggerRef}
        type="button"
        className="get-in-touch__trigger"
        data-component="GetInTouch"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        Get in touch
      </button>
      {open && (
        <div id={panelId} className="get-in-touch__panel">
          <ContactActions layout="stack" />
        </div>
      )}
    </div>
  );
}
