
/**
 * BELLA against the maturity model (System band, 23 Jul 2026): her
 * self-assessment on zeroheight's six-axis Design System Maturity
 * Model, rebuilt from her bella-maturity-map mockup on real BELLA
 * tokens. ALL copy is hers, verbatim from the mockup; the scores are
 * her honest self-scores, not invented numbers. Sits beside the
 * AI-readiness explainer so the two bands read as one story: the
 * explainer is the framework, this map is the honest self-score.
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
  stage: Stage;
  steps: number;
  frontier?: boolean;
  rationale: string;
};

const axes = (auditCount: number): Axis[] => [
  {
    name: "Foundations",
    stage: "teenage",
    steps: 3,
    rationale:
      "A three-tier token architecture (primitive → semantic → component), a 4px grid, AAA-minded contrast, and zero hard-coded values. The component library is still building out in matched Figma and Storybook pairs.",
  },
  {
    name: "Documentation & Knowledge",
    stage: "growing",
    steps: 2,
    rationale:
      "Every token carries machine-readable metadata (usage, don't, accessibility), alongside DESIGN.md, a bella.json rollup, and an llms.txt map. A browsable doc site is the next build.",
  },
  {
    name: "Governance & Team",
    stage: "growing",
    steps: 2,
    rationale:
      `Governance as code: a ${auditCount}-audit gate that fails the build on drift. Process runs ahead of people here, it is a team of one, which is the honest constraint of a personal system.`,
  },
  {
    name: "Adoption",
    stage: "v1",
    steps: 1,
    rationale:
      "Powers elleta.design today, with CHIP next in line. Few consumers, by design, this is a personal system, not an org rollout.",
  },
  {
    name: "Measurement & Impact",
    stage: "v1",
    steps: 1,
    rationale:
      "Deliberately no vanity metrics. Impact is shown by the working system, not invented numbers. Genuinely early here, and honest about it.",
  },
  {
    name: "AI Readiness",
    stage: "teenage",
    steps: 3,
    frontier: true,
    rationale:
      "The frontier axis, and the thesis. Agents read the system directly over MCP, llms.txt and bella.json expose it in machine form, and the gate stops drift at the source instead of trusting the output. The system defaults agents INTO it, not around it.",
  },
];

export default function BellaMaturityMap({ auditCount }: { auditCount: number }) {
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
    <div className="bmm">
      <p className="bmm-legend">
        <span className="bmm-legend__label">Stages</span>
        <span className="bmm-legend__scale">V1 → Growing → Teenage → Healthy Product</span>
      </p>

      <ul className="bmm-list">
        {/* the column header is presentation for the grid beneath it,
            not a row of data; it is hidden from the accessibility tree
            because each row already names its own values in text. */}
        <li className="bmm-list__item bmm-list__item--head" aria-hidden="true">
          <div className="bmm-axis bmm-axis--head">
            <span className="bmm-axis__name">Axis</span>
            <span className="bmm-axis__stage">Stage</span>
            <span className="bmm-axis__progress">Progress</span>
            {/* one word, like the other three. The sentence version
                ("Why it sits there") is 17 characters of label at the
                13px metadata tier, which the hardened audit:type reads
                as reading text below the floor, correctly. A column
                header is a label; the answer is the column itself. */}
            <span className="bmm-axis__why">Why</span>
          </div>
        </li>

        {axes(auditCount).map((a) => (
          <li key={a.name} className="bmm-list__item">
            {/* ON THE GROUND, not in a card (spec item 4, 27 Jul):
                these rows are prose plus a chart, not an inspectable
                specimen, so they lose the card and gain a rule. */}
            <div className="bmm-axis">
              {/* the ONE .heading-item recipe (audit:reuse); the axis
                  class carries grid rhythm only, never its own type */}
              <h3 className="heading-item bmm-axis__name">{a.name}</h3>
              <span className="bmm-axis__stage">
                <span className={`bmm-badge bmm-badge--${a.stage}`}>
                  {STAGE_LABELS[a.stage]}
                </span>
              </span>
              <span className="bmm-axis__progress">
                <span
                  className="bmm-track"
                  role="img"
                  aria-label={`Stage ${a.steps} of ${STEPS_TOTAL}`}
                >
                  {Array.from({ length: STEPS_TOTAL }, (_, i) => (
                    <span
                      key={i}
                      className={[
                        "bmm-track__step",
                        i < a.steps ? "bmm-track__step--on" : "",
                        i < a.steps && a.frontier ? "bmm-track__step--frontier" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-hidden="true"
                    />
                  ))}
                </span>
                <span className="bmm-track__count">
                  {a.steps}/{STEPS_TOTAL}
                </span>
              </span>
              <p className="bmm-axis__why">{a.rationale}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="ds-section__note bmm-foot" style={{ margin: 0 }}>
        Model:{" "}
        <a
          className="ds-swatch__case"
          href="https://zeroheight.com/maturity/"
          target="_blank"
          rel="noopener noreferrer"
        >
          zeroheight Design System Maturity Model
        </a>{" "}
        (six axes: Foundations, Documentation &amp; Knowledge, Governance &amp;
        Team, Adoption, Measurement &amp; Impact, AI Readiness). Self-assessed by
        Elleta McDaniel, ctrl_alt_design.
      </p>
    </div>
  );
}
