import type { CSSProperties } from "react";

/**
 * THE shared case pull-quote (extracted from CodeFirstV2 so every case uses
 * ONE component, case-align pass, Elleta 24 Jul): an editorial display
 * moment, Unique on the page ground (the display treatment rides globals,
 * the sanctioned surface), black ink, her chosen words in the CASE identity
 * accent (never iris), FLAT, generous air. The quote text is hers, unchanged.
 *
 * accent is an optional phrase WITHIN the quote to wear the accent colour;
 * accentColor is the current case's identity token (e.g. var(--case-drift-text)),
 * set as --quote-accent so the accent is the case's colour, not a fixed one.
 */
export default function CaseDisplayQuote({
  text,
  accent,
  accentColor,
}: {
  text: string;
  accent?: string;
  accentColor?: string;
}) {
  const i = accent ? text.indexOf(accent) : -1;
  return (
    <figure
      className="cs2-displayquote"
      style={accentColor ? ({ "--quote-accent": accentColor } as CSSProperties) : undefined}
    >
      <blockquote className="cs2-displayquote__quote">
        {i === -1 || !accent ? (
          text
        ) : (
          <>
            {text.slice(0, i)}
            <span className="cs2-displayquote__accent">{accent}</span>
            {text.slice(i + accent.length)}
          </>
        )}
      </blockquote>
    </figure>
  );
}
