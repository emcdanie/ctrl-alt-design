"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import CaseCard from "@/components/CaseCard";
import CaseScrollTemplate, { BeatBody, type CaseSection } from "@/components/CaseScrollTemplate";
import { FigureFrame, OutcomesCard } from "@/components/CaseTemplateBlocks";
import CaseSpecimen, { SPEC_FLAGS, useResolvedTokens, type FlagState } from "@/components/CaseSpecimen";
import LayerJourney from "@/components/LayerJourney";
import SystemTree from "@/components/SystemTree";
import GateRun from "@/components/GateRun";
import { PullQuote } from "@/components/CaseStudyTypography";
import { BoldText } from "@/lib/richtext";
import { WORK_ITEMS } from "@/lib/workLibrary";
import type { CaseStudy, CaseBlock } from "@/lib/content";

/**
 * Code First on THE scroll-spine template (Elleta's decision record +
 * mapping approval, 22 Jul; spec specs/case-scroll-template). The
 * canonical rail carries the six steps; her five narrative sentences
 * are the section headlines; the PR 41 specimens are re-homed, not
 * rebuilt. SUPERSEDES the five-beat layout for this case (named,
 * recorded in DESIGN.md). All narrative is her approved case copy or
 * her proto drafts; new prose slots are TODO(elleta) and render
 * nothing.
 */

/* connective lines between sections, her voice; render nothing empty */
const SECTION_LINKS = [
  "" /* TODO(elleta): Context -> Problem */,
  "" /* TODO(elleta): Problem -> Key decisions */,
  "" /* TODO(elleta): Key decisions -> Challenges */,
  "" /* TODO(elleta): Challenges -> Impact */,
  "" /* TODO(elleta): Impact -> Outcome */,
];

const DEMO_DISCLOSURE =
  "The interactive demos run on BELLA, my own system, demonstrating the same method deployed in the client's library. Client code stays the client's.";

/* the keyline, her proto draft (case-template.html), verbatim */
const KEYLINE = "A year of quiet drift, and nobody noticed. The system still looked right.";

const NO_NUMBERS_LINE = "No invented numbers.";
const NO_NUMBERS_DETAIL = "" /* TODO(elleta): one line on why outcomes here stay qualitative */;

const JOURNEY = [
  "Component archaeology: read the system before proposing changes to it.",
  "Figma alignment: variant names and token usage reconciled to code.",
  "MCP investigation: structural questions answered in minutes, verified by hand.",
  "In progress: the same discipline runs this site, gated on every push.",
];
const JOURNEY_FAILURE_LINE = "" /* TODO(elleta): the dashboard that did not stick */;

const PERSONALITY_LINE = "" /* TODO(elleta): the personality-break line, your voice */;
const THANKS_LINE = "Thanks for reading.";

/* the clip caption bullets (the session link itself lives in the
   header meta, the one-session-link law) */
const CLIP_BULLETS = [
  "The Figma component library searched live over MCP",
  "Structural questions answered from the actual code, not memory",
  "Recorded with Brad Frost and TJ Pitre",
];

/* ── helpers ── */

function para(cs: CaseStudy, pred: (b: CaseBlock) => boolean, child: number): string {
  const block = cs.blocks?.find(pred) as { children?: { kind: string; text?: string }[] } | undefined;
  return block?.children?.[child]?.text ?? "";
}

function P({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <p className="cst-p">
      <BoldText text={text} strongStyle={{ fontWeight: 600, color: "var(--color-ink)" }} />
    </p>
  );
}

function SectionLink({ index }: { index: number }) {
  const line = SECTION_LINKS[index] ?? "";
  if (line.trim() === "") return null;
  return <p className="cs2-beat__link">{line}</p>;
}

/** Problem-beat specimen: the toggle changes ONLY the flag labels and
    the drift colour; the card never changes (contract beat1.html) */
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
      <p className="cs2-kicker-row" style={{ textAlign: "center" }}>
        {before
          ? "Before: Figma said one thing, the code said another. Same card."
          : "On system: both sides carry the same token names."}
      </p>
    </div>
  );
}

