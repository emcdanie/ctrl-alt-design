"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import CaseCard from "@/components/CaseCard";
import CaseSpecimen, { SPEC_FLAGS, useResolvedTokens, type FlagState } from "@/components/CaseSpecimen";
import LayerJourney from "@/components/LayerJourney";
import SystemTree from "@/components/SystemTree";
import GateRun from "@/components/GateRun";
import { PullQuote } from "@/components/CaseStudyTypography";
import { BoldText } from "@/lib/richtext";
import { WORK_ITEMS } from "@/lib/workLibrary";
import type { CaseStudy, CaseBlock } from "@/lib/content";

/**
 * Code First in FIVE beats (PR 41 amendment 2, Elleta 22 Jul 2026):
 * one beat = one scene = one piece of evidence beside its text,
 * numbered 01-05 once each, headings as sentences (her drafts,
 * reword-at-will). Card chrome is dead in the case body; cards
 * survive only in the next-case footer. Spacing by proximity: tight
 * inside a scene, spacing-20 between beats.
 *
 * COPY LAW: narrative is her existing approved case copy pulled from
 * the content file, or a cited mechanical trim; new prose slots are
 * TODO(elleta) and render nothing. The next-case footer renders
 * through CaseCard (the one surviving card surface); section heads
 * go through SectionHeader.
 *
 * MERGED OR DELETED as duplicated evidence (amendment item 1): the
 * swatch strip, the before/on-system caption cards (the opener's
 * toggle IS that story), the standalone parity table (folded into
 * the inspector), the readiness split (now the inspector), the
 * static Readable-by-AI block (now the gate run), the four
 * differentiator cards (now one caption row), the feature row (its
 * copy lives in beat 03's prose source), the embedded token
 * inspector and the theming card (both live on /design-system; the
 * theme story closes beat 02's text).
 */

/* ── beat headings: HER DRAFTS from the brief, reword-at-will ── */
const BEATS = [
  "The button didn't match the code.",
  "So I made the tokens testify.",
  "Then I rebuilt what the system wanted.",
  "Now the system checks itself.",
  "What the work walked away with.",
];

/* one connective sentence between beats, her voice; each renders
   nothing while empty */
const BEAT_LINKS = [
  "" /* TODO(elleta): beat 01 -> 02 */,
  "" /* TODO(elleta): beat 02 -> 03 */,
  "" /* TODO(elleta): beat 03 -> 04 */,
  "" /* TODO(elleta): beat 04 -> 05 */,
];

/* the clarifying line near the live specimens */
const DEMO_DISCLOSURE =
  "The interactive demos run on BELLA, my own system, demonstrating the same method deployed in the client's library. Client code stays the client's.";

/* outcomes: qualitative, from the approved outcome copy; the
   no-invented-numbers line is her stated value */
const NO_NUMBERS_LINE = "No invented numbers.";
const NO_NUMBERS_DETAIL = "" /* TODO(elleta): one line on why outcomes here stay qualitative */;

/* the journey: numbered phases, one line each, derived from the case
   copy; the in-progress phase is honest */
const JOURNEY = [
  "Component archaeology: read the system before proposing changes to it.",
  "Figma alignment: variant names and token usage reconciled to code.",
  "MCP investigation: structural questions answered in minutes, verified by hand.",
  "In progress: the same discipline runs this site, gated on every push.",
];

/* amendment item 8 (previous round), optional and hers: the
   investigation dashboard that did not stick; renders only when her
   words land */
const JOURNEY_FAILURE_LINE = "" /* TODO(elleta) */;

const PERSONALITY_LINE = "" /* TODO(elleta): the personality-break line, your voice */;
const THANKS_LINE = "Thanks for reading.";

/* ── helpers ── */

function para(cs: CaseStudy, pred: (b: CaseBlock) => boolean, child: number): string {
  const block = cs.blocks?.find(pred) as { children?: { kind: string; text?: string }[] } | undefined;
  return block?.children?.[child]?.text ?? "";
}

function P({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <p className="cs2-body">
      <BoldText text={text} strongStyle={{ fontWeight: 600, color: "var(--color-ink)" }} />
    </p>
  );
}

/** Vitaly scannability, applied MECHANICALLY (her training notes:
    layer-cake scanning, inverted pyramid): the keyline is an EXACT
    sentence lifted from her text and front-loaded on the keyline
    recipe (bold ink, never iris); the rest re-chunks at sentence
    boundaries into short paragraphs, every word hers, none written */
