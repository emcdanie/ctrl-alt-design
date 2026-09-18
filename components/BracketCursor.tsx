"use client";

import { useEffect, useRef, useState } from "react";

/* The corner-bracket cursor (18 Sep 2026): four rounded
   lavender corner brackets that trail the pointer with a slight lag and,
   over any link or button, snap to wrap it 8px outside its edge, with a
   lavender pill at the bottom right naming the BELLA component.
   An ADDITION to the system cursor, never a replacement: nothing here
   touches `cursor`. Decorative only (aria-hidden, pointer-events none).

   Off entirely on touch / coarse pointers. With prefers-reduced-motion
   the brackets still wrap targets but jump instead of gliding. Hidden
   whenever the pointer leaves the window.

   Label: the nearest `data-component` (every interactive BELLA
   component carries one), shown as <Name>. No attribute, no label: the
   brackets still wrap. */

const TARGET = 'a[href], button:not([disabled]), [role="button"]';
const IDLE = 22; // the resting box around the pointer, px
const PAD = 8; // the brackets sit this far outside a wrapped target, px
const LAG = 0.22; // share of the remaining distance covered per frame
function labelFor(el: Element): string {
  const name = el.closest("[data-component]")?.getAttribute("data-component");
  return name ? `<${name}>` : "";
}

export default function BracketCursor() {
  const [enabled, setEnabled] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(fine.matches);
    sync();
    fine.addEventListener("change", sync);
    return () => fine.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const box = boxRef.current;
    const label = labelRef.current;
    if (!box || !label) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
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
        goal = { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 };
      } else {
        goal = { x: pointer.x - IDLE / 2, y: pointer.y - IDLE / 2, w: IDLE, h: IDLE };
      }
      const k = reduced.matches || !primed ? 1 : LAG;
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
      <span className="bracket-cursor__corner bracket-cursor__corner--tl" />
      <span className="bracket-cursor__corner bracket-cursor__corner--tr" />
      <span className="bracket-cursor__corner bracket-cursor__corner--bl" />
      <span className="bracket-cursor__corner bracket-cursor__corner--br" />
      <span ref={labelRef} className="bracket-cursor__label" />
    </div>
  );
}
