"use client";

import { useState } from "react";
import s from "./Home.module.css";

/* The system door on phones (U2, Elleta, 7 Oct 2026, "it looks awful"): the
   card once, flat and assembled, with numbered markers on its parts, and the
   legend under it, 1 to 4 top to bottom. Tap a legend item and its part
   lights up on the card. Below 768 only; the exploded card stays above. */
export type DoorPart = { name: string; specs: string[] };
export type DoorChip = { t: string; dot?: string };

/* a numbered marker on the card's right edge, a short dashed leader into the part */
function Marker({ n, edge }: { n: number; edge?: boolean }) {
  return (
    <span className={s.mk} data-n={n} data-edge={edge ? "" : undefined}>
      <i className={s.mkLine} />
      <b>{n}</b>
    </span>
  );
}

export default function DoorFlat({ parts, chips }: { parts: DoorPart[]; chips: DoorChip[] }) {
  const [on, setOn] = useState(0);
  return (
    <div className={s.flat}>
      <div className={s.flatCard} data-on={on + 1} aria-hidden="true">
        <Marker n={1} edge />
        <div className={s.flatPart} data-part="2">
          <span className={s.flatPhoto}>
            {/* 1200px source, shown at most 300 CSS px wide here (audit:sharp) */}
            <img src="/images/kit/product-coat.jpg" width={1200} height={754} alt="" loading="lazy" decoding="async" />
            <span className={s.photoBtn} data-at="start">
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M7 11.08 2.92 7 7 2.92M11.08 7H2.92" />
              </svg>
            </span>
            <span className={s.photoBtn} data-at="end">
              <svg viewBox="0 0 14 14" fill="none">
                <path d="M11.08 8.17c.87-.85 1.75-1.87 1.75-3.2a3.2 3.2 0 0 0-3.2-3.2c-1.03 0-1.75.29-2.63 1.17C6.12 2.06 5.4 1.77 4.37 1.77a3.2 3.2 0 0 0-3.2 3.2c0 1.34.87 2.36 1.75 3.2L7 12.25l4.08-4.08Z" />
              </svg>
            </span>
            <span className={s.photoCount}>1 / 8</span>
          </span>
          <Marker n={2} />
        </div>
        <div className={`${s.flatPart} ${s.flatBody}`} data-part="3">
          <span className={s.plateEyebrow}>Complex SaaS · Design systems</span>
          <span className={s.flatTitle}>From Drift to Foundation</span>
          <Marker n={3} />
        </div>
        <div className={`${s.flatPart} ${s.flatChips}`} data-part="4">
          {chips.map((c) => (
            <span key={c.t} className={s.plateChip}>
              {c.dot ? <span className={s.chipDot} data-dot={c.dot} /> : null}
              {c.t}
            </span>
          ))}
          <Marker n={4} />
        </div>
      </div>
      <ol className={s.flatLegend}>
        {parts.map((p, i) => (
          <li key={p.name}>
            <button type="button" className={s.flatItem} aria-pressed={on === i} onClick={() => setOn(i)}>
              <span className={s.legendNum}>{i + 1}</span>
              <b>{p.name}</b>
              {on === i ? (
                <span className={s.flatPills}>
                  {p.specs.map((t) => (
                    <span key={t} className={s.flatPill}>
                      {t}
                    </span>
                  ))}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
