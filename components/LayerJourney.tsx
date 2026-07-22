"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpecimenCardBody } from "@/components/CaseSpecimen";

/**
 * Beat 02: the layered journey, RESTORED CLEANED (AI-flow spec,
 * Elleta 22 Jul 2026; binding contract _proto/beat2.html +
 * _proto/beat02-onecard.html). The Card travels the layers in
 * journey order, Figma at the top, Production shipped at the bottom;
 * a layer acts on the tile at each step; the gate layer shows a
 * hardcoded value caught and fixed at source. Rail steps are
 * click + keyboard navigable, single-line labels, hash-linkable;
 * the active step wears the ONE travelling trace (.trace-on).
 * Opens on THE GATE (the money shot).
 *
 * Cleaned vs the polish version: the --demo-* register scope is
 * gone (retired in PR 44); the run control lives in CaseBeat's
 * control slot under the body (iris grammar) and drives the run via
 * `runSignal`; prefers-reduced-motion renders the STATIC END STATE
 * (Production, no autoplay, rail still navigable) instead of the
 * old seven-panel stack. In-panel titles are GEIST (Unique never
 * inside a card). The gate layer's drift value is a data-quote,
 * never painted.
 */

const L = [
  {
    slug: "figma",
    n: "Figma",
    d: "the component library, what you design",
    up: "the design",
    title: "FIGMA",
    sub: "The card as drawn",
    flag: true,
    detail: [
      { t: "component  Card", tone: "mut" },
      { t: "prop  brand: periwinkle", tone: "mut" },
      { t: "description: (empty)", tone: "err" },
    ],
  },
  {
    slug: "readable",
    n: "Readable layer",
    d: "descriptions + tokens with meaning",
    up: "names with meaning",
    title: "READABLE LAYER",
    sub: "The gap gets a name",
    detail: [
      { t: "description written in", tone: "ok" },
      { t: "prop brand → variant", tone: "ok" },
      { t: "radius → --radius-lg", tone: "ok" },
    ],
  },
  {
    slug: "bridge",
    n: "The Bridge",
    d: "Code Connect · MCP",
    up: "a wired pair",
    title: "THE BRIDGE",
    sub: "Figma ⇄ code, values stream across",
    detail: [
      { t: "Figma frame ⇄ code snippet", tone: "mut" },
      { t: "asked in minutes", tone: "mut" },
      { t: "verified by hand", tone: "ok" },
    ],
  },
  {
    slug: "code",
    n: "Storybook / Code",
    d: "the source of truth",
    up: "the shipped component",
    title: "STORYBOOK / CODE",
    sub: "The card as shipped",
    detail: [
      { t: '<Card variant="action" size="lg" />', tone: "ok" },
      { t: "resolves from tokens", tone: "mut" },
    ],
  },
  {
    slug: "agents",
    n: "Agents",
    d: "build with it",
    up: "new work, on-system",
    title: "AGENTS",
    sub: "Built only from what the system exposes",
    detail: [
      { t: "agent composes the card", tone: "mut" },
      { t: "can only use exposed tokens", tone: "mut" },
      { t: "nothing off-palette", tone: "ok" },
    ],
  },
  {
    slug: "gate",
    n: "The Gate",
    d: "audit + evals, nothing ships without review",
    up: "only what passes",
    title: "THE GATE",
    sub: "Audit and evals; nothing ships without review",
    gate: true,
    detail: [
      { t: "auditing tokens…", tone: "mut" },
      { t: "✗ border: #c7c7c7, hardcoded", tone: "err" }, // token-waiver: the depicted drift value, quoted as data
      { t: "→ fixed at source: --color-border-soft", tone: "mut" },
      { t: "✓ now passes", tone: "ok" },
    ],
    note: "Second review… now it passes.",
  },
  {
    slug: "production",
    n: "Production",
    d: "published, and watched",
    up: "the finished product",
    title: "PRODUCTION",
    sub: "Published, no new debt",
    detail: [
      { t: "✓ shipped", tone: "ok" },
      { t: "only what the system approved", tone: "mut" },
    ],
  },
] as const;

