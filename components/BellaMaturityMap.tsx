
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

export default function BellaMaturityMap({ auditCount }: { auditCount: number }) {
  const rows = axes(auditCount);

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
    /* TABLE ONLY (Part R, 21 Sep 2026): the radar said what the table
       says, less readably, so it went. The stage scale and the model's
       credit sit under the table as one line. */
    <div className="bmm">
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
        <p className="bmm-note">
          Stages: V1 → Growing → Teenage → Healthy Product. Model:{" "}
          <a href="https://zeroheight.com/maturity/" target="_blank" rel="noopener noreferrer">
            zeroheight Design System Maturity Model
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          . Self-assessed by Elleta McDaniel.
        </p>
    </div>
  );
}
