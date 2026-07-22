"use client";

import { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseCard from "@/components/CaseCard";
import TokenAnnotation, { FlagLeaders, type StageFlag } from "@/components/TokenAnnotation";
import TokenInspector from "@/components/TokenInspector";
import SpecimenStage from "@/components/SpecimenStage";
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

/* the clarifying line near the live specimens (amendment item 7) */
const DEMO_DISCLOSURE =
  "The interactive demos run on BELLA, my own system, demonstrating the same method deployed in the client's library. Client code stays the client's.";

/* stage flags for the demo-register specimens (amendment items 1-6):
   the subject is a neutral demo product component on the scoped
   --demo-* register; the annotations stay BELLA iris. Values resolve
   LIVE inside the stage scope. */
const OPENER_FLAGS: readonly StageFlag[] = [
  { token: "--demo-radius", corner: "tl", zone: "button" },
  { token: "--demo-primary", corner: "tr", zone: "button" },
  { token: "--demo-touch", corner: "bl", zone: "button" },
];
const BUTTON_ANCHORS = {
  "--demo-radius": '[data-part="button"]',
  "--demo-primary": '[data-part="button"]',
  "--demo-touch": '[data-part="button"]',
};

/* parity table: declared values are the recorded demo-register source
   values (globals.css, DESIGN.md record); the live column reads the
   running stylesheet inside the stage scope. All three are
   deliberately theme-stable so the comparison is honest in both
   themes. */
const PARITY_TOKENS = [
  { token: "--demo-radius", declared: "8px" },
  { token: "--demo-touch", declared: "44px" },
  { token: "--demo-primary", declared: "#101114" /* token-waiver: the recorded demo-register source value (DESIGN.md), quoted as DATA for the parity comparison, never painted from here */ },
] as const;

/* the readiness inspection console (amendment item 7): the drift
   CLASSES are the real ones from the engagement (decision 01 copy:
   variant names not matching prop names, values updated in one place
   not the other, undocumented components); the Figma-side values are
   an illustrative pair, labelled as such. Counts are counts of the
   lines below, nothing invented. */
const CONSOLE_LINES: readonly { word: "audit" | "drift" | "pass"; text: string; zone?: string }[] = [
  { word: "audit", text: "reading the component pair: Tile" },
  { word: "drift", text: "description empty in Figma; code documents the prop", zone: "description" },
  { word: "drift", text: "prop name mismatch: brand in Figma, variant in code", zone: "propname" },
  { word: "drift", text: "radius set by hand in Figma; code resolves 8px from the token", zone: "value" },
  { word: "pass", text: "touch target clears 44px on both sides", zone: "button" },
  { word: "pass", text: "ink and surface resolve from tokens", zone: "value" },
  { word: "audit", text: "three drifts, two passes. The gate would fail this pair." },
];

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

/* amendment item 8, optional and hers: one honest line about the
   investigation dashboard that did not stick and what replaced it
   (record-your-failures principle). Renders as a journey line only
   when her words land; no artwork either way. */
const JOURNEY_FAILURE_LINE = "" /* TODO(elleta) */;

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

/* ── specimens (stage recipe, amendment items 1-6) ── */

/** the demo product button: the working subject, --demo-* register
    only, one part carrying the highlight */
function DemoButton({ label }: { label: string }) {
  return (
    <button type="button" className="demo-btn" data-part="button">
      {label}
    </button>
  );
}

/** the opener: the working component floats on the ground; the honest
    before state shows the depicted mess (italic, cramped, off-palette
    colours; the two-typeface law holds even in depictions) and hides
    the annotations */
function DriftStage() {
  return (
    <SpecimenStage flags={OPENER_FLAGS} anchors={BUTTON_ANCHORS} hasBefore>
      <DemoButton label="Book demo" />
    </SpecimenStage>
  );
}

/** the parity stage: same subject, and beneath it the declared source
    value vs the value the running stylesheet renders inside the
    stage scope, verdict in words */
function ParityStage() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState<Record<string, string>>({});
  useEffect(() => {
    const read = () => {
      const el = hostRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      const next: Record<string, string> = {};
      for (const { token } of PARITY_TOKENS) next[token] = cs.getPropertyValue(token).trim();
      setLive(next);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return (
    <SpecimenStage flags={OPENER_FLAGS} anchors={BUTTON_ANCHORS} label="Parity">
      <div ref={hostRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--spacing-6)", minWidth: 0, width: "100%" }}>
        <DemoButton label="Specimen" />
        <ul className="cs2-parity" style={{ maxWidth: "520px", width: "100%" }}>
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
      </div>
    </SpecimenStage>
  );
}

/** the AI-readiness inspection (amendment item 7): the Figma
    representation vs the code component, audit console beneath;
    hovering or focusing a console line highlights the offending prop
    on both sides through the one highlight recipe. NDA-safe: the
    subject is BELLA's own demo tile, the drift classes are the real
    engagement classes, the Figma values an illustrative pair. */
function ReadinessStage() {
  return (
    <SpecimenStage label="Inspection">
      {(setZone) => (
        <div style={{ width: "100%", minWidth: 0 }}>
          <div className="spec-split">
            <div className="spec-split__panel">
              <p className="spec-split__head">Figma, the component as designed</p>
              <ul className="spec-props">
                <li className="spec-props__row">
                  <span>component</span>
                  <span>Tile / Brand</span>
                </li>
                <li className="spec-props__row" data-part="propname">
                  <span>prop</span>
                  <span>brand: periwinkle</span>
                </li>
                <li className="spec-props__row" data-part="description">
                  <span>description</span>
                  <span>(empty)</span>
                </li>
                <li className="spec-props__row" data-part="value">
                  <span>radius</span>
                  <span>set by hand</span>
                </li>
              </ul>
            </div>
            <div className="spec-split__panel">
              <p className="spec-split__head">Code, the component as shipped</p>
              <div className="demo-tile" data-part="value">
                <p className="demo-tile__title">Tile</p>
                <p className="demo-tile__desc" data-part="description">
                  A compact content tile. Variant and size resolve from tokens.
                </p>
                <p className="demo-tile__meta" data-part="propname">variant=&quot;primary&quot; size=&quot;md&quot;</p>
                <span data-part="button" style={{ display: "inline-flex" }}>
                  <button type="button" className="demo-btn">Action</button>
                </span>
              </div>
            </div>
          </div>
          <div className="spec-console" role="group" aria-label="Parity audit console">
            {CONSOLE_LINES.map((l) => (
              <button
                key={l.text}
                type="button"
                className="spec-console__line"
                onMouseEnter={() => setZone(l.zone ?? null)}
                onMouseLeave={() => setZone(null)}
                onFocus={() => setZone(l.zone ?? null)}
                onBlur={() => setZone(null)}
              >
                <span className="spec-console__word">{l.word}</span> · {l.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </SpecimenStage>
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
        text={
          <>
            <P text={summary?.context ?? ""} />
            {/* the one clarifying line near the live specimens
                (amendment item 7) */}
            <p className="ds-section__note" style={{ margin: 0 }}>{DEMO_DISCLOSURE}</p>
          </>
        }
      >
        <DriftStage />
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
              the running stylesheet renders, per token. If this demo drifted, this row would
              say so.
            </p>
          </>
        }
      >
        <ParityStage />
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

      {/* ── 02 · The design work: the AI-readiness inspection replaces
          the Command Center imagery (amendment items 7-8; the Command
          Center remains a Design Lab piece only) ── */}
      <section className="cs2-screen" aria-labelledby="cs2-work">
        <p className="ds-section__kicker" style={{ margin: 0 }}>02 · The design work</p>
        <SectionHeader
          id="cs2-work"
          title="Token alignment and component architecture"
          className="cs2-screen__head"
        />
        <div className="cs2-measure">
          <P text={para(cs, (b) => b.kind === "decision" && b.index === "01", 2)} />
          <p className="ds-section__note">
            The inspection below runs the same parity method: the component as designed
            beside the component as shipped, and the console naming what drifted.
            Illustrative pair; the drift classes are the real ones.
          </p>
        </div>
        <ReadinessStage />
      </section>

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
          {[...JOURNEY, ...(JOURNEY_FAILURE_LINE.trim() !== "" ? [JOURNEY_FAILURE_LINE] : [])].map((j) => (
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
