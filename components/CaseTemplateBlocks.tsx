"use client";

import Card from "@/components/ui/Card";

/**
 * The case template's card-surface blocks (contract
 * _proto/case-template.html): the ONE identical figure frame every
 * visual sits in, and the outcomes tick card. Split from
 * CaseScrollTemplate so the Heading-rendering structure file never
 * imports a Card surface (card-voice rule). Geist only in here.
 */

/** the identical figure frame: ui/Card + a bordered caption */
export function FigureFrame({
  caption,
  children,
}: {
  caption?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="h-full" innerClassName="ds-card__inner cst-figframe">
      <figure className="cst-figure">
        {children}
        {caption && <figcaption className="cst-figcaption">{caption}</figcaption>}
      </figure>
    </Card>
  );
}

/** the outcomes tick card (proto .outcomes): qualitative rows, a
    clarity-tint tick per row, verdict words never colour-only */
export function OutcomesCard({
  heading,
  rows,
}: {
  heading: string;
  rows: readonly string[];
}) {
  return (
    <Card innerClassName="ds-card__inner">
      <p className="cst-outcomes__kicker">{heading}</p>
      <ul className="cst-outcomes">
        {rows.map((r) => (
          <li key={r} className="cst-outcomes__row">
            <span className="cst-tick" aria-hidden="true">✓</span>
            <span className="ds-section__note" style={{ margin: 0 }}>{r}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
