"use client";

import CaseBeat from "@/components/CaseBeat";
import AgentDemo from "@/components/AgentDemo";
import ContractPipeline from "@/components/ContractPipeline";
import BellaMaturityMap from "@/components/BellaMaturityMap";
import Container from "@/components/layout/Container";
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
  { name: "audit:structure", line: "One route tree per case, the one container everywhere, no arbitrary pixel classes, nothing off palette." },
  { name: "audit:layout", line: "Every route is listed and built from Section and SectionHeader. No page sets its own spacing." },
  { name: "audit:frame", line: "Reads the pixels at three widths: one content edge, two title sizes, one section rhythm, radii from the set, two card styles at most, no line past the reading measure." },
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
  { name: "audit:sync", line: "Components vendored from BELLA are hashed against the upstream source. A vendored file edited in place, or left stale, fails the build instead of forking quietly." },
  { name: "audit:dark", line: "Every embedded surface adapts to the dark contract. An iframe that ships one skin fails the build." },
  { name: "audit:axe", line: "axe-core against every route in both themes; zero violations to pass. Needs-review nodes are counted and verified by hand." },
  { name: "audit:order", line: "Reading order is pinned: accessibility-tree snapshots at 1440 and 390 fail when what a screen reader reads changes, and CSS that reorders content visually is listed for review." },
  { name: "audit:type", line: "No card surface renders reading text below 16px computed; the shared card body never below 18. Metadata rows are their own tier." },
  { name: "audit:visual", line: "One ground on the System page, sibling specimen cards render equal heights, cover placeholders clear 3:1." },
  /* the harness itself is part of how the gate works */
  { name: "the CI run", line: "tsc, the production build, and every audit run on each pull request and push to main; merge only on green." },
];

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* the five audits that matter most, each with what it stops (Part R,
   21 Sep 2026); the rest sit behind one disclosure, from GATE above */
const TOP: { name: string; stops: string }[] = [
  { name: "audit:frame", stops: "A page off the frame: a second content edge, a stray title size, a third card style." },
  { name: "audit:contrast", stops: "Any text under WCAG AA, in either theme." },
  { name: "audit:axe", stops: "Any axe violation, on any route, in either theme." },
  { name: "audit:tokens", stops: "A raw colour or spacing value in the code." },
  { name: "audit:nda", stops: "A client or employer name, anywhere in the tree." },
];
const REST = GATE.filter((g) => !TOP.some((t) => t.name === g.name));

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
        visual={
          /* a plain list, not a grid of twenty buttons (Part R): the five
             that matter most, then the rest behind one disclosure */
          <div className="ds-gate">
            <ul className="ds-gate__list">
              {TOP.map((a) => (
                <li key={a.name}>
                  <span className="text-code ds-gate__name">{a.name}</span>
                  <span>{a.stops}</span>
                </li>
              ))}
            </ul>
            <details className="ds-gate__more">
              <summary>and {auditCount - TOP.length} more</summary>
              <ul className="ds-gate__list">
                {REST.map((a) => (
                  <li key={a.name}>
                    <span className="text-code ds-gate__name">{a.name}</span>
                    <span>{a.line}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        }
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

      {/* ── the close (Part R, 21 Sep 2026): the claim as the page's last
          line, with its one action, the live manifest. No section of its
          own and no sources list: the two sources are linked where their
          claims are made (beat 01, and the maturity table's note). ── */}
      <section className="l-section section--ruled ds-claim" aria-labelledby="ds-claim-heading">
        <Container>
          <h2 id="ds-claim-heading" className="case-section__heading ds-claim__line">
            AI-ready means a machine builds with it correctly.
          </h2>
          <Button href="/api/bella.json" variant="primary">
            Open the live manifest
          </Button>
        </Container>
      </section>
    </>
  );
}
