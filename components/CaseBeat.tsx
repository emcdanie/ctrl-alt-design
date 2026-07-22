"use client";

/**
 * THE case-study beat template (airtight spec, Elleta 22 Jul 2026;
 * docs/briefs/case-layout-constitution.md is the law this file
 * implements). ONE reusable structure for Code First and every
 * future case study; other cases compose beats from this component,
 * never bespoke.
 *
 * The structural fix this encodes: the headline is a CHILD of the
 * text column, never a full-width banner, so eyebrow + headline +
 * keyline + body move TOGETHER when a beat flips. Alternation is
 * `.beat--flip` swapping column order only; the internal order of
 * `.beat-text` never changes. `.beat-visual` is FLAT (no card, no
 * frame; the demo specimen inside is the only card, because it IS
 * the subject). align-items start, --spacing-* rhythm only. All
 * asserted in audit:visual (headline-shares-column-with-body,
 * visual-has-no-frame).
 */
export default function CaseBeat({
  index,
  kicker,
  headline,
  keyline,
  body,
  visual,
  control,
  foot,
  flip = false,
  id,
}: {
  /** two-digit beat number, e.g. "01" */
  index: string;
  /** her kicker, mono eyebrow tier */
  kicker: string;
  /** her narrative sentence, display face, INSIDE the text column */
  headline: string;
  /** one keyline per beat, bold ink, never iris; omit only when the
      beat's keyline lives in its body copy */
  keyline?: string;
  body: React.ReactNode;
  /** FLAT visual; no card wrapper (the demo specimen is the subject) */
  visual: React.ReactNode;
  /** the CONTROL slot: run/media controls, right-aligned under the
      body on the text side (one size, the demo-btn recipe) */
  control?: React.ReactNode;
  /** the FOOTNOTE slot: one quiet row beneath the visual */
  foot?: React.ReactNode;
  flip?: boolean;
  /** anchor id, applied to the headline */
  id?: string;
}) {
  return (
    <section className={`beat${flip ? " beat--flip" : ""}`} aria-labelledby={id}>
      <div className="beat-grid">
        <div className="beat-text">
          <p className="beat-eyebrow">{index} · {kicker}</p>
          <h2 className="beat-headline" id={id}>{headline}</h2>
          {keyline && <p className="beat-keyline">{keyline}</p>}
          <div className="beat-body">{body}</div>
          {control && <div className="beat-control">{control}</div>}
        </div>
        <div className="beat-visual">
          {visual}
          {foot && <div className="beat-foot">{foot}</div>}
        </div>
      </div>
    </section>
  );
}
