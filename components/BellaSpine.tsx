"use client";

import CaseBeat from "@/components/CaseBeat";
import AgentDemo from "@/components/AgentDemo";
import ContractPipeline from "@/components/ContractPipeline";
import BellaMaturityMap from "@/components/BellaMaturityMap";
import GateExplorer from "@/components/GateExplorer";
import { Button } from "@/components/ui/Button";

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
  auditFiles,
}: {
  auditCount: number;
  auditCountWord: string;
  /** audit name to its script(s), derived from package.json on the server */
  auditFiles: Record<string, string[]>;
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
        /* ONE lead line (28 Jul, readability audit). The beat said the
           same thing four times: keyline, two paragraphs here, then the
           demo's own caption under the cards. The demo makes the point
           by being operated; the copy only has to say what to do.
           WIDE for the same reason: once the copy is one line, half a
           row of text against a two-card demo is mostly empty column,
           and the cards would rather have the width. */
        wide
        body={<p>Flip the switch and watch the same agent change its mind.</p>}
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
        /* WIDE (27 Jul, craft pass). The rail switches to three columns
           at a 900px VIEWPORT, but it was living in half a beat row, so
           at 1440 three cells shared 604px: roughly 15 characters a line
           and a JSON token broken across four lines. The instrument is
           the beat, so it gets the container. */
        wide
        body={
          /* the instrument carries the explanation; the copy states the
             claim once and gets out of its way */
          <p>
            A human decides what the token should be; everything after that is measured in
            this tab as you move it, and none of it is a recording.
          </p>
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
          <p className="ds-gate-stat">
            <span className="ds-gate-stat__n">{auditCount}</span>
            <span className="ds-gate-stat__l">
              checks, every one of them able to stop a merge
            </span>
          </p>
        }
        visual={<GateExplorer audits={GATE} files={auditFiles} />}
      />

      {/* ── the FRONTIER-AXIS MAP IS CUT (28 Jul, readability audit) ──
          It restated beat 01's guessing-versus-grounded point with a
          loose curved diagram against the crisp card language of every
          other demo, and it was the one visual whose labels could not
          hold 16px at any width. Its surviving line moved into the
          AI-readiness row of the maturity table, which is where the
          frontier axis is actually scored. The beats below renumber. */}

      {/* ── 04 ── WIDE. Six axes compared on one row template need the
          container: the map ran 1876px down half a row while the copy
          beside it ran 241px. ── */}
      <CaseBeat
        index="04"
        id="ds-maturity"
        kicker="Self-assessment"
        headline="Where the system honestly stands."
        keyline="Not a scoreboard. Strength in one place, room in another."
        flip
        wide
        body={
          <p>
            Scored against zeroheight&apos;s six-axis model. The org-scale axes are early by
            design; the frontier axes run deep.
          </p>
        }
        visual={<BellaMaturityMap auditCount={auditCount} />}
      />

      {/* ── 05 ── the close (28 Jul, readability audit). It recapped the
          constitution the page had just spent four beats demonstrating,
          and then stopped: no action, no way out, nothing to check. The
          rules list is cut. What is left is the thesis stated once as a
          claim, the artifacts that back it as things you can actually
          open, and the two published sources this argument stands on. ── */}
      <CaseBeat
        index="05"
        id="ds-close"
        kicker="The claim"
        headline="A design system is AI-ready when a machine can build with it correctly."
        keyline="Every claim on this page is a link you can open."
        /* NOT wide, and NOT flipped. Beat 04 flips, so this one cannot
           without putting two beats on the same side, which audit:visual
           refuses. Two columns also suit it: the claim on the left, the
           things that back it on the right, both filled. Wide left the
           right half of the page empty under a closing statement. */
        body={
          <p>
            The manifest below is generated from the same source this page renders from. Read it
            the way an agent would.
          </p>
        }
        visual={
          <div className="ds-close">
            {/* the page's ONE closing action, and it is real: the live
                artifact, not a contact form and not a scroll back up */}
            <div className="ds-close__act">
              <Button href="/api/bella.json" variant="primary">
                Open the live manifest
              </Button>
              <a className="ds-close__alt" href="/llms.txt">
                or read the plain-text route map at /llms.txt
              </a>
            </div>

            <div className="ds-close__cites">
              <p className="ds-section__kicker" style={{ margin: 0 }}>What this stands on</p>
              <ul className="ds-close__list">
                <li>
                  <a
                    href="https://southleft.com/insights/design-systems/context-based-design-systems-a-new-model-for-the-ai-driven-product-lifecycle/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Context-Based Design Systems
                  </a>
                  , TJ Pitre, Southleft. Where the with-contract and without-contract comparison
                  in beat 01 comes from.
                </li>
                <li>
                  <a
                    href="https://zeroheight.com/maturity/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Design System Maturity Model
                  </a>
                  , zeroheight. The six axes BELLA is scored against above.
                </li>
              </ul>
            </div>
          </div>
        }
      />
    </>
  );
}
