
/**
 * BELLA against the maturity model (System band, 23 Jul 2026): her
 * self-assessment on zeroheight's six-axis Design System Maturity
 * Model, rebuilt from her bella-maturity-map mockup on real BELLA
 * tokens. ALL copy is hers, verbatim from the mockup; the scores are
 * her honest self-scores, not invented numbers. It used to sit beside
 * an AI-readiness explainer band; that band is cut (28 Jul) and its one
 * surviving line is the AI Readiness rationale below, which is where
 * the frontier axis is actually scored.
 * Token mapping (spec system-page-identity-maturity): the mockup's
 * mint pair = the clarity case pair (the frontier accent), its warm
 * V1 hue = the writing case pair, Growing = the accent family.
 */

type Stage = "v1" | "growing" | "teenage";

const STAGE_LABELS: Record<Stage, string> = {
  v1: "V1",
  growing: "Growing",
  teenage: "Teenage",
};

const STEPS_TOTAL = 4;

/* copy verbatim from her mockup; frontier marks the axis that renders
   in the frontier accent (the clarity pair, never a raw hex) */
/* AXES takes the derived audit count (defect 6, 27 Jul): the
   Governance rationale used to hard-code "a 13-audit gate" while the
   gate ran fifteen. Elleta approved parameterising this one line; the
   rest of her mockup copy is untouched. */
type Axis = {
  name: string;
  /** the chart's own label: the full name will not sit beside a hexagon
      without pushing the chart down to nothing. The table carries the
      full name, so nothing is lost, only shortened where it is tight. */
  short: string;
  stage: Stage;
  steps: number;
  frontier?: boolean;
  rationale: string;
};

const axes = (auditCount: number): Axis[] => [
  {
    name: "Foundations",
    short: "Foundations",
    stage: "teenage",
    steps: 3,
    rationale:
      "Three token tiers, a 4px grid, AAA-minded contrast, zero hard-coded values.",
  },
  {
    name: "Documentation & Knowledge",
    short: "Docs",
    stage: "growing",
    steps: 2,
    rationale:
      "Every token carries machine-readable metadata, plus DESIGN.md, a bella.json rollup and an llms.txt map.",
  },
  {
    name: "Governance & Team",
    short: "Governance",
    stage: "growing",
    steps: 2,
    rationale:
      `Governance as code: a ${auditCount}-audit gate that fails the build on drift, run by a team of one.`,
  },
  {
    name: "Adoption",
    short: "Adoption",
    stage: "v1",
    steps: 1,
    rationale:
      "Powers elleta.design today with CHIP next, and few consumers by design.",
  },
  {
    name: "Measurement & Impact",
    short: "Measurement",
    stage: "v1",
    steps: 1,
    rationale:
      "Deliberately no vanity metrics; the working system is the evidence.",
  },
  {
    name: "AI Readiness",
    short: "AI Readiness",
    stage: "teenage",
    steps: 3,
    frontier: true,
    rationale:
      "The newest test of a design system is the path an AI takes, and this one defaults agents into it.",
  },
];

/* ── the radar geometry ──
   Six axes, 60 degrees apart, first axis at twelve o'clock and running
   clockwise in the order the axes are declared, which is the order the
   table lists them. Radius is (stage / 4) of the full spoke, so the
   plotted area IS the shape of the self-assessment: deep where the
   frontier axes are, shallow where the org-scale ones are. */
const R = 82;
const CENTRE = 100;
const angle = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
const point = (i: number, r: number) =>
  `${(CENTRE + r * Math.cos(angle(i))).toFixed(2)},${(CENTRE + r * Math.sin(angle(i))).toFixed(2)}`;
const ring = (r: number) => [0, 1, 2, 3, 4, 5].map((i) => point(i, r)).join(" ");

