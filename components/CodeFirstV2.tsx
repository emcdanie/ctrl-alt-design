"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import CaseCard from "@/components/CaseCard";
import CaseBeat from "@/components/CaseBeat";
import CaseSpecimen, { SPEC_FLAGS, useResolvedTokens, type FlagState } from "@/components/CaseSpecimen";
import LayerJourney from "@/components/LayerJourney";
import { PullQuote } from "@/components/CaseStudyTypography";
import { BoldText } from "@/lib/richtext";
import { WORK_ITEMS } from "@/lib/workLibrary";
import type { CaseStudy, CaseBlock } from "@/lib/content";

/**
 * AI-FLOW RESTRUCTURE (Elleta-approved 22 Jul 2026, after the Vitaly
 * audit; spec: _review/code-first-ai-flow-spec.md). FOUR beats:
 * 01 the mismatch (reconciled to the CARD, matching the specimen),
 * 02 the AI-enabled workflow (the old beat 03 MCP-investigation
 * content folds in; the recorded-session link is its footnote link),
 * 03 the gate, 04 the takeaway. The old "tokens testify / token
 * alignment" framing is retired from render (the paragraphs stay in
 * the content file).
 *
 * COPY LAW: narrative is her existing approved case copy pulled from
 * the content file, or a cited mechanical trim; new prose slots are
 * TODO(elleta) and render nothing (except the beat 02 headline,
 * which renders a marked placeholder because a beat cannot render
 * headline-less). The machine restructures and places; it does not
 * write her voice.
 *
 * Keeps PR 44's wins: the stepped type scale (Heading tiers page /
 * section / case) and the iris control grammar (no black demo
 * register). Part B restores the three animations one commit at a
 * time, controls in the CaseBeat control slot under the body.
 */

/* one connective sentence between beats, her voice; each renders
   nothing while empty */
const BEAT_LINKS = [
  "" /* TODO(elleta): beat 01 -> 02 */,
  "" /* TODO(elleta): beat 02 -> 03 */,
  "" /* TODO(elleta): beat 03 -> 04 */,
];

/* the clarifying line near the specimens; mechanical trim of her
   approved line (simplification pass: "interactive" cut).
   TODO(elleta): confirm the trim. */
const DEMO_DISCLOSURE =
  "The demos run on BELLA, my own system, demonstrating the same method deployed in the client's library. Client code stays the client's.";

/* ── beat 01, reconciled to the CARD (the specimen is the card;
   text and specimen must name the same object). The button
   anecdote ("Primary, Large" / "variant: action, size: lg") is cut
   from render as a cited mechanical trim; the card's what-said-what
   is HER story to tell. Renders nothing while empty. */
const BEAT01_CARD_LINE =
  "" /* TODO(elleta): what the card said in Figma vs what it said in
        code, real names only; the specimen's tokens are the anchor
        (--case-clarity-hi, --color-ink, --color-ink-muted,
        --case-clarity-text, --radius-lg) */;

/* ── beat 02, the AI-enabled workflow: headline + keyline are HERS.
   A beat cannot render headline-less, so the placeholder renders
   VISIBLY marked until she writes it. */
const AI_FLOW_HEADLINE = "TODO(elleta): the AI-flow headline";
const AI_FLOW_KEYLINE = "" /* TODO(elleta): one keyline, bold ink */;

/* beat 02 footnote: what the recorded clip ACTUALLY shows.
   TODO(elleta): refine in your voice. */
const SESSION_CAPTION =
  "TJ Pitre runs a live audit over Console MCP, pushing changes into the Figma library from the console and using his design-system MCP to surface where the system was lacking, naming conventions, gaps, drift. With Brad Frost.";

/* outcomes: qualitative, from the approved outcome copy; the
   no-invented-numbers line is her stated value */
const NO_NUMBERS_LINE = "No invented numbers.";
const NO_NUMBERS_DETAIL = "" /* TODO(elleta): one line on why outcomes here stay qualitative */;

const PERSONALITY_LINE = "" /* TODO(elleta): the personality-break line, your voice */;

/* beat 04 impact: one short statement, hers; renders nothing while
   empty (the keyline carries the takeaway meanwhile) */
const IMPACT_LINE = "" /* TODO(elleta): the short impact statement */;

/* beat 04 metric slots (the plan: _review/ai-enablement-case-and-metrics.md).
   Ladder: BELLA/portfolio numbers are real and yours; client outcomes
   directional, words only. Empty slots render nothing. */
const METRICS: { value: string; label: string; takeaway: string }[] = [
  {
    /* the gate: real, yours, running on the page being read */
    value: "13/13",
    label: "audits green on every push",
    takeaway: "The same gate runs on this site. Nothing merges red." /* TODO(elleta): your wording */,
  },
  {
    value: "" /* TODO(elleta): the BELLA workflow-speed number, e.g. "N components, one pass" */,
    label: "one pass across the library, on BELLA",
    takeaway: "" /* TODO(elleta): the so-what line */,
  },
  {
    value: "" /* TODO(elleta): directional client outcome, words not figures */,
    label: "",
    takeaway: "",
  },
];
const THANKS_LINE = "Thanks for reading.";

