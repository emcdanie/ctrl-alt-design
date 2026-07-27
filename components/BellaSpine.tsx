"use client";

import CaseBeat from "@/components/CaseBeat";
import Heading from "@/components/ui/Heading";
import AgentDemo from "@/components/AgentDemo";
import ContractPipeline from "@/components/ContractPipeline";
import BellaMaturityMap from "@/components/BellaMaturityMap";
import AiReadinessExplainer from "@/components/AiReadinessExplainer";

/**
 * BELLA, the system behind this site (27 Jul 2026).
 *
 * /design-system is no longer a component showcase. It is an
 * EXPLORABLE EXPLANATION of AI-ready design systems, told on the same
 * scroll spine the case studies use, with BELLA as the running proof.
 * One concept per beat, each beat a demo you operate.
 *
 * REUSE, not a new page type: the beats are CaseBeat, the rail is
 * DesignSystemNav's scroll-spy, the instrument and the maturity map are
 * the components already built. Nothing here invents a second way to
 * lay out a page.
 *
 * WHAT THIS REPLACED (deleted with the old DesignSystemSpecimens):
 * the six control specimen cards, the eight-orb case-identity grid,
 * every orb-in-a-card, and the leader-line annotation UI as page
 * furniture. The .trace-host recipe itself SURVIVES untouched, because
 * it powers the primary button, every ui/Card on the site, and the
 * visual gate's card selector. TokenInspector and TokenAnnotation also
 * survive: /quick and /design-system/inspector still consume them.
 */

const GATE = [
  { name: "audit:structure", line: "One route tree per case, the 1240 container everywhere, no arbitrary pixel classes, nothing off palette." },
  { name: "audit:contrast", line: "WCAG AA on every text node, both themes, worst gradient stop included. Unique below 24px fails outside the keycap logo." },
  { name: "audit:copy", line: "No em or en dashes, and one positioning term only." },
  { name: "audit:controls", line: "Keycaps are actions only, max one primary per view, filters and view switches carry their ARIA state." },
  { name: "audit:nda", line: "A whole-tree content grep against a private banned-terms list. Renamed files cannot hide from it." },
  { name: "audit:fonts", line: "Exactly two faces. Unique renders only through the display Heading primitive, the home hero, and the keycap lockup." },
  { name: "audit:tokens", line: "No colour literals and no raw spacing in app or components. Waivers are inline, reasoned, and counted." },
  { name: "audit:reuse", line: "Zero-import components fail. One implementation, no dead copy left rendering." },
  { name: "audit:parity", line: "Every case-study slug has exactly one library row and every case row resolves back to a slug. A case can never be routable but invisible." },
  { name: "audit:agents", line: "The agent surfaces (llms.txt, /api/bella.json) must match the live route registry. An agent surface that lies fails the build." },
  /* both of these ran in the gate but were missing from this list, so
     the page under-reported its own governance (27 Jul) */
  { name: "audit:contract", line: "Every component in the contract exists, every token reference resolves, and every prop and variant appears in the source. A contract that describes code that is not there fails the build." },
  { name: "audit:dark", line: "Every embedded surface adapts to the dark contract. An iframe that ships one skin fails the build." },
  { name: "audit:axe", line: "axe-core against every route in both themes; zero violations to pass. Needs-review nodes are counted and verified by hand." },
  { name: "audit:type", line: "No card surface renders reading text below 16px computed; the shared card body never below 18. Metadata rows are their own tier." },
  { name: "audit:visual", line: "One ground on the System page, sibling specimen cards render equal heights, cover placeholders clear 3:1." },
  /* the harness itself is part of how the gate works */
  { name: "the CI run", line: "tsc, the production build, and every audit run on each pull request and push to main; merge only on green." },
];

const RECEIPT_LABELS = ["What the check said", "What it missed, or caught", "What changed"] as const;
type Receipt = { said: string; missedOrCaught: string; changed: string };
/* Elleta's voice slots, carried over: every field is TODO(elleta) except
   the one line her spec supplied verbatim. Empty fields render nothing. */