function Scannable({ text, keyline }: { text: string; keyline?: string }) {
  if (!text.trim()) return null;
  let rest = text;
  if (keyline && text.includes(keyline)) {
    rest = text.replace(keyline, "").replace(/\s{2,}/g, " ").trim();
  }
  const sentences = rest.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let cur: string[] = [];
  let words = 0;
  for (const sen of sentences) {
    const w = sen.split(/\s+/).length;
    if (words + w > 42 && cur.length) {
      chunks.push(cur.join(" "));
      cur = [];
      words = 0;
    }
    cur.push(sen);
    words += w;
  }
  if (cur.length) chunks.push(cur.join(" "));
  return (
    <>
      {keyline && <p className="cs-decision-why">{keyline}</p>}
      {chunks.map((c) => (
        <P key={c.slice(0, 24)} text={c} />
      ))}
    </>
  );
}

function BeatLink({ index }: { index: number }) {
  const line = BEAT_LINKS[index] ?? "";
  if (line.trim() === "") return null;
  return <p className="cs2-beat__link">{line}</p>;
}

/** Beat 01 (contract _proto/beat1.html + the shared specimen): ONE
    specimen; the toggle changes ONLY the flag labels and the drift
    colour. Before labels are the ACTUAL resolved values, read live,
    marked hand-set; the specimen itself never changes. */
function DriftBeat() {
  const [view, setView] = useState("on");
  const before = view === "before";
  const resolved = useResolvedTokens(SPEC_FLAGS.map((f) => f.token));
  const flagStates: Record<string, FlagState> = {};
  if (before) {
    for (const f of SPEC_FLAGS) {
      flagStates[f.token] = { label: `${resolved[f.token] ?? "…"} hand-set`, tone: "drift" };
    }
  }
  return (
    <div className="cs2-driftbeat">
      <SegmentedControl
        label="View"
        options={[
          { value: "on", label: "On system" },
          { value: "before", label: "Before" },
        ]}
        value={view}
        onChange={setView}
      />
      <CaseSpecimen flagStates={flagStates} label={before ? "Before" : "On system"} />
      <p className="cs2-kicker-row" style={{ margin: 0 }}>
        {before
          ? "Before: Figma said one thing, the code said another. Same card."
          : "On system: both sides carry the same token names."}
      </p>
    </div>
  );
}

/** one beat: the numbered sentence head, then ONE scene */
function Beat({
  index,
  id,
  children,
}: {
  index: number;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cs2-beat" aria-labelledby={id}>
      <div>
        <p className="ds-section__kicker" style={{ margin: 0 }}>{String(index + 1).padStart(2, "0")}</p>
        <SectionHeader id={id} title={BEATS[index]} className="cs2-screen__head" />
      </div>
      {children}
    </section>
  );
}

/* ── the composition ── */