function Detail({ lines, animate }: { lines: readonly { t: string; tone: string }[]; animate: boolean }) {
  return (
    <div className="jn-detail">
      {lines.map((l, i) => (
        <span
          key={l.t}
          className={`jn-detail__line jn-detail__line--${l.tone}${animate ? " jn-reveal" : ""}`}
          style={animate ? { transitionDelay: `${0.2 + i * 0.35}s` } : undefined}
        >
          {l.t}
        </span>
      ))}
    </div>
  );
}

function Panel({ i, animate }: { i: number; animate: boolean }) {
  const l = L[i];
  const [go, setGo] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    setGo(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)));
    return () => cancelAnimationFrame(raf);
  }, [i, animate]);

  return (
    <div className={`jn-panel${go ? " go" : ""}`}>
      <p className="jn-kickerband">
        <span className="jn-kickerband__tag">Delivers ↑</span> {l.up}
      </p>
      <p className="jn-kicker-where">Layer {i + 1} of 7 · the card is here</p>
      <p className="jn-paneltitle">{l.title}</p>
      {/* the rail label is single-line; the descriptor lives here */}
      <p className="jn-sub">{l.d}</p>
      <p className="jn-sub">{l.sub}</p>
      <div className="jn-stagebox">
        <div className={`jn-mini${"flag" in l && l.flag ? " jn-mini--flagged" : ""}`}>
          <SpecimenCardBody />
        </div>
        <div>
          <Detail lines={l.detail} animate={animate} />
          {"note" in l && l.note && <p className="jn-note">{l.note}</p>}
        </div>
      </div>
      <p className="jn-kickerband jn-recv">
        <span className="jn-kickerband__tag">Receives ↓</span>{" "}
        {i === 0 ? "nothing, this is the origin" : "everything built below, by human or agent"}
      </p>
    </div>
  );
}

/* the one-line label above the demo, her voice */
const JOURNEY_CAPTION = "" /* TODO(elleta): what this demo shows, one line */;

export default function LayerJourney({ runSignal = 0 }: { runSignal?: number }) {
  /* opens on THE GATE, the money shot (proto); reduced motion opens
     on the STATIC END STATE instead (Production, rail navigable) */
  const [step, setStep] = useState(5);
  const [animate, setAnimate] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  /* the beat's control slot drives the run */
  useEffect(() => {
    if (runSignal > 0) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSignal]);

  /* Run: auto-advance through the layers in journey order
     (Figma -> Production); the gate layer holds longer */
  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(L.length - 1);
      window.history.replaceState(null, "", `#journey-${L[L.length - 1].slug}`);
      return;
    }
    let t = 0;
    L.forEach((l, i) => {
      timers.current.push(
        setTimeout(() => {
          setStep(i);
          window.history.replaceState(null, "", `#journey-${l.slug}`);
        }, t)
      );
      t += l.slug === "gate" ? 4200 : 2100;
    });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimate(false);
      setStep(L.length - 1);
    }
    const m = window.location.hash.match(/^#journey-([a-z]+)/);
    if (m) {
      const i = L.findIndex((x) => x.slug === m[1]);
      if (i >= 0) setStep(i);
    }
  }, []);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(L.length - 1, i));
    setStep(next);
    window.history.replaceState(null, "", `#journey-${L[next].slug}`);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    /* journey order: down/right advances toward Production */
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(step + 1);
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(step - 1);
    }
  };

  return (
    /* FLAT (the layout constitution: no card around a visual): rail
       LEFT beside the detail, equal height, adjacent; the rail reads
       in JOURNEY ORDER, Figma at the top, Production at the bottom */
    <div className="jn">
      {JOURNEY_CAPTION.trim() !== "" && (
        <p className="ds-section__kicker jn-caption-slot" style={{ margin: 0 }}>{JOURNEY_CAPTION}</p>
      )}
      <div className="jn-onecard__body">
        <div className="jn-rail" onKeyDown={onKey}>
          {L.map((l, i) => {
            const on = i === step;
            return (
              <button
                key={l.slug}
                type="button"
                className={`jn-step trace-host${on ? " trace-on" : ""}`}
                aria-current={on ? "step" : undefined}
                onClick={() => go(i)}
              >
                {l.n}
              </button>
            );
          })}
        </div>
        <div className="jn-right" id={`journey-${L[step].slug}`}>
          <Panel i={step} animate={animate} />
        </div>
      </div>
    </div>
  );
}
