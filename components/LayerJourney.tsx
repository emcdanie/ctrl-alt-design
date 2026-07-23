"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpecimenCardBody } from "@/components/CaseSpecimen";

/**
 * Beat 02: the layered journey, SIMPLIFIED IN PLACE (pre-merge spec,
 * Elleta 23 Jul 2026; keeps the half-column beside the text). The
 * legible essence: the 7-layer rail in journey order (Figma at the
 * top, Production shipped at the bottom) plus the active layer's ONE
 * clean panel: a plain counter, the layer title, one line, and the
 * travelling card. The in-panel audit-trace lines, the Delivers/
 * Receives scaffolding, the descriptor duplicate, and the drift
 * outline are CUT (the gate demo in beat 03 owns the fail-fix story;
 * escalation, not repetition). The gate layer's duplicated caption is
 * fixed to the ONE approved line.
 *
 * Rail steps stay click + keyboard navigable and hash-linkable; the
 * active step wears the ONE travelling trace (.trace-on). Opens on
 * THE GATE. The run control lives in CaseBeat's control slot
 * (runSignal); reduced motion renders the static end state.
 */

const L = [
  { slug: "figma", n: "Figma", title: "FIGMA", sub: "The card as drawn" },
  { slug: "readable", n: "Readable layer", title: "READABLE LAYER", sub: "The gap gets a name" },
  { slug: "bridge", n: "The Bridge", title: "THE BRIDGE", sub: "Figma ⇄ code, values stream across" },
  { slug: "code", n: "Storybook / Code", title: "STORYBOOK / CODE", sub: "The card as shipped" },
  { slug: "agents", n: "Agents", title: "AGENTS", sub: "Built only from what the system exposes" },
  /* the ONE approved gate line (pre-merge spec: the d/sub duplicate
     is dead; this string renders once) */
  { slug: "gate", n: "The Gate", title: "THE GATE", sub: "Audit and evals. Nothing ships without review." },
  { slug: "production", n: "Production", title: "PRODUCTION", sub: "Published, no new debt" },
] as const;

function Panel({ i }: { i: number }) {
  const l = L[i];
  const isGate = l.slug === "gate";
  return (
    <div className="jn-panel">
      <p className="jn-kicker-where">Layer {i + 1} of 7</p>
      <p className="jn-paneltitle">{l.title}</p>
      <p className="jn-sub">{l.sub}</p>
      <div className="jn-stagebox">
        {/* the gate layer wears the beat-03 check-flag grammar: one
            clean flag, straight leader, dot on the card, no crossing
            (gate-feedback spec item 2) */}
        {isGate && (
          <div className="jn-gatecol">
            <div className="jn-checkflag">
              <span>
                tokens · <strong>border #c7c7c7 hardcoded ✗</strong> → <strong>--color-border-soft ✓</strong>{/* token-waiver: depicted drift value, data not paint */}
              </span>
            </div>
            <div className="jn-mini">
              <SpecimenCardBody />
            </div>
          </div>
        )}
        {!isGate && (
          <div className="jn-mini">
            <SpecimenCardBody />
          </div>
        )}
      </div>
    </div>
  );
}

/* the one-line label above the demo, her voice */
const JOURNEY_CAPTION = "" /* TODO(elleta): what this demo shows, one line */;

export default function LayerJourney({ runSignal = 0 }: { runSignal?: number }) {
  /* opens on THE GATE, the money shot (proto); reduced motion opens
     on the STATIC END STATE instead (Production, rail navigable) */
  const [step, setStep] = useState(5);
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
      t += l.slug === "gate" ? 2800 : 1400;
    });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
       LEFT beside the panel, equal height; the rail reads in JOURNEY
       ORDER, Figma at the top, Production at the bottom */
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
          <Panel i={step} />
        </div>
      </div>
    </div>
  );
}
