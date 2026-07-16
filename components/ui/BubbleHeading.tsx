/**
 * §8 visual language: THE page/case title device. The h1 renders inside
 * the glossy bubble recipe (one light source, upper-left gloss,
 * down-right shadow) in the page's identity colour, with a thin
 * connector feeding the content below. Exactly ONE per page; all other
 * headings stay flat (hard limit, conformance §8).
 */
export default function BubbleHeading({
  title,
  hi = "var(--hub-hi)",
  lo = "var(--hub-lo)",
}: {
  title: string;
  /** identity gradient (case tokens for cases; iris/peri default) */
  hi?: string;
  lo?: string;
}) {
  return (
    <div className="bubble-heading">
      <span
        className="bubble-heading__orb"
        style={{ ["--bub-hi" as string]: hi, ["--bub-lo" as string]: lo }}
      >
        <h1 className="bubble-heading__title">{title}</h1>
      </span>
      <svg className="bubble-heading__link" viewBox="0 0 12 64" aria-hidden="true">
        <line x1="6" y1="0" x2="6" y2="54" stroke="var(--hero-link)" strokeWidth="1.5" pathLength="1" />
        <circle cx="6" cy="58" r="4" fill="var(--hero-iris-bright)" />
      </svg>
    </div>
  );
}
