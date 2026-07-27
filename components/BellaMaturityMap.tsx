import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

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
    <section className="ds-section" aria-labelledby="ds-maturity">
      <SectionHeader
        label="AI-enabled design systems · self-assessment"
        id="ds-maturity"
        title="BELLA against the maturity model"
        className="ds-section__header"
      />
      <div className="bmm">
        <p className="ds-section__note" style={{ margin: 0 }}>
          Where my design system stands on zeroheight&apos;s six-axis Design System
          Maturity Model, scored honestly.
        </p>
        <p className="ds-section__note bmm-honest" style={{ margin: 0 }}>
          Not a scoreboard. BELLA is a personal system, so the org-scale axes
          (adoption, team, measurement) are early by design, while the frontier axes
          run deep. The point of a six-axis model is exactly this: strength in one
          place, room in another.
        </p>
        <p className="ds-section__note bmm-scale" style={{ margin: 0 }}>
          <strong>Stages:</strong> V1 → Growing → Teenage → Healthy Product
        </p>
        <ul className="bmm-list">
          {axes(auditCount).map((a) => (
            <li key={a.name} className="bmm-list__item">
              <Card className="h-full" innerClassName="ds-card__inner bmm-axis">
                <div className="bmm-axis__top">
                  <h3 className="heading-item" style={{ margin: 0 }}>
                    {a.name}
                  </h3>
                  <span className={`bmm-badge bmm-badge--${a.stage}`}>
                    {STAGE_LABELS[a.stage]}
                  </span>
                </div>
                <div
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
                </div>
                <p className="ds-section__note" style={{ margin: 0 }}>
                  {a.rationale}
                </p>
              </Card>
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
    </section>
  );
}
