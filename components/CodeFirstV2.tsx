"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseCard from "@/components/CaseCard";
import TokenAnnotation, { FlagLeaders } from "@/components/TokenAnnotation";
import TokenInspector from "@/components/TokenInspector";
import { PullQuote } from "@/components/CaseStudyTypography";
import { BoldText } from "@/lib/richtext";
import { WORK_ITEMS } from "@/lib/workLibrary";
import type { CaseStudy, CaseBlock } from "@/lib/content";

/**
 * Code First on the case shell v2 (brief items 6-13; Carmen ADOPT
 * list + Justine scan rules). Numbered section spine, every screen
 * ONE idea with text BESIDE its visual, foundation shown as
 * artifacts, an honest outcomes band, the journey as numbered law,
 * and a page that never dead-ends (journey, personality CTA, next
 * case, thanks).
 *
 * COPY LAW: everything narrative is her existing approved case copy,
 * pulled from the content file at render time or quoted verbatim in
 * the mechanical constants below (each cites its source). New prose
 * slots are TODO(elleta) and render nothing while empty. This file
 * imports Card and therefore never renders the Heading primitive
 * (card-voice rule);
 * section heads go through SectionHeader.
 */

/* ── mechanical constants (sources cited; no invented voice) ── */

/* the observed drift pair, verbatim fragments from the summary
   context paragraph in content/case-studies/brad-frost.ts */
const DRIFT_FIGMA = "Primary, Large";
const DRIFT_CODE = "variant: action, size: lg";

/* parity table: declared values are the recorded BELLA source values
   (lib/bella/bella.css); the live column reads the running
   stylesheet. All three tokens are deliberately theme-stable so the
   comparison is honest in both themes. */
const PARITY_TOKENS = [
  { token: "--btn-key-radius", declared: "12px" },
  { token: "--spacing-touch-target", declared: "44px" },
  { token: "--spacing-2", declared: "8px" },
] as const;

/* the compact foundation swatch set (live readouts, System-page
   pattern) */
const SWATCHES = ["--color-semantic-background", "--color-card", "--color-ink", "--color-accent-ink"];

/* theming payoff lane: tokens that flip at the DOCUMENT ROOT scope
   (the app ink aliases flip on [data-theme="dark"] body and are not
   readable from the root; verified live 22 Jul) */
const THEME_TOKENS = ["--color-semantic-background", "--color-semantic-background-inverse", "--color-accent-ink"];

/* differentiator band (brief item 9): Elleta's real one. Lines are
   trimmed from approved copy (System page + constitution). Band
   title is hers. */
const BAND_TITLE = "" /* TODO(elleta): the differentiator band title, your voice */;
const DIFFERENTIATORS = [
  { label: "BELLA tokens", line: "A token layer every surface resolves from, read live by this page." },
  { label: "The 13-audit gate", line: "Thirteen audits run before anything ships. Green or it does not merge." },
  { label: "The CLAUDE.md constitution", line: "The repo constitution every session and every agent obeys." },
  { label: "Agent surfaces", line: "llms.txt and /api/bella.json, generated from the live route registry." },
];

/* feature row (brief item 11): the three work areas, two lines each,
   trimmed from the MY ROLE paragraphs in the content file */
const FEATURES = [
  { label: "Component archaeology", line: "Reading Storybook stories, tracing prop structures, mapping how components compose. The prerequisite for everything else." },
  { label: "Figma alignment", line: "Rebuilding Figma components to reflect their code counterparts: variant names matched to prop names, token usage made consistent." },
  { label: "MCP tooling", line: "Using Claude via MCP to interrogate system structure and surface token relationships in minutes instead of hours." },
];

/* the clip summary (brief item 11): three bullets on what the short
   clip shows, derived from the figure caption + decision 02 copy */
const CLIP_BULLETS = [
  "The Figma component library searched live over MCP",
  "Structural questions answered from the actual code, not memory",
  "Recorded with Brad Frost and TJ Pitre; the demo starts at 39:36",
];