export default function CodeFirstV2({ cs }: { cs: CaseStudy }) {
  const summary = cs.blocks?.find((b) => b.kind === "summary") as
    | { context: string; approach: string; outcome: string }
    | undefined;
  const pullQuote = cs.blocks?.find((b) => b.kind === "pullQuote") as { text: string } | undefined;
  const outcomes = (summary?.outcome ?? "").split(/(?<=\.)\s+/).filter(Boolean);
  const nextItem = WORK_ITEMS.find((i) => i.id === "drift"); /* the three stars loop: chip -> code-first -> drift -> chip */

  return (
    <div className="cs2-body-col">
      {/* ── 01 · the problem, one scene: the drift stage ── */}
      <Beat index={0} id="cs2-b1">
        <div className="cs2-screen__grid">
          <div className="cs2-screen__text">
            {/* keyline: her exact fragment, front-loaded */}
            <Scannable
              text={summary?.context ?? ""}
              keyline="Same component. Different names. Different assumptions."
            />
            <p className="ds-section__note" style={{ margin: 0 }}>{DEMO_DISCLOSURE}</p>
          </div>
          <div className="cs2-screen__visual">
            {/* the shared specimen; the toggle moves only the
                annotation layer (contract _proto/beat1.html) */}
            <DriftBeat />
          </div>
        </div>
        <BeatLink index={0} />
      </Beat>

      {/* ── 02 · the tokens testify: the journey of a component ── */}
      <Beat index={1} id="cs2-b2">
        <div className="cs2-measure">
          <Scannable
            text={para(cs, (b) => b.kind === "decision" && b.index === "01", 0)}
            keyline="Token alignment was the most technically demanding part of the work."
          />
          <p className="ds-section__note">
            Walk the Tile through the layers and watch each one act on it; the step is
            linkable, and the values re-read on every theme flip.
            <strong> Flip the theme and watch the values follow.</strong>
          </p>
        </div>
        {/* amendment 3 item 2: the journey of a component through the
            layers; the former inspector findings are the Readable
            layer's events */}
        <LayerJourney />
        <BeatLink index={1} />
      </Beat>

      {/* ── 03 · the rebuild: the system tree is the scene; the
          session clip follows as the compact media moment.
          TODO(elleta): the tree awaits its own proto (the rebuild
          brief scopes it out); content untouched, only the Z-pattern
          side flipped (visual LEFT after beat 01's visual-right). ── */}
      <Beat index={2} id="cs2-b3">
        {/* visual RIGHT: the clip break left with the session block,
            so beat 03 alternates against beat 04's visual-left
            (the Z-law caught the left-left pair) */}
        <div className="cs2-screen__grid">
          <div className="cs2-screen__text">
            <Scannable
              text={para(cs, (b) => b.kind === "decision" && b.index === "01", 1)}
              keyline="Several components had diverged between Figma and Storybook over time."
            />
            {/* TODO(elleta): trim. The MCP paragraph runs long; split
                mechanically below, cut in your voice when you pass. */}
            <Scannable text={para(cs, (b) => b.kind === "decision" && b.index === "02", 0)} />
          </div>
          <div className="cs2-screen__visual">
            <SystemTree />
          </div>
        </div>
        {pullQuote && <PullQuote>{pullQuote.text}</PullQuote>}
        <BeatLink index={2} />
      </Beat>

      {/* ── 04 · the system checks itself: the gate check on the
          shared specimen, visual-LEFT / text-RIGHT (contract
          _proto/beat4.html) ── */}
      <Beat index={3} id="cs2-b4">
        <GateRun
          text={
            <Scannable
              text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "Evidence", 0)}
              keyline="The portfolio you are reading runs on the same code-first discipline: a token layer, one component per job, and a governance gate that fails the build on drift."
            />
          }
        />
        {/* the machine-surface lines compressed to ONE quiet footer
            (insider metadata, not case content). TODO(elleta): keep
            this footer line or cut it entirely; your call. */}
        <p className="cs2-kicker-row cs2-gatefoot">
          Machine surfaces:{" "}
          <a href="/llms.txt" className="ds-swatch__case">/llms.txt</a> ·{" "}
          <a href="/api/bella.json" className="ds-swatch__case">/api/bella.json</a>
        </p>
        <BeatLink index={3} />
      </Beat>

      {/* ── 05 · the close: outcomes, journey, the exit ── */}
      <Beat index={4} id="cs2-b5">
        <div className="cs2-measure">
          {/* TODO(elleta): trim. The two closing paragraphs run ~90
              words each; split mechanically below, your cuts win. */}
          <Scannable
            text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "CLOSING", 0)}
            keyline="The highest-value work isn't in the Figma file, it's in the alignment between design intent and implementation reality."
          />
          <Scannable text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "CLOSING", 1)} />
        </div>
        <div>
          <p className="ds-section__note" style={{ marginBottom: "var(--spacing-3)" }}>
            {NO_NUMBERS_LINE}
            {NO_NUMBERS_DETAIL.trim() !== "" && ` ${NO_NUMBERS_DETAIL}`}
          </p>
          <ul className="cs2-flatlist">
            {outcomes.map((o) => (
              <li key={o} className="ds-section__note" style={{ margin: 0 }}>{o}</li>
            ))}
          </ul>
        </div>
        <ol className="ds-rules">
          {[...JOURNEY, ...(JOURNEY_FAILURE_LINE.trim() !== "" ? [JOURNEY_FAILURE_LINE] : [])].map((j) => (
            <li key={j}>{j}</li>
          ))}
        </ol>
        <div className="cs2-personality">
          {PERSONALITY_LINE.trim() !== "" && (
            <p className="ds-section__note" style={{ margin: 0 }}>{PERSONALITY_LINE}</p>
          )}
          <Button variant="primary" href="/contact">Get in touch</Button>
        </div>
      </Beat>

      {/* next case: the ONE surviving card, the three stars in a loop */}
      {nextItem && (
        <section className="cs2-beat" aria-label="Next case">
          <SectionHeader label="Next case" title={nextItem.title} className="cs2-screen__head" />
          <div className="cs2-next">
            <CaseCard item={nextItem} />
          </div>
        </section>
      )}

      <p className="cs2-thanks">{THANKS_LINE}</p>
    </div>
  );
}
