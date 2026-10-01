import type { ReactNode } from "react";

/* The pieces the NDA-safe case diagrams share (24 Sep audit, B1/F5): the
 * numbered marker on a drawing, the numbered decision notes under it, and
 * the "your words" box. Booking, search-experts, checkout and Drift. */

/** a numbered decision marker on a diagram, in clear space beside what it
 *  marks (never across a frame); the digit drops on phones, where the
 *  notes list under the drawing carries the numbers */
export function Mark({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle className="fill-ink" cx={x} cy={y} r="11" />
      <text className="ti on-ink opt" x={x} y={y + 4.5} textAnchor="middle">
        {n}
      </text>
    </g>
  );
}

/** the decisions, numbered like the markers: a bold title, then the line */
export function Notes({ notes }: { notes: [string, string][] }) {
  return (
    <ol className="trv-notes">
      {notes.map(([t, b]) => (
        <li key={t}>
          <b>{t}</b> {b}
        </li>
      ))}
    </ol>
  );
}

/** one "your words" box: the section-label Mono, then Elleta's lines */
export function Words({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="case-words">
      <p className="eyebrow case-words__k">{k}</p>
      <p className="case-words__v">{children}</p>
    </div>
  );
}