/** Beat 03's visual, STATIC INTERIM (Part A): the gate as a settled
    green state. Part B commit 3 restores GateRun. */
const GATE_PASS_FLAGS: Record<string, FlagState> = Object.fromEntries(
  SPEC_FLAGS.map((f) => [f.token, { label: f.token, tone: "pass" } satisfies FlagState])
);

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
  /* keyline is STRIPPED here and rendered by CaseBeat's keyline slot */
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

/** Beat 01's before/on-system toggle, RESTORED (Part B2): moves ONLY
    the annotation layer. Before labels are the ACTUAL resolved
    values, read live, marked hand-set; the card itself is
    probe-identical between states. State lives here so the toggle
    sits in the CaseBeat control slot under the body. (The dormant
    DRIFT_AUTOPLAY stays retired.) */
function useDriftBeat() {
  const [view, setView] = useState("on");
  const before = view === "before";
  const resolved = useResolvedTokens(SPEC_FLAGS.map((f) => f.token));
  const flagStates: Record<string, FlagState> = {};
  if (before) {
    for (const f of SPEC_FLAGS) {
      flagStates[f.token] = { label: `${resolved[f.token] ?? "…"} hand-set`, tone: "drift" };
    }
  }
  return { view, setView, before, flagStates };
}

/* ── the composition ── */

