"use client";

import CaseBeat from "@/components/CaseBeat";
import AgentDemo from "@/components/AgentDemo";
import ContractPipeline from "@/components/ContractPipeline";
import BellaMaturityMap from "@/components/BellaMaturityMap";
import AiReadinessExplainer from "@/components/AiReadinessExplainer";

/**
 * BELLA, the system behind this site: the COMPOSITION (27 Jul 2026).
 *
 * This page is a case study of BELLA and it is now built on the REAL
 * case-study template, the same one Drift and Code First use. It renders
 * inside CaseShellV2 and every section is a CaseBeat. There is no page
 * shell of its own, no left rail, no bespoke section, and no
 * full-width variant: the template has none, and inventing one is what
 * produced four different left edges and a CaseBeat with no gutter.
 *
 * The three demo components (AgentDemo, ContractPipeline,
 * BellaMaturityMap, AiReadinessExplainer) render VISUAL ONLY. The beat
 * owns the eyebrow, the headline, the keyline and the body, exactly as
 * it does on every case route.
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
  { name: "audit:debt", line: "Nothing rots quietly: a doc citing a file that does not exist, a token nothing consumes, a gate table describing audits that no longer run, or an audit tracking a selector that matches nothing." },
  { name: "audit:dark", line: "Every embedded surface adapts to the dark contract. An iframe that ships one skin fails the build." },
  { name: "audit:axe", line: "axe-core against every route in both themes; zero violations to pass. Needs-review nodes are counted and verified by hand." },
  { name: "audit:type", line: "No card surface renders reading text below 16px computed; the shared card body never below 18. Metadata rows are their own tier." },
  { name: "audit:visual", line: "One ground on the System page, sibling specimen cards render equal heights, cover placeholders clear 3:1." },
  /* the harness itself is part of how the gate works */
  { name: "the CI run", line: "tsc, the production build, and every audit run on each pull request and push to main; merge only on green." },
];

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function BellaSpine({
  auditCount,
  auditCountWord,
}: {
  auditCount: number;
  auditCountWord: string;
}) {
  return (
    <>
      {/* ── 01 ── */}
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

      {/* ── 02 ── */}
      <CaseBeat
        index="02"
        id="ds-pipeline"
        kicker="Author, then enforce"
        headline="Authoring is human. Enforcement is deterministic."
        keyline="Move the control and watch the value travel."
        flip
        body={
          <>
            <p>
              A human decides what the token should be. Nothing after that is a matter of
              taste: the manifest regenerates from the same source the page renders from,
              and the gate measures the result.
            </p>
            <p>The maths below runs in this tab, as you move it. None of it is a recording.</p>
          </>
        }
        visual={<ContractPipeline />}
      />

      {/* ── 03 ── WIDE (27 Jul). The table is the demo, so it is the
          VISUAL, and it spans the container in columns. It spent one
          revision in the body slot opposite an almost empty visual
          column, which stranded roughly 1900px of dead ground beside
          it at 1440. The derived count sits with the copy, where it
          reads as the sentence's subject rather than a lonely number.
          Membership of this list is asserted against the real gate in
          BOTH directions by audit:debt, so it cannot drift again. ── */}
      <CaseBeat
        index="03"
        id="ds-gate"
        kicker="Enforcement"
        headline="A system that cannot refuse is a suggestion."
        keyline={`${capitalise(auditCountWord)} checks run before anything ships.`}
        wide
        body={
          <>
            <p>
              Green or it does not merge, locally and on every pull request. Each check names
              exactly what it refuses, so a failure is self-documenting.
            </p>
            <p className="ds-gate-stat">
              <span className="ds-gate-stat__n">{auditCount}</span>
              <span className="ds-gate-stat__l">
                checks, every one of them able to stop a merge
              </span>
            </p>
          </>
        }
        visual={
          <dl className="ds-gate-list">
            {GATE.map((g) => (
              <div key={g.name} className="ds-gate-list__row">
                <dt>{g.name}</dt>
                <dd>{g.line}</dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* ── 04 ── */}
      <CaseBeat
        index="04"
        id="ds-ai-readiness"
        kicker="The frontier axis"
        headline="Into your system, or around it?"
        keyline="A mature system makes going through it the easy path."
        flip
        body={
          <>
            <p>
              Agents read the system directly. When the contract is machine-readable they build
              from it; when it is not, they build around it and the output is guessed rather
              than grounded.
            </p>
            {/* moved out of AiReadinessExplainer (27 Jul): the diagram
                carried a takeaway that restated this beat's keyline
                almost word for word, and a note that belongs with the
                copy. The beat owns the words, the visual owns the
                diagram, and the columns balance as a result. */}
            <p>
              The newest test of a design system isn&apos;t how well humans read it. It&apos;s
              the path an AI takes.
            </p>
          </>
        }
        visual={<AiReadinessExplainer />}
      />

      {/* ── 05 ── WIDE (27 Jul). Six axes compared on one row template
          need the container: the map ran 1876px down half a row while
          the copy beside it ran 241px, which is the emptiest thing on
          the page in the section that should be the most visual. The
          org-scale caveat lives here now, once, instead of here AND in
          the component's own intro notes. ── */}
      <CaseBeat
        index="05"
        id="ds-maturity"
        kicker="Self-assessment"
        headline="Where the system honestly stands."
        keyline="Not a scoreboard. Strength in one place, room in another."
        wide
        body={
          <p>
            BELLA scored against zeroheight&apos;s six-axis Design System Maturity Model. It is
            a personal system, so the org-scale axes (adoption, team, measurement) are early by
            design while the frontier axes run deep. The honest read is the point.
          </p>
        }
        visual={<BellaMaturityMap auditCount={auditCount} />}
      />

      {/* ── 06 ── */}
      <CaseBeat
        index="06"
        id="ds-close"
        kicker="The constitution"
        headline="The rules this runs on."
        keyline="Written down, enforced by the gate, not by memory."
        flip
        body={
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
        }
        visual={
          <div className="ds-status">
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
              </ul>
            </div>
          </div>
        }
      />
    </>
  );
}
