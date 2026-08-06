"use client";
/* client boundary like CodeFirstV2: passing the readiness-map rows
   array through a server->client slot trips React's dev key
   validation (false positive, every map inside is keyed); rendering
   the composition client-side like the worked reference clears it */

import { useState } from "react";
import CaseBeat from "@/components/CaseBeat";
import CaseDisplayQuote from "@/components/CaseDisplayQuote";
import CasePlaceholder from "@/components/CasePlaceholder";
import ScaledFrame from "@/components/ScaledFrame";
import { P, Scannable } from "@/components/CaseProse";
import type { CaseStudy } from "@/lib/content";

/* Beat 02 now leads with Elleta's REAL CHIP build (the recreated
   ChipReadinessMap is retired from render, see the PR): an inline
   activation facade, poster still + click-to-load the live scaled frame
   (the same poster-then-load shape Drift keeps for its prototypes; the
   old PrototypeEmbed renderer was deleted in the migration so the facade
   lives here, one client component, no new file). The embedded frame
   keeps its own skin. */
type ProtoBlock = {
  src: string;
  title: string;
  designWidth?: number;
  designHeight?: number;
  poster?: string;
  posterAlt?: string;
};

function BridgeEmbed({ proto }: { proto: ProtoBlock }) {
  const [loaded, setLoaded] = useState(false);
  const w = proto.designWidth ?? 1280;
  const h = proto.designHeight ?? 800;
  if (loaded) {
    return <ScaledFrame src={proto.src} title={proto.title} designWidth={w} designHeight={h} interactive />;
  }
  return (
    <button
      type="button"
      className="chip-proto-facade"
      onClick={() => setLoaded(true)}
      aria-label={`Load the live CHIP prototype: ${proto.title}`}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        aspectRatio: `${w} / ${h}`,
        padding: 0,
        border: "none",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        cursor: "pointer",
        background: "var(--color-surface)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={proto.poster ?? ""}
        alt={proto.posterAlt ?? proto.title}
        loading="lazy"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "var(--spacing-5)",
          background: "linear-gradient(to top, color-mix(in srgb, var(--color-ink) 34%, transparent), transparent 46%)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--spacing-2)",
            padding: "var(--spacing-2) var(--spacing-5)",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid var(--color-accent-ink)",
            background: "var(--color-card)",
            color: "var(--color-accent-ink)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--typography-font-size-tag)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-eyebrow)",
          }}
        >
          Load the live prototype
        </span>
      </span>
    </button>
  );
}

/**
 * CHIP on the CaseBeat template (case-migration kickoff step 2 of 2,
 * Elleta 23 Jul; worked references CodeFirstV2 / DriftV2). STRUCTURAL
 * MIGRATION, NOT A REWRITE: every rendered sentence is her approved
 * copy from content/case-studies/chip.ts redistributed into four
 * beats; the one mechanical split (the approach paragraph, at her
 * "Then I wired" sentence boundary) is cited below; every NEW word a
 * slot needs is marked TODO(elleta). Visuals: the three evidence
 * figures and, on beat 02, Elleta's REAL CHIP build embedded as a
 * poster-then-load prototype (the recreated ChipReadinessMap it replaced
 * is retired and deleted; notes preserved in git history, see the PR).
 *
 * Beat map (headlines = her decision titles / lessons close,
 * keylines = her why lines / lessons lead, all verbatim):
 * 01 the judgment layer -> 02 my own systems -> 03 in public ->
 * 04 the machine.
 */

/* kickers: mechanical extractions of her own phrases ("the judgment
   layer", "my own systems", "building in public", "let it change the
   machine"). TODO(elleta): confirm all four. */
const KICKERS = ["The judgment layer", "My own systems", "In public", "The machine"];

/* the approach paragraph splits at her sentence boundary: the course
   + own-systems sentences tell beat 02, the CHIP-wiring + governing
   decision sentences tell beat 01. Cited mechanical split, no words
   changed. */
const WIRE_SENTENCE = "Then I wired the readiness map into CHIP";

/* the takeaway (beat 04) now reads from the chip.ts lessons block:
   text = display headline, offer = bold keyline, body = closing
   paragraph (Elleta-approved verbatim, leads with the offer). */

/* beat 03: the two points lifted out of the keyline (now "Honesty beats
   polish.") land here as the body's proof line. TODO(elleta): confirm. */
const B3_PROOF_LINE = "Shipping is the proof. No invented numbers.";

type FigureBlock = { kind: string; src: string; alt: string; caption?: string };