/* outcomes band (brief item 12): qualitative cards from the approved
   outcome copy, split at sentence boundaries; the no-invented-numbers
   line is the stated value from the Carmen audit */
const NO_NUMBERS_LINE = "No invented numbers.";
const NO_NUMBERS_DETAIL = "" /* TODO(elleta): one line on why outcomes here stay qualitative */;

/* the journey (brief item 12): numbered phases, one line each,
   derived from the case copy; the in-progress phase is honest (the
   discipline continues on this site) */
const JOURNEY = [
  "Component archaeology: read the system before proposing changes to it.",
  "Figma alignment: variant names and token usage reconciled to code.",
  "MCP investigation: structural questions answered in minutes, verified by hand.",
  "In progress: the same discipline runs this site, gated on every push.",
];

const PERSONALITY_LINE = "" /* TODO(elleta): the personality-break line, your voice */;
const THANKS_LINE = "Thanks for reading.";

/* ── helpers ── */

function para(cs: CaseStudy, pred: (b: CaseBlock) => boolean, child: number): string {
  const block = cs.blocks?.find(pred) as { children?: { kind: string; text?: string }[] } | undefined;
  return block?.children?.[child]?.text ?? "";
}

function useLiveTokens(tokens: readonly string[]): Record<string, string> {
  const [values, setValues] = useState<Record<string, string>>({});
  /* keyed on the token NAMES, not the array identity, so a mapped
     array at a call site cannot re-trigger the effect loop (the
     TokenAnnotation guard, same reason) */
  const namesKey = tokens.join("|");
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const t of namesKey.split("|")) next[t] = cs.getPropertyValue(t).trim();
      setValues(next);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [namesKey]);
  return values;
}

/* ── the ONE screen recipe: kicker spine + text beside visual ── */
function Screen({
  spine,
  id,
  heading,
  flip = false,
  text,
  children,
}: {
  /** numbered spine kicker, e.g. "01 · Foundation" */
  spine: string;
  id: string;
  heading: string;
  /** visual left, text right */
  flip?: boolean;
  text: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="cs2-screen" aria-labelledby={id}>
      <div className={flip ? "cs2-screen__grid cs2-screen__grid--flip" : "cs2-screen__grid"}>
        <div className="cs2-screen__text">
          <p className="ds-section__kicker" style={{ margin: 0 }}>{spine}</p>
          <SectionHeader id={id} title={heading} className="cs2-screen__head" />
          {text}
        </div>
        <div className="cs2-screen__visual">{children}</div>
      </div>
    </section>
  );
}

function P({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <p className="cs2-body">
      <BoldText text={text} strongStyle={{ fontWeight: 600, color: "var(--color-ink)" }} />
    </p>
  );
}

/* ── specimens ── */

/** the before state, visible before any reading (brief item 7): one
    real keycap, two names, the drift annotated with the flag recipe
    (static values: the depicted state is the client system's history,
    so the flags carry the observed pair, not live reads) */
function DriftSpecimen() {
  return (
    <Card className="h-full" innerClassName="ds-card__inner">
      <span className="ds-flaglane">
        <span className="ds-flag">
          <span className="ds-flag__value">{DRIFT_FIGMA}</span>
          <span className="ds-flag__token">Figma</span>
        </span>
        <span className="ds-flag">
          <span className="ds-flag__value">{DRIFT_CODE}</span>
          <span className="ds-flag__token">Storybook</span>
        </span>
      </span>
      <div className="ds-card__demo ds-card__demo--center">
        <FlagLeaders />
        <Button variant="secondary">One button</Button>
      </div>
      <p className="ds-section__note" style={{ margin: 0 }}>
        Same component. Different names. Different assumptions.
      </p>
    </Card>
  );
}

/** the interactive parity specimen (brief item 8): declared source
    value vs the value the running stylesheet renders, per token,
    leaders anchored by the one merged flag recipe */