export default function BellaMaturityMap({ auditCount }: { auditCount: number }) {
  const rows = axes(auditCount);
  const shape = rows.map((a, i) => point(i, (R * a.steps) / STEPS_TOTAL)).join(" ");

  /* the chart's text equivalent, built from the same data it draws, so
     it can never describe a shape the chart is not showing. The exact
     stage of every axis is in the table; this states the SHAPE, which
     is the thing the chart adds and the table cannot. */
  const deep = rows.filter((a) => a.steps === Math.max(...rows.map((x) => x.steps)));
  const shallow = rows.filter((a) => a.steps === Math.min(...rows.map((x) => x.steps)));
  const shapeLabel =
    `Maturity shape across six axes, each scored 1 to ${STEPS_TOTAL}. ` +
    `Deepest on ${deep.map((a) => a.name).join(" and ")} at stage ${deep[0].steps}. ` +
    `Shallowest on ${shallow.map((a) => a.name).join(" and ")} at stage ${shallow[0].steps}. ` +
    `Every axis and its exact stage is listed in the table that follows.`;

  return (
    /* VISUAL ONLY (27 Jul migration): the beat owns the headline.
       COMPARATIVE GRID (27 Jul, finishing pass): every axis is one row
       on one column template, so the six tracks land in a single
       column and can actually be compared at a glance. It shipped as a
       stacked list where each track started at a different height,
       which is six charts of one bar each, not a map. Measured 1876px
       tall beside a 241px text column at 1440; the grid is roughly a
       third of that and the beat is wide, so nothing is stranded.

       The three notes that used to open this component (the intro, the
       "not a scoreboard" keyline and the stage scale) said what the
       beat's own keyline and body already say. Duplicated copy is the
       same defect as a duplicated component, so the beat keeps the
       words and this keeps the chart. The stage scale survives as the
       grid's legend, which is where a scale belongs. */
    /* ONE BLOCK (28 Jul, second pass). The chart had its own full-width
       row with its scale on the left and its source on the right, and
       three things went wrong with that: the right-aligned scale ended
       about 30px from the "AI Readiness" axis label and read as tangled
       with it, the hexagon sat small and marooned between two paragraphs
       of furniture, and the table below read as a separate object with a
       90px band of nothing between them.

       Chart and table are now two columns of one grid: the shape on the
       left with its own scale and source stacked underneath it, the
       exact stages on the right. Nothing flanks the chart, so nothing
       can crowd its labels, and the two halves start on the same line. */
    <div className="bmm">
      <div className="bmm-body">
        {/* ── the radar: the shape, at a glance ──
            The six axis labels are HTML in a ring around the chart, NOT
            <text> inside it. Text in a viewBox scales with the box, so
            the labels on the AI-readiness diagram in beat 04 render
            between 3.6px and 9.4px depending on width, and no audit can
            see it because computed font-size reports the declared user
            unit. These labels are real DOM at the body size and cannot
            fall below the floor at any width. The SVG is therefore pure
            geometry, and carries its meaning as one aria-label. */}
        <figure className="bmm-radar">
          <div className="bmm-radar__ring">
            {/* on a phone the ring cannot hold six labels AND a chart:
                two side labels plus their gaps left the hexagon about
                70px wide at 360. Below that width the labels fall into a
                row beneath the chart, in the same clockwise order, and
                this names that order so the list still says which vertex
                is which. It is the ONE set of labels either way. */}
            <span className="bmm-radar__hint">Clockwise from the top</span>
            {rows.map((a, i) => (
              <span key={a.name} className={`bmm-radar__label bmm-radar__label--${i}`}>
                {a.short}
              </span>
            ))}
            <svg
              className="bmm-radar__svg"
              viewBox="0 0 200 200"
              role="img"
              aria-label={shapeLabel}
            >
              {[1, 2, 3, 4].map((k) => (
                <polygon key={k} className="bmm-radar__grid" points={ring((R * k) / STEPS_TOTAL)} />
              ))}
              {rows.map((a, i) => (
                <line
                  key={a.name}
                  className="bmm-radar__spoke"
                  x1={CENTRE}
                  y1={CENTRE}
                  x2={point(i, R).split(",")[0]}
                  y2={point(i, R).split(",")[1]}
                />
              ))}
              <polygon className="bmm-radar__shape" points={shape} />
              {rows.map((a, i) => {
                const [cx, cy] = point(i, (R * a.steps) / STEPS_TOTAL).split(",");
                return (
                  <circle
                    key={a.name}
                    className={`bmm-radar__dot${a.frontier ? " bmm-radar__dot--frontier" : ""}`}
                    cx={cx}
                    cy={cy}
                    r={3.5}
                  />
                );
              })}
            </svg>
          </div>

          {/* the chart's furniture, UNDER the chart rather than beside
              it: as flanking columns the scale finished a few pixels from
              the "AI Readiness" axis label and read as colliding with it.
              Nothing sits beside the ring now, so nothing can crowd it. */}
          <figcaption className="bmm-radar__cap">
            <span className="bmm-radar__scale">
              <span className="bmm-legend__label">Stages</span>
              <span className="bmm-legend__scale">V1 → Growing → Teenage → Healthy Product</span>
            </span>
            {/* trimmed (craft pass): it listed all six axis names, which
                the table now lists in full, one per row */}
            <span className="bmm-radar__model">
              Model:{" "}
              <a
                className="ds-swatch__case"
                href="https://zeroheight.com/maturity/"
                target="_blank"
                rel="noopener noreferrer"
              >
                zeroheight Design System Maturity Model
              </a>
              . Self-assessed by Elleta McDaniel, ctrl_alt_design.
            </span>
          </figcaption>
        </figure>

        <ul className="bmm-list">
          {/* the column header is presentation for the grid beneath it,
              not a row of data; it is hidden from the accessibility tree
              because each row already names its own values in text. */}
          <li className="bmm-list__item bmm-list__item--head" aria-hidden="true">
            <div className="bmm-axis bmm-axis--head">
              <span className="bmm-axis__name">Axis</span>
              <span className="bmm-axis__stage">Stage</span>
              <span className="bmm-axis__score">Of 4</span>
              {/* one word, like the other two. The sentence version
                  ("Why it sits there") is 17 characters of label at the
                  13px metadata tier, which the hardened audit:type reads
                  as reading text below the floor, correctly. A column
                  header is a label; the answer is the column itself. */}
              <span className="bmm-axis__why">Why</span>
            </div>
          </li>

          {rows.map((a) => (
            <li key={a.name} className="bmm-list__item">
              {/* ON THE GROUND, not in a card (spec item 4, 27 Jul):
                  these rows are prose plus a chart, not an inspectable
                  specimen, so they lose the card and gain a rule.
                  The four-step progress bar is GONE (craft pass): the
                  radar plots the same number, and two encodings of one
                  value is the duplication rule in chart form. The stage
                  survives in words, which the chart cannot give. */}
              <div className="bmm-axis">
                {/* the ONE .heading-item recipe (audit:reuse); the axis
                    class carries grid rhythm only, never its own type */}
                <h3 className="heading-item bmm-axis__name">{a.name}</h3>
                <span className="bmm-axis__stage">
                  <span className={`bmm-badge bmm-badge--${a.stage}`}>
                    {STAGE_LABELS[a.stage]}
                  </span>
                </span>
                {/* the figure gets its OWN column so the six of them line
                    up on one right edge, tabular, which is the standing
                    rule for numbers in columns (28 Jul). Sharing a cell
                    with the pill meant it started wherever the pill's
                    word happened to end. */}
                <span className="bmm-axis__score">
                  {a.steps}/{STEPS_TOTAL}
                </span>
                <p className="bmm-axis__why">{a.rationale}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
