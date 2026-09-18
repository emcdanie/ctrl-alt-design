"use client";

import { useEffect, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";
/* one paw, pointing up, centred on 0,0 */
const PAW =
  '<ellipse cx="0" cy="3" rx="5.2" ry="4.4"/><ellipse cx="-5.6" cy="-3.2" rx="1.9" ry="2.5" transform="rotate(-20 -5.6 -3.2)"/><ellipse cx="-2" cy="-6.4" rx="1.9" ry="2.6"/><ellipse cx="2" cy="-6.4" rx="1.9" ry="2.6"/><ellipse cx="5.6" cy="-3.2" rx="1.9" ry="2.5" transform="rotate(20 5.6 -3.2)"/>';

/**
 * Paw trail (About only). Decorative: aria-hidden. Draws at most ten
 * prints along an S-curve across the gap before a section: from under
 * the hero figure to that section's index label, alternating left and
 * right feet and rotating with the path. Both ends are read from the
 * DOM, so the trail follows the layout at every width. The prints step in one by one the first time
 * the gap is fully in view, then settle to ~30% ink; they never loop.
 * Reduced motion: shown statically (CSS).
 */
export default function PawTrail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const svg = el?.querySelector("svg");
    if (!el || !svg) return;

    const draw = () => {
      svg.innerHTML = "";
      const w = el.clientWidth;
      const h = el.clientHeight;
      const box = el.getBoundingClientRect();
      const fig = document.querySelector(".about-hi__figure")?.getBoundingClientRect();
      const label = el.parentElement?.nextElementSibling?.querySelector(".section-row__meta")?.getBoundingClientRect();
      /* from: under the figure's centre; to: the index label's number */
      const a = fig ? fig.left + fig.width / 2 - box.left : w * 0.86;
      const b = label ? label.left - box.left + 8 : 8;
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", `M${a},0 C${a},${h * 0.95} ${b},${h * 0.05} ${b},${h}`);
      const len = path.getTotalLength();
      const step = w < 600 ? 44 : 62;
      /* ten prints at most (i runs 0..n) */
      const n = Math.min(9, Math.max(4, Math.floor(len / step)));
      for (let i = 0; i <= n; i++) {
        const s = (i / n) * len;
        const pt = path.getPointAtLength(s);
        const ahead = path.getPointAtLength(Math.min(len, s + 1));
        const behind = path.getPointAtLength(Math.max(0, s - 1));
        const ang = Math.atan2(ahead.y - behind.y, ahead.x - behind.x);
        const side = i % 2 ? 1 : -1;
        const x = pt.x + Math.cos(ang + Math.PI / 2) * 10 * side;
        const y = pt.y + Math.sin(ang + Math.PI / 2) * 10 * side;
        const outer = document.createElementNS(NS, "g");
        outer.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((ang * 180) / Math.PI + 90).toFixed(1)})`);
        const paw = document.createElementNS(NS, "g");
        paw.setAttribute("class", "paw-trail__paw");
        paw.style.setProperty("--i", String(i));
        paw.innerHTML = PAW;
        outer.appendChild(paw);
        svg.appendChild(outer);
      }
    };

    let settle = 0;
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("paw-trail--go");
          io.disconnect();
          /* once played, a resize redraw must not replay it */
          const prints = svg.childNodes.length;
          settle = window.setTimeout(() => el.classList.add("paw-trail--settled"), prints * 120 + 600);
        }
      },
      { threshold: 0.9 },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <div className="page-container" aria-hidden="true">
      <div ref={ref} className="paw-trail">
        <svg />
      </div>
    </div>
  );
}