export default function ChipCase({ cs }: { cs: CaseStudy }) {
  const summary = cs.blocks?.find((b) => b.kind === "summary") as
    | { context: string; approach: string; outcome: string }
    | undefined;
  const decision = (index: string) =>
    cs.blocks?.find((b) => b.kind === "decision" && (b as { index?: string }).index === index) as
      | { title: string; why?: string; evidence?: { kind: string } & Partial<ProtoBlock> }
      | undefined;
  const d1 = decision("01");
  const d2 = decision("02");
  const d3 = decision("03");
  const pullQuote = cs.blocks?.find((b) => b.kind === "pullQuote") as { text: string } | undefined;
  const figures = (cs.blocks?.filter((b) => b.kind === "figure") ?? []) as FigureBlock[];
  const figure = (key: string) => figures.find((f) => f.src.includes(key));
  const inboxFig = figure("approve-inbox");
  const systemMapFig = figure("system-map");
  const frictionFig = figure("friction-log");
  /* beat 02 evidence: Elleta's real CHIP build, a prototype block */
  const bridgeProto = d2?.evidence?.kind === "prototype" ? (d2.evidence as ProtoBlock) : undefined;
  const paragraphs = (cs.blocks?.filter((b) => b.kind === "paragraph") ?? []) as { text: string }[];
  const constraints = paragraphs.find((p) => p.text.startsWith("Constraints:"))?.text ?? "";
  const credit = paragraphs.find((p) => p.text.startsWith("Credit:"))?.text ?? "";
  const lessons = cs.blocks?.find((b) => b.kind === "lessons") as
    | { text: string; offer?: string; body?: string }
    | undefined;
  /* the cited approach split (WIRE_SENTENCE) */
  const approach = summary?.approach ?? "";
  const wireAt = approach.indexOf(WIRE_SENTENCE);
  const approachOwnSystems = wireAt >= 0 ? approach.slice(0, wireAt).trim() : approach;
  const approachGoverning = wireAt >= 0 ? approach.slice(wireAt).trim() : "";

  const fig = (f?: FigureBlock) =>
    f ? (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={f.src}
        alt={f.alt}
        loading="lazy"
        style={{ width: "100%", height: "auto", borderRadius: "var(--radius-xl)", display: "block" }}
      />
    ) : (
      <CasePlaceholder />
    );

  return (
    <div className="cs2-body-col">
      {/* 01 · the judgment layer: the governing decision; the approve
          inbox is the watch/catch/draft/approve/log UI itself */}
      <CaseBeat
        index="01"
        kicker={KICKERS[0]}
        headline={d1?.title ?? ""}
        keyline={d1?.why}
        id="chip-b1"
        body={
          <>
            <Scannable text={summary?.context ?? ""} />
            <Scannable text={approachGoverning} />
          </>
        }
        visual={fig(inboxFig)}
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>{inboxFig?.caption}</p>}
      />

      {/* 02 · my own systems: the inspection pointed inward. The visual
          is now Elleta's REAL CHIP build, embedded as a poster-then-load
          prototype (supersedes the recreated ChipReadinessMap). */}
      <CaseBeat
        index="02"
        kicker={KICKERS[1]}
        headline={d2?.title ?? ""}
        keyline={d2?.why}
        id="chip-b2"
        flip
        body={<Scannable text={approachOwnSystems} />}
        control={
          /* §5 SECONDARY: flat iris outline (the .btn-key base), never the
             primary keycap. Opens the real CHIP build in a new tab. */
          <a
            className="btn-key"
            href="/demos/chip-bridge/index.html"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the live CHIP prototype (opens in a new tab)"
          >
            Open the live CHIP prototype
          </a>
        }
        visual={bridgeProto ? <BridgeEmbed proto={bridgeProto} /> : <CasePlaceholder />}
      />

      {/* the shared pull-quote after beat 02 (case-align), her thesis in the
          case accent; same slot Code First uses */}
      {pullQuote && (
        <CaseDisplayQuote
          text={pullQuote.text}
          accent="your system"
          accentColor="var(--case-chip-text)"
        />
      )}

      {/* 03 · in public: the honest prototype; the friction log kept
          in the open */}
      <CaseBeat
        index="03"
        kicker={KICKERS[2]}
        headline={d3?.title ?? ""}
        keyline={d3?.why}
        id="chip-b3"
        body={
          <>
            <Scannable text={summary?.outcome ?? ""} />
            <P text={B3_PROOF_LINE} />
            <P text={constraints} />
          </>
        }
        visual={fig(frictionFig)}
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>{frictionFig?.caption}</p>}
      />

      {/* 04 · the machine: the takeaway leads with the offer (keyline)
          over the closing paragraph; credit line closes the body */}
      <CaseBeat
        index="04"
        kicker={KICKERS[3]}
        headline={lessons?.text ?? ""}
        keyline={lessons?.offer}
        id="chip-b4"
        flip
        body={
          <>
            <Scannable text={lessons?.body ?? ""} />
            <P text={credit} />
          </>
        }
        visual={fig(systemMapFig)}
        foot={<p className="cs2-kicker-row" style={{ margin: 0 }}>{systemMapFig?.caption}</p>}
      />

      {/* next case + share now render once via CaseShellV2 (CaseEndReveal) */}
    </div>
  );
}