export default function CodeFirstV2({ cs }: { cs: CaseStudy }) {
  /* the run controls live in CaseBeat's control slot under the body
     (AI-flow spec); a bumped signal tells the device to run */
  const [journeySignal, setJourneySignal] = useState(0);
  const drift = useDriftBeat();
  const summary = cs.blocks?.find((b) => b.kind === "summary") as
    | { context: string; approach: string; outcome: string }
    | undefined;
  const pullQuote = cs.blocks?.find((b) => b.kind === "pullQuote") as { text: string } | undefined;
  /* the recorded session figure, straight from the case content */
  const clip = cs.blocks
    ?.flatMap((b) => (b.kind === "section" && "children" in b ? b.children : []))
    .find((b) => b.kind === "figure") as
    | { src: string; alt: string; caption?: string; href?: string; linkLabel?: string }
    | undefined;
  const nextItem = WORK_ITEMS.find((i) => i.id === "drift"); /* the three stars loop: chip -> code-first -> drift -> chip */

  /* beat 01 body, mechanically reconciled to the CARD: the two
     button-anecdote sentences and their anaphoric "And this was one
     of the simpler ones." are cut (cited trim; the card version is
     BEAT01_CARD_LINE, hers). Everything that renders is her copy. */
  const beat01Text = (summary?.context ?? "")
    .replace("The button in Figma said 'Primary, Large.' The button in Storybook said 'variant: action, size: lg.' ", "")
    .replace("And this was one of the simpler ones. ", "");

  return (
    <div className="cs2-body-col">
      {/* the four beats: instances of THE CaseBeat template
          (docs/recipes/case-beat.md); alternation via flip only,
          headline inside the text column always */}
      <CaseBeat
        index="01"
        kicker="The mismatch"
        headline="The card didn't match the code." /* mechanical noun
          swap button -> card (approved reconciliation direction).
          TODO(elleta): confirm the wording. */
        keyline="Same component. Different names. Different assumptions."
        id="cs2-b1"
        body={
          <>
            <Scannable
              text={beat01Text}
              keyline="Same component. Different names. Different assumptions."
            />
            <P text={BEAT01_CARD_LINE} />
            <p className="ds-section__note" style={{ margin: 0 }}>{DEMO_DISCLOSURE}</p>
          </>
        }
        control={
          /* the toggle moves ONLY the annotation layer; SegmentedControl
             is the taxonomy's mutually-exclusive-views control (§5) */
          <SegmentedControl
            label="View"
            options={[
              { value: "on", label: "On system" },
              { value: "before", label: "Before" },
            ]}
            value={drift.view}
            onChange={drift.setView}
          />
        }
        visual={<CaseSpecimen flagStates={drift.flagStates} label={drift.before ? "Before" : "On system"} />}
        foot={
          <p className="cs2-kicker-row" style={{ margin: 0 }}>
            {drift.before
              ? "Before: Figma said one thing, the code said another. Same card."
              : "On system: both sides carry the same token names."}
          </p>
        }
      />
      <BeatLink index={0} />

      {/* beat 02: the AI-enabled workflow. The old beat 03 folds in
          here: the MCP-investigation paragraph is the body, the
          recorded session is the footnote link. The alignment-framing
          paragraphs (decision 01) are retired from render. */}
      <CaseBeat
        index="02"
        kicker="The AI-enabled workflow"
        headline={AI_FLOW_HEADLINE}
        keyline={AI_FLOW_KEYLINE.trim() !== "" ? AI_FLOW_KEYLINE : undefined}
        id="cs2-b2"
        flip
        body={
          <>
            <Scannable text={para(cs, (b) => b.kind === "decision" && b.index === "02", 0)} />
            {/* TODO(elleta): the connective line that lands the AI
                positioning (the component travels the layers; MCP,
                agents, and the gate are steps in that journey). */}
          </>
        }
        control={
          /* SECONDARY iris (flat outline): the page keeps zero
             primaries; the one keycap moment stays unclaimed */
          <Button variant="secondary" onClick={() => setJourneySignal((n) => n + 1)}>
            Run the journey
          </Button>
        }
        visual={<LayerJourney runSignal={journeySignal} />}
        foot={
          <>
            <p className="cs2-kicker-row" style={{ margin: 0 }}>{SESSION_CAPTION}</p>
            {clip?.href && (
              <a href={clip.href} target="_blank" rel="noopener noreferrer" className="demo-link">
                {clip.linkLabel ?? "Watch the session"}
              </a>
            )}
          </>
        }
      />
      {pullQuote && <PullQuote>{pullQuote.text}</PullQuote>}
      <BeatLink index={1} />

      <CaseBeat
        index="03"
        kicker="The gate"
        headline="Now the system checks itself."
        keyline="The portfolio you are reading runs on the same code-first discipline: a token layer, one component per job, and a governance gate that fails the build on drift."
        id="cs2-b3"
        body={
          <Scannable
            /* mechanical trim (simplification pass): the "inspector
               below is live" sentence is cut, the gate visual is a
               still now. TODO(elleta): confirm the trim. */
            text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "Evidence", 0)
              .replace(/\s*The inspector below is live[^.]*\.\s*/, " ")
              .trim()}
            keyline="The portfolio you are reading runs on the same code-first discipline: a token layer, one component per job, and a governance gate that fails the build on drift."
          />
        }
        visual={<CaseSpecimen flagStates={GATE_PASS_FLAGS} label="Green, merged" />}
        foot={
          <p className="cs2-kicker-row" style={{ margin: 0 }}>
            gate: green (13/13) · merged on green
          </p>
        }
      />
      <BeatLink index={2} />

      <CaseBeat
        index="04"
        kicker="The takeaway"
        headline="What the work walked away with."
        keyline="The highest-value work isn't in the Figma file, it's in the alignment between design intent and implementation reality."
        id="cs2-b4"
        flip
        body={
          <>
            {/* the wall is CUT (template-first fix): the second closing
                paragraph, the journey list, and the contact CTA are
                gone; the first closing paragraph holds the beat until
                IMPACT_LINE lands, then it goes too. The Get-in-touch
                button was a second CTA on a reading page; the site nav
                owns Contact. */}
            {IMPACT_LINE.trim() !== "" ? (
              <P text={IMPACT_LINE} />
            ) : (
              <Scannable
                text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "CLOSING", 0)}
                keyline="The highest-value work isn't in the Figma file, it's in the alignment between design intent and implementation reality."
              />
            )}
            {PERSONALITY_LINE.trim() !== "" && (
              <p className="ds-section__note" style={{ margin: 0 }}>{PERSONALITY_LINE}</p>
            )}
          </>
        }
        visual={
          <>
            {/* metric slots, flat (the plan: _review/ai-enablement-case-and-metrics.md);
                a slot renders only when its value has landed. */}
            <dl className="beat-metrics">
              {METRICS.filter((m) => m.value.trim() !== "").map((m) => (
                <div key={m.label || m.value} className="beat-metric">
                  <dt className="beat-metric__kicker">{m.label}</dt>
                  <dd className="beat-metric__value">{m.value}</dd>
                  {m.takeaway.trim() !== "" && (
                    <dd className="beat-metric__takeaway">{m.takeaway}</dd>
                  )}
                </div>
              ))}
            </dl>
            <div className="scene-foot">
              <p className="cs2-kicker-row" style={{ margin: 0 }}>
                {NO_NUMBERS_LINE}
                {NO_NUMBERS_DETAIL.trim() !== "" && ` ${NO_NUMBERS_DETAIL}`}
              </p>
            </div>
          </>
        }
      />

      {/* next case: the ONE surviving card, the three stars in a loop */}
      {nextItem && (
        <section className="cs2-beat" aria-label="Next case">
          {/* tier "case": the smallest display step, a clear step
              below the beat headlines (type-scale fix, 22 Jul 2026) */}
          <SectionHeader label="Next case" tier="case" title={nextItem.title} className="cs2-screen__head" />
          <div className="cs2-next">
            <CaseCard item={nextItem} />
          </div>
        </section>
      )}

      <p className="cs2-thanks">{THANKS_LINE}</p>
    </div>
  );
}