const GATE_RECEIPTS: Record<string, Receipt> = {
  "audit:parity": { said: "", missedOrCaught: "", changed: "" },
  "audit:axe": { said: "", missedOrCaught: "", changed: "" },
  "the CI run": { said: "", missedOrCaught: "Caught the Resend bug before merge.", changed: "" },
};

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function BellaSpine({
  auditCount,
  auditCountWord,
}: {
  auditCount: number;
  auditCountWord: string;
}) {
  return (
    <div className="ds-page bella-spine">
      {/* ── BEAT 01, the hook ── */}
      <CaseBeat
        index="01"
        id="ds-agent"
        kicker="AI readiness"
        headline="Can an AI build with your system?"
        keyline="The difference is whether your system is machine-readable."
        body={
          <>
            <p>
              AI tools now assemble interfaces on their own. The question every design
              system faces is whether the agent builds yours right, or makes it up.
            </p>
            <p>Flip the switch and watch the same agent change its mind.</p>
          </>
        }
        visual={<AgentDemo />}
      />

      {/* ── BEAT 02, author vs enforce: the instrument, reused ── */}
      {/* a plain wrapper: ContractPipeline owns the
          <section aria-labelledby="ds-pipeline"> landmark itself, and
          nesting a second named region fails axe landmark-unique */}
      <div className="beat--full">
        <div className="layout-container">
          <ContractPipeline />
        </div>
      </div>

      {/* ── BEAT 03, the gate ── */}
      <CaseBeat
        index="03"
        id="ds-gate"
        kicker="Enforcement"
        headline="A system that cannot refuse is a suggestion."
        keyline={`${capitalise(auditCountWord)} checks run before anything ships.`}
        flip
        body={
          <>
            <p>
              Green or it does not merge, locally and on every pull request. Each check
              below names exactly what it refuses, so a failure is self-documenting.
            </p>
          </>
        }
        visual={
          <div className="ds-gate-table-wrap">
                    <table className="ds-gate-table">
                      <caption className="sr-only">
                        The checks that run before anything ships, and what each one refuses
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Check</th>
                          <th scope="col">What it refuses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {GATE.map((g) => {
                          const r = GATE_RECEIPTS[g.name];
                          const lines = r ? [r.said, r.missedOrCaught, r.changed] : [];
                          return (
                            <tr key={g.name}>
                              <th scope="row">{g.name}</th>
                              <td>
                                {g.line}
                                {lines.some((l) => l.trim() !== "") && (
                                  <span className="ds-gate__receipt">
                                    {lines.map(
                                      (line, i) =>
                                        line.trim() !== "" && (
                                          <span key={RECEIPT_LABELS[i]} style={{ display: "block" }}>
                                            <strong>{RECEIPT_LABELS[i]}:</strong> {line}
                                          </span>
                                        )
                                    )}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
        }
      />

      {/* ── CLOSING BEAT, the honest self-score ── */}
      {/* likewise: BellaMaturityMap owns the ds-maturity landmark */}
      <div className="beat--full">
        <div className="layout-container">
          <AiReadinessExplainer />
          <BellaMaturityMap auditCount={auditCount} />
        </div>
      </div>

      {/* ── The close: the rules, and what is next ── */}
      <section className="beat beat--full" aria-labelledby="ds-close">
        <div className="layout-container">
          <Heading tier="section" as="h2" id="ds-close" className="beat-headline">
            The rules this runs on
          </Heading>
          <ol className="ds-rules">
            <li>No hardcoded hex or px in components. Reference tokens only.</li>
            <li>One implementation: edit the live component and delete the old one. Never leave old and new both rendering.</li>
            <li>The primary is the one 3D moment per view, max one.</li>
            <li>Body min 16px. Never smaller for reading text.</li>
            <li>No em or en dashes anywhere. Use a period, a comma, or &quot;that&quot;.</li>
            <li>Unique is display only: never below 24px outside the keycap logo, never in body, UI, or chrome.</li>
            <li>WCAG AA on every text node, both themes.</li>
            <li>The gate must pass before any work is done. Green or it isn&apos;t done.</li>
          </ol>

          <div className="ds-status" id="ds-status">
            <div className="ds-statusgroup">
              <p className="ds-section__kicker" style={{ margin: 0 }}>Available now</p>
              <ul className="ds-status__list">
                <li>The token layer, both themes</li>
                <li>The control taxonomy, live on every page</li>
                <li>The gate, {auditCountWord} audits and a pre-commit hook</li>
                <li>The dark-mode contract, AA on every route</li>
              </ul>
            </div>
            <div className="ds-statusgroup">
              <p className="ds-section__kicker" style={{ margin: 0 }}>Coming next</p>
              <ul className="ds-status__list">
                <li>Storybook, the full component set</li>
                <li>The Figma leg</li>
                <li>Agent-queryable BELLA Brain (MCP)</li>
                <li>npx bella init distribution</li>
                <li>BFW inspection baseline, pending</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