function ParitySpecimen() {
  const live = useLiveTokens(PARITY_TOKENS.map((p) => p.token));
  return (
    <Card className="h-full" innerClassName="ds-card__inner">
      <TokenAnnotation tokens={PARITY_TOKENS.map((p) => p.token)} />
      <div className="ds-card__demo ds-card__demo--center">
        <FlagLeaders />
        <Button variant="secondary">Specimen</Button>
      </div>
      <ul className="cs2-parity">
        {PARITY_TOKENS.map(({ token, declared }) => {
          const rendered = live[token] || "reading";
          const inSync = rendered === declared;
          return (
            <li key={token} className="cs2-parity__row">
              <span className="ds-swatch__name">{token}</span>
              <span className="ds-swatch__value">design {declared}</span>
              <span className="ds-swatch__value">live {rendered}</span>
              <span className="cs2-parity__state">{rendered === "reading" ? "…" : inSync ? "In sync" : "Drift"}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/** foundation artifacts: compact live swatches (System-page pattern) */
function SwatchStrip() {
  const live = useLiveTokens(SWATCHES);
  return (
    <Card className="h-full" innerClassName="ds-card__inner">
      <ul className="ds-swatches">
        {SWATCHES.map((t) => (
          <li key={t} className="ds-swatch">
            <span className="ds-swatch__plate" style={{ background: `var(${t})` }} aria-hidden="true" />
            <span className="ds-swatch__name">{t}</span>
            <span className="ds-swatch__value">{live[t] || "reading"}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── the composition ── */

export default function CodeFirstV2({ cs }: { cs: CaseStudy }) {
  const summary = cs.blocks?.find((b) => b.kind === "summary") as
    | { context: string; approach: string; outcome: string }
    | undefined;
  const clip = cs.blocks
    ?.flatMap((b) => (b.kind === "section" && "children" in b ? b.children : []))
    .find((b) => b.kind === "figure") as
    | { src: string; alt: string; caption?: string; href?: string; linkLabel?: string; width: number; height: number }
    | undefined;
  const pullQuote = cs.blocks?.find((b) => b.kind === "pullQuote") as { text: string } | undefined;
  const outcomes = (summary?.outcome ?? "").split(/(?<=\.)\s+/).filter(Boolean);
  const nextItem = WORK_ITEMS.find((i) => i.id === "drift"); /* the three stars loop: chip -> code-first -> drift -> chip */

  return (
    <div className="cs2-body-col">
      {/* ── 01 · Foundation: the problem visible before reading ── */}
      <Screen
        spine="01 · Foundation"
        id="cs2-problem"
        heading="The problem, visible"
        text={<P text={summary?.context ?? ""} />}
      >
        <DriftSpecimen />
      </Screen>

      {/* the token layer as an artifact, not a description */}
      <Screen
        spine="01 · Foundation"
        id="cs2-tokens"
        heading="The token layer, live"
        flip
        text={<P text={para(cs, (b) => b.kind === "decision" && b.index === "01", 0)} />}
      >
        <SwatchStrip />
      </Screen>

      {/* the parity specimen */}
      <Screen
        spine="01 · Foundation"
        id="cs2-parity-screen"
        heading="Parity, read live"
        text={
          <>
            <P text={para(cs, (b) => b.kind === "decision" && b.index === "01", 1)} />
            <p className="ds-section__note">
              The specimen beside this text is live: the declared source value and the value
              the running stylesheet renders, per token. If this site drifted, this row would
              say so.
            </p>
          </>
        }
      >
        <ParitySpecimen />
      </Screen>

      {/* readable by AI: the real story */}
      <Screen
        spine="01 · Foundation"
        id="cs2-agents"
        heading="Readable by AI"
        flip
        text={
          <P text={"Two machine-readable surfaces ship with this site, generated from the same registry that renders these pages: **/llms.txt**, a plain-text map of the routes and case studies, and **/api/bella.json**, the token layer, control taxonomy, rules, and case registry as JSON. The audit:agents gate fails the build if either surface disagrees with the live route registry."} />
        }
      >
        <Card className="h-full" innerClassName="ds-card__inner">
          <pre className="ds-agents__code" style={{ margin: 0 }}>
            <code>{`curl https://elleta.design/api/bella.json

{
  "name": "BELLA",
  "positioning": "AI-enabled design systems",
  "tokens": { "--color-page": "...", 300+ more },
  "rules": ["Tokens only; a raw value fails the gate.", ...],
  "cases": [{ "slug": "brad-frost", ... }, ...]
}`}</code>
          </pre>
        </Card>
      </Screen>

      {/* honest before / after */}
      <section className="cs2-screen" aria-label="Before tokens and on system">
        <div className="cs2-row cs2-row--2">
          <Card className="h-full" innerClassName="ds-card__inner">
            <p className="ds-section__kicker" style={{ margin: 0 }}>Before tokens</p>
            <p className="ds-section__note" style={{ margin: 0 }}>
              {DRIFT_FIGMA} in Figma, {DRIFT_CODE} in Storybook. Same component, a year of
              quiet drift, and nobody had noticed because the system still looked right.
            </p>
          </Card>
          <Card className="h-full" innerClassName="ds-card__inner">
            <p className="ds-section__kicker" style={{ margin: 0 }}>On system</p>
            <p className="ds-section__note" style={{ margin: 0 }}>
              Figma and Storybook components aligned across the system. Token layer documented
              with explicit primitive → semantic → component chain.
            </p>
          </Card>
        </div>
      </section>

      {/* ── the differentiator band (item 9): hers, real ── */}
      <section className="cs2-screen" aria-label="The system behind the work">
        {BAND_TITLE.trim() !== "" && <SectionHeader id="cs2-band" title={BAND_TITLE} />}
        <div className="cs2-row cs2-row--4">
          {DIFFERENTIATORS.map((d) => (
            <Card key={d.label} className="h-full" innerClassName="ds-card__inner">
              <p className="ds-section__kicker" style={{ margin: 0 }}>{d.label}</p>
              <p className="ds-section__note" style={{ margin: 0 }}>{d.line}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 02 · The design work ── */}
      <Screen
        spine="02 · The design work"
        id="cs2-work"
        heading="Token alignment and component architecture"
        text={<P text={para(cs, (b) => b.kind === "decision" && b.index === "01", 2)} />}
      >
        {cs.heroImage ? (
          <Card className="h-full" innerClassName="ds-card__inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cs.heroImage}
              alt="The Code First command-center workspace"
              loading="lazy"
              style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)" }}
            />
          </Card>
        ) : null}
      </Screen>

      <Screen
        spine="02 · The design work"
        id="cs2-mcp"
        heading="Using Claude MCP for system investigation"
        flip
        text={
          <>
            <P text={para(cs, (b) => b.kind === "decision" && b.index === "02", 0)} />
            <P text={para(cs, (b) => b.kind === "decision" && b.index === "02", 1)} />
          </>
        }
      >
        {/* the short clip with its three-bullet summary (item 11) */}
        {clip && (
          <Card className="h-full" innerClassName="ds-card__inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={clip.src}
              alt={clip.alt}
              loading="lazy"
              style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)" }}
            />
            <p className="ds-section__kicker" style={{ margin: 0 }}>What you would see</p>
            {/* solid CSS discs via the ONE shared list recipe */}
            <ul className="cs2-bullets">
              {CLIP_BULLETS.map((b) => (
                <li key={b}>
                  <span className="card-list-item">
                    <span className="ds-section__note" style={{ margin: 0 }}>{b}</span>
                  </span>
                </li>
              ))}
            </ul>
            {clip.href && (
              <a href={clip.href} target="_blank" rel="noopener noreferrer" className="demo-link">
                <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span>{" "}
                {clip.linkLabel ?? "Watch the session"}
              </a>
            )}
          </Card>
        )}
      </Screen>

      {pullQuote && <PullQuote>{pullQuote.text}</PullQuote>}

      {/* smaller decisions as one three-column feature row (item 11) */}
      <section className="cs2-screen" aria-label="The three work areas">
        <div className="cs2-row cs2-row--3">
          {FEATURES.map((f) => (
            <Card key={f.label} className="h-full" innerClassName="ds-card__inner">
              <p className="ds-section__kicker" style={{ margin: 0 }}>{f.label}</p>
              <p className="ds-section__note" style={{ margin: 0 }}>{f.line}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 03 · Current chapter ── */}
      <Screen
        spine="03 · Current chapter"
        id="cs2-evidence"
        heading="The same discipline, on this site"
        text={<P text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "Evidence", 0)} />}
      >
        {/* the live inspector, inline and real (no facade needed: it
            is this site's own component) */}
        <TokenInspector />
      </Screen>

      {/* the theming payoff (item 10). The dark contract lives on the
          document root ([data-theme="dark"] body), so nested fixed
          panels are outside the recorded theming contract; the payoff
          uses the REAL contract instead: the same specimen, its lane
          reading live, and the site's own theme toggle flipping every
          value. Copy sentence from the approved System page intro. */}
      <Screen
        spine="03 · Current chapter"
        id="cs2-theming"
        heading="Same tokens, second theme, zero redesign"
        flip
        text={
          <P text={"The dark theme is not a second design. Every surface resolves from the same token layer under the dark contract, so the specimen beside this text flips wholesale with the theme control in the header: same component, same tokens, different resolved values. **Flip the theme and watch the values follow.**"} />
        }
      >
        <Card className="h-full" innerClassName="ds-card__inner">
          <TokenAnnotation tokens={THEME_TOKENS} />
          <div className="ds-card__demo ds-card__demo--center">
            <FlagLeaders />
            <Button variant="secondary">Specimen</Button>
          </div>
        </Card>
      </Screen>

      {/* reflection, her closing prose verbatim */}
      <section className="cs2-screen" aria-label="Reflection">
        <div className="cs2-measure">
          <P text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "CLOSING", 0)} />
          <P text={para(cs, (b) => b.kind === "section" && (b as { eyebrow?: string }).eyebrow === "CLOSING", 1)} />
        </div>
      </section>

      {/* ── OUTCOMES band (item 12): qualitative, one ground ── */}
      <section className="cs2-screen" aria-labelledby="cs2-outcomes">
        <SectionHeader id="cs2-outcomes" title="Outcomes" className="cs2-screen__head" />
        <p className="ds-section__note">
          {NO_NUMBERS_LINE}
          {NO_NUMBERS_DETAIL.trim() !== "" && ` ${NO_NUMBERS_DETAIL}`}
        </p>
        <div className="cs2-row cs2-row--3">
          {outcomes.map((o) => (
            <Card key={o} className="h-full" innerClassName="ds-card__inner">
              <p className="ds-section__note" style={{ margin: 0 }}>{o}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* THE JOURNEY: numbered phases, one line each, the law recipe */}
      <section className="cs2-screen" aria-labelledby="cs2-journey">
        <SectionHeader id="cs2-journey" title="The journey" className="cs2-screen__head" />
        <ol className="ds-rules">
          {JOURNEY.map((j) => (
            <li key={j}>{j}</li>
          ))}
        </ol>
      </section>

      {/* personality break + the ONE contact action on this page */}
      <section className="cs2-screen" aria-label="Get in touch">
        <Card innerClassName="ds-card__inner cs2-personality">
          {PERSONALITY_LINE.trim() !== "" && (
            <p className="ds-section__note" style={{ margin: 0 }}>{PERSONALITY_LINE}</p>
          )}
          <Button variant="primary" href="/contact">Get in touch</Button>
        </Card>
      </section>

      {/* next case: the three stars chain in a loop */}
      {nextItem && (
        <section className="cs2-screen" aria-label="Next case">
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
