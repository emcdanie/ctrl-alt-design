"use client";

import { useEffect, useRef, useState } from "react";
import { PAW } from "@/components/PawTrail";

/* The footer paw trail (19 Sep 2026): one per page. Five to seven small
   prints walk from the left edge along the empty band above the ELLETA
   letters and climb to Bella on the A. Decorative (aria-hidden).

   Geometry is read from the DOM on mount and resize: the lane runs
   between the top row's text (+32px clear) and the top of the letters,
   so a print never touches text. No lane that tall, no trail.

   The prints appear one after another (80ms each) the first time the
   footer scrolls into view, once per visit (sessionStorage); later
   pages show them settled. Reduced motion shows them all at once. */

const CLEAR = 32; // px between a print and any text
const SIZE = 14; // print size, px
const STEP = 5; // left and right feet sit this far either side of the line, px
const REACH = (SIZE * Math.SQRT2) / 2; // a rotated print's half-diagonal, px
const SEEN = "footer-trail-seen";

type Print = { x: number; y: number; r: number };

export default function FooterTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const [prints, setPrints] = useState<Print[]>([]);
  const [state, setState] = useState<"idle" | "go" | "settled">("idle");

  useEffect(() => {
    const host = ref.current;
    const footer = host?.closest("footer");
    if (!host || !footer) return;

    const layout = () => {
      const f = footer.getBoundingClientRect();
      const text = footer.querySelector(".site-footer__contact")?.getBoundingClientRect();
      const letter = footer.querySelector(".site-footer__wordmark > span");
      const bella = footer.querySelector(".site-footer__bella")?.getBoundingClientRect();
      const inner = footer.querySelector(".site-footer__inner");
      if (!text || !letter || !bella || !inner) return setPrints([]);
      // where the letters' ink starts: a Range hugs the glyph box tighter
      // than the span's line box
      const range = document.createRange();
      range.selectNodeContents(letter);
      const inkTop = range.getBoundingClientRect().top;
      // the lane: 32px clear of the text above and of the letters below
      const laneTop = text.bottom + CLEAR + REACH + STEP - f.top;
      const laneBottom = inkTop - CLEAR - REACH - STEP - f.top;
      if (laneBottom < laneTop) return setPrints([]);
      const pad = parseFloat(getComputedStyle(inner).paddingLeft) || 0;
      const start = { x: inner.getBoundingClientRect().left + pad - f.left + SIZE / 2, y: laneBottom };
      // climb to Bella: the last print sits beside her, a third of the way down
      const end = {
        x: bella.left - f.left - SIZE,
        y: Math.min(laneBottom, Math.max(laneTop, bella.top + bella.height / 3 - f.top)),
      };
      const n = f.width < 700 ? 5 : 7;
      const angle = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI + 90;
      setPrints(
        Array.from({ length: n }, (_, i) => {
          const t = i / (n - 1);
          const side = i % 2 ? -STEP : STEP; // left and right feet
          return {
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t + side,
            r: angle,
          };
        }),
      );
    };

    layout();
    // fonts change the letters' size after first paint
    document.fonts?.ready.then(layout);
    const ro = new ResizeObserver(layout);
    ro.observe(footer);

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setState("settled");
      return () => ro.disconnect();
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setState("go");
        try {
          sessionStorage.setItem(SEEN, "1");
        } catch {}
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(footer);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`footer-trail footer-trail--${state}`} aria-hidden="true">
      {prints.map((p, i) => (
        <svg
          key={i}
          className="footer-trail__paw"
          viewBox="-8 -9.5 16 17"
          style={{
            left: p.x - SIZE / 2,
            top: p.y - SIZE / 2,
            transform: `rotate(${p.r}deg)`,
            ["--i" as string]: i,
          }}
          dangerouslySetInnerHTML={{ __html: PAW }}
        />
      ))}
    </div>
  );
}