export default function CodeFirstV2({ cs, readingMinutes }: { cs: CaseStudy; readingMinutes: number }) {
  const summary = cs.blocks?.find((b) => b.kind === "summary") as
    | { context: string; approach: string; outcome: string }
    | undefined;
  const clip = cs.blocks
    ?.flatMap((b) => (b.kind === "section" && "children" in b ? b.children : []))
    .find((b) => b.kind === "figure") as { src: string; alt: string } | undefined;
  const pullQuote = cs.blocks?.find((b) => b.kind === "pullQuote") as { text: string } | undefined;
  const outcomes = (summary?.outcome ?? "").split(/(?<=\.)\s+/).filter(Boolean);
  const nextItem = WORK_ITEMS.find((i) => i.id === "drift"); /* the three stars loop */

  const sections: CaseSection[] = [
    {
      step: "Context",
      id: "case-context",
      kicker: "The setup",
      /* no heading: the header holds the thesis */
      body: (
        <>
          <BeatBody
            txt={
              <>
                <P text={summary?.approach ?? ""} />
                <P text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "BACKGROUND", 0)} />
                <p className="ds-section__note" style={{ margin: 0 }}>{DEMO_DISCLOSURE}</p>
              </>
            }
          />
          <SectionLink index={0} />
        </>
      ),
    },
    {
      step: "Problem",
      id: "case-problem",
      kicker: "The mismatch",
      heading: "The button didn't match the code.",
      body: (
        <>
          <BeatBody
            txt={
              <>
                <P text={summary?.context ?? ""} />
                <p className="cs-decision-why cst-keyline">{KEYLINE}</p>
              </>
            }
            fig={
              <FigureFrame>
                <DriftBeat />
              </FigureFrame>
            }
          />
          <SectionLink index={1} />
        </>
      ),
    },
    {
      step: "Key decisions",
      id: "case-decisions",
      kicker: "The proof",
      heading: "So I made the tokens testify.",
      body: (
        <>
          <BeatBody
            txt={<P text={para(cs, (b) => b.kind === "decision" && b.index === "01", 0)} />}
          />
          {/* the journey is the wide device; it owns the row */}
          <LayerJourney />
          <SectionLink index={2} />
        </>
      ),
    },
    {
      step: "Challenges",
      id: "case-challenges",
      kicker: "The rebuild",
      heading: "Then I rebuilt what the system wanted.",
      body: (
        <>
          <BeatBody
            flip
            txt={
              <>
                <P text={para(cs, (b) => b.kind === "decision" && b.index === "01", 1)} />
                <P text={para(cs, (b) => b.kind === "decision" && b.index === "02", 0)} />
              </>
            }
            fig={
              <FigureFrame caption="The real dependency tree: every edge is a verified import in this repo.">
                <SystemTree />
              </FigureFrame>
            }
          />
          {clip && (
            <div className="cst-extrafig" data-zbreak>
              <FigureFrame
                caption={
                  <ul className="cst-figcaption__list">
                    {CLIP_BULLETS.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clip.src}
                  alt={clip.alt}
                  loading="lazy"
                  style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)" }}
                />
              </FigureFrame>
            </div>
          )}
          {pullQuote && <PullQuote>{pullQuote.text}</PullQuote>}
          <SectionLink index={3} />
        </>
      ),
    },
    {
      step: "Impact",
      id: "case-impact",
      kicker: "The gate",
      heading: "Now the system checks itself.",
      body: (
        <>
          <GateRun
            text={<P text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "Evidence", 0)} />}
          />
          <div className="cst-agents">
            <p className="ds-section__note" style={{ margin: 0 }}>
              <a href="/llms.txt" className="ds-swatch__case">/llms.txt</a> is the plain-text map
              of routes and case studies agents read first.
            </p>
            <p className="ds-section__note" style={{ margin: 0 }}>
              <a href="/api/bella.json" className="ds-swatch__case">/api/bella.json</a> serves the
              token layer, control taxonomy, rules, and case registry as JSON.
            </p>
            <p className="cs2-kicker-row">
              BELLA tokens · the 13-audit gate · the CLAUDE.md constitution · agent surfaces
            </p>
          </div>
          <SectionLink index={4} />
        </>
      ),
    },
    {
      step: "Outcome & learnings",
      id: "case-outcome",
      kicker: "The takeaway",
      heading: "What the work walked away with.",
      body: (
        <BeatBody
          txt={
            <>
              <P text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "CLOSING", 0)} />
              <P text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "CLOSING", 1)} />
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
            </>
          }
          fig={
            <div className="cst-outcol">
              <OutcomesCard heading="What shipped" rows={outcomes} />
              <p className="ds-section__note" style={{ margin: 0 }}>
                {NO_NUMBERS_LINE}
                {NO_NUMBERS_DETAIL.trim() !== "" && ` ${NO_NUMBERS_DETAIL}`}
              </p>
            </div>
          }
        />
      ),
    },
  ];

  return (
    <CaseScrollTemplate
      slug="brad-frost"
      eyebrow={cs.eyebrow ?? `${cs.category} · ${cs.year}`}
      title={cs.title}
      sub={cs.summary ?? cs.description}
      readingMinutes={readingMinutes}
      tags={cs.tags}
      sessionLink={{ label: "Watch the recorded session", href: "https://www.youtube.com/watch?v=w6bHNKU_Tn8&t=2376s" }}
      sections={sections}
    >
      {nextItem && (
        <section className="cst-beat" aria-label="Next case">
          <SectionHeader label="Next case" title={nextItem.title} className="cst-bhead__title" />
          <div className="cs2-next">
            <CaseCard item={nextItem} />
          </div>
        </section>
      )}
      <p className="cs2-thanks">{THANKS_LINE}</p>
    </CaseScrollTemplate>
  );
}
