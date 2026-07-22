"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import CaseCard from "@/components/CaseCard";
import CaseBeat from "@/components/CaseBeat";
import CaseSpecimen, { SPEC_FLAGS, useResolvedTokens, type FlagState } from "@/components/CaseSpecimen";
import LayerJourney from "@/components/LayerJourney";
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

/* the journey phase-list and the What-shipped rows were folded out of
   beat 05 (template-first fix); both live in git history and the
   content file if a slot wants them back */

const PERSONALITY_LINE = "" /* TODO(elleta): the personality-break line, your voice */;

/* beat 03: what the recorded clip ACTUALLY shows (the old caption
   described a different session). TODO(elleta): refine in your voice. */
const BEAT03_CAPTION =
  "TJ Pitre runs a live audit over Console MCP, pushing changes into the Figma library from the console and using his design-system MCP to surface where the system was lacking, naming conventions, gaps, drift. With Brad Frost.";

/* beat 05 impact: one short statement, hers; renders nothing while
   empty (the keyline carries the takeaway meanwhile) */
const IMPACT_LINE = "" /* TODO(elleta): the short impact statement */;

/* beat 05 metric slots (the plan: _review/ai-enablement-case-and-metrics.md).
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

/** Beat 01 (contract _proto/beat1.html + the shared specimen): ONE
    specimen; the toggle changes ONLY the flag labels and the drift
    colour. Before labels are the ACTUAL resolved values, read live,
    marked hand-set; the specimen itself never changes. */
/* TODO(elleta): auto-play the before -> on-system flip once on
   scroll-into-view? The capability is wired and dormant; flip this
   to true to enable (reduced motion skips to the end state either
   way; the toggle stays available). */
const DRIFT_AUTOPLAY = false;

/** beat 01's visual: self-contained; the toggle in the control slot
    directly above the FLAT stage, the caption in the footnote slot */
function DriftBeat() {
  const d = useDriftBeat();
  return (
    <>
      <div className="scene-control">
        <SegmentedControl
          label="View"
          options={[
            { value: "on", label: "On system" },
            { value: "before", label: "Before" },
          ]}
          value={d.view}
          onChange={d.setView}
        />
      </div>
      <CaseSpecimen flagStates={d.flagStates} label={d.before ? "Before" : "On system"} />
      <div className="scene-foot">
        <p className="cs2-kicker-row" style={{ margin: 0 }}>
          {d.before
            ? "Before: Figma said one thing, the code said another. Same card."
            : "On system: both sides carry the same token names."}
        </p>
      </div>
    </>
  );
}

function useDriftBeat() {
  const [view, setView] = useState("on");
  const before = view === "before";
  /* the dormant auto-play: when enabled, the first scroll into beat
     01 shows Before, then flips to On-system once; reduced motion
     keeps the end state; the toggle stays live throughout */
  useEffect(() => {
    if (!DRIFT_AUTOPLAY) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = document.getElementById("cs2-b1");
    if (!target) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setView("before");
          t = setTimeout(() => setView("on"), 1800);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(target);
    return () => {
      io.disconnect();
      if (t) clearTimeout(t);
    };
  }, []);
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
  const drift = useDriftBeat();
  /* the run controls live in CaseBeat's control slot (template-first
     fix); a bumped signal tells the device to run */
  const [journeySignal, setJourneySignal] = useState(0);
  const [gateSignal, setGateSignal] = useState(0);
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

  return (
    <div className="cs2-body-col">
      {/* the five beats: instances of THE CaseBeat template
          (docs/briefs/case-layout-constitution.md); alternation via
          flip only, headline inside the text column always */}
      <CaseBeat
        index="01"
        kicker="The mismatch"
        headline="The button didn't match the code."
        keyline="Same component. Different names. Different assumptions."
        id="cs2-b1"
        body={
          <>
            <Scannable
              text={summary?.context ?? ""}
              keyline="Same component. Different names. Different assumptions."
            />
            <p className="ds-section__note" style={{ margin: 0 }}>{DEMO_DISCLOSURE}</p>
          </>
        }
        visual={<DriftBeat />}
      />
      <BeatLink index={0} />

      <CaseBeat
        index="02"
        kicker="The proof"
        headline="So I made the tokens testify."
        keyline="Token alignment was the most technically demanding part of the work."
        id="cs2-b2"
        flip
        body={
          <>
            <Scannable
              text={para(cs, (b) => b.kind === "decision" && b.index === "01", 0)}
              keyline="Token alignment was the most technically demanding part of the work."
            />
            <p className="ds-section__note">
              Walk the Tile through the layers and watch each one act on it; the step is
              linkable, and the values re-read on every theme flip.
              <strong> Flip the theme and watch the values follow.</strong>
            </p>
          </>
        }
        control={
          <button type="button" className="demo-btn" onClick={() => setJourneySignal((n) => n + 1)}>
            Run the journey
          </button>
        }
        visual={<LayerJourney runSignal={journeySignal} />}
      />
      <BeatLink index={1} />

      {/* PROPOSAL held from the markups pass, TODO(elleta): the
          recorded session as beat 03's visual, or your pick from
          _review/beat03-viz-ideas.md (the header link returns then).
          The one-session-link law holds: the link lives here. */}
      <CaseBeat
        index="03"
        kicker="The rebuild"
        headline="Then I rebuilt what the system wanted."
        keyline="Several components had diverged between Figma and Storybook over time."
        id="cs2-b3"
        body={
          <>
            <Scannable
              text={para(cs, (b) => b.kind === "decision" && b.index === "01", 1)}
              keyline="Several components had diverged between Figma and Storybook over time."
            />
            {/* TODO(elleta): trim. The MCP paragraph runs long; split
                mechanically below, cut in your voice when you pass. */}
            <Scannable text={para(cs, (b) => b.kind === "decision" && b.index === "02", 0)} />
          </>
        }
        visual={
          clip ? (
            <>
              <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clip.src}
                  alt={clip.alt}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-soft)" }}
                />
                <figcaption className="ds-section__note" style={{ margin: 0 }}>{BEAT03_CAPTION}</figcaption>
              </figure>
            </>
          ) : null
        }
        control={
          clip?.href ? (
            <a href={clip.href} target="_blank" rel="noopener noreferrer" className="demo-btn">
              {clip.linkLabel ?? "Watch the session"}
            </a>
          ) : undefined
        }
      />
      {pullQuote && <PullQuote>{pullQuote.text}</PullQuote>}
      <BeatLink index={2} />

      <CaseBeat
        index="04"
        kicker="The gate"
        headline="Now the system checks itself."
        keyline="The portfolio you are reading runs on the same code-first discipline: a token layer, one component per job, and a governance gate that fails the build on drift."
        id="cs2-b4"
        flip
        body={
          <Scannable
            text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "Evidence", 0)}
            keyline="The portfolio you are reading runs on the same code-first discipline: a token layer, one component per job, and a governance gate that fails the build on drift."
          />
        }
        control={
          <button type="button" className="demo-btn" onClick={() => setGateSignal((n) => n + 1)}>
            Run the gate
          </button>
        }
        visual={<GateRun runSignal={gateSignal} />}
      />
      <BeatLink index={3} />

      <CaseBeat
        index="05"
        kicker="The takeaway"
        headline="What the work walked away with."
        keyline="The highest-value work isn't in the Figma file, it's in the alignment between design intent and implementation reality."
        id="cs2-b5"
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
                a slot renders only when its value has landed. "What
                shipped" folded away: the outcomes live in the content
                file if a slot wants them back. */}
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
