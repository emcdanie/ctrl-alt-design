"use client";

import { useEffect, useRef, useState } from "react";

/* The corner-bracket cursor (18 Sep 2026; inspector label 18 Sep
   evening): four iris corner brackets (1.5px) that trail the pointer
   with a slight lag and, over any link or button, snap to wrap it 8px
   outside its edge. Under the bottom-right bracket, 8px below and
   right-aligned with it, a label names the rendered element's tag
   (<a>, <button>, <input>), the way a browser inspector does.
   An ADDITION to the system cursor, never a replacement: nothing here
   touches `cursor`. Decorative only (aria-hidden, pointer-events none).

   Off entirely on touch / coarse pointers and with prefers-reduced-
   motion. Hidden whenever the pointer leaves the window. The label
   hides while the target's own menu is open (aria-expanded="true", e.g.
   Get in touch), so it never sits on the dropdown. The box is kept
   inside the viewport, so all four corners stay visible for targets
   that touch its edge (the nav). */

const TARGET = 'a[href], button:not([disabled]), [role="button"]';
const IDLE = 22; // the resting box around the pointer, px
const PAD = 8; // the brackets sit this far outside a wrapped target, px
const LAG = 0.22; // share of the remaining distance covered per frame
const EDGE = 2; // the box never comes closer than this to the viewport edge, px
// a Term is a <button> doing a <dfn>'s job: the label says what it is
const labelFor = (el: Element) => (el.hasAttribute("data-term") ? "<dfn>" : `<${el.tagName.toLowerCase()}>`);

/* one corner, drawn as a vector stroke: a 1.5px border gets snapped to
   1px by the browser, a path doesn't. Drawn top-left, mirrored by CSS. */
function Corner({ at }: { at: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg className={`bracket-cursor__corner bracket-cursor__corner--${at}`} viewBox="0 0 10 10" fill="none">
      <path d="M0.75 10V3.5A2.75 2.75 0 0 1 3.5 0.75H10" />
    </svg>
  );
}

export default function BracketCursor() {
  const [enabled, setEnabled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const box = boxRef.current;
    const label = labelRef.current;
    if (!box || !label) return;

    const cur = { x: 0, y: 0, w: IDLE, h: IDLE };
    const pointer = { x: 0, y: 0 };
    let target: Element | null = null;
    let visible = false;
    let primed = false;
    let raf = 0;

    const frame = () => {
      let goal;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        // inside the viewport, so a target on its edge keeps all four corners
        const x = Math.max(EDGE, r.left - PAD);
        const y = Math.max(EDGE, r.top - PAD);
        const right = Math.min(window.innerWidth - EDGE, r.right + PAD);
        const bottom = Math.min(window.innerHeight - EDGE, r.bottom + PAD);
        goal = { x, y, w: right - x, h: bottom - y };
        // its own menu is open: the label would sit on it
        box.dataset.menu = target.getAttribute("aria-expanded") === "true" ? "open" : "closed";
      } else {
        goal = { x: pointer.x - IDLE / 2, y: pointer.y - IDLE / 2, w: IDLE, h: IDLE };
      }
      const k = primed ? LAG : 1;
      primed = true;
      cur.x += (goal.x - cur.x) * k;
      cur.y += (goal.y - cur.y) * k;
      cur.w += (goal.w - cur.w) * k;
      cur.h += (goal.h - cur.h) * k;
      box.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      box.style.width = `${cur.w}px`;
      box.style.height = `${cur.h}px`;
      /* idle and settled: stop until the next move (a wrapped target
         keeps the loop alive so it follows scroll) */
      const settled = Math.abs(goal.x - cur.x) + Math.abs(goal.y - cur.y) + Math.abs(goal.w - cur.w) < 0.3;
      raf = !target && settled ? 0 : requestAnimationFrame(frame);
    };

    const show = (on: boolean) => {
      if (on === visible) return;
      visible = on;
      box.dataset.visible = on ? "true" : "false";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      const hit = (e.target as Element | null)?.closest?.(TARGET) ?? null;
      if (hit !== target) {
        target = hit;
        const text = hit ? labelFor(hit) : "";
        label.textContent = text;
        box.dataset.active = hit ? "true" : "false";
      }
      show(true);
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) show(false);
    };
    const onBlur = () => show(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("blur", onBlur);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={boxRef} className="bracket-cursor" data-visible="false" data-active="false" aria-hidden="true">
      {(["tl", "tr", "bl", "br"] as const).map((c) => (
        <Corner key={c} at={c} />
      ))}
      <span ref={labelRef} className="bracket-cursor__label" />
    </div>
  );
}
