"use client";

import { useEffect, useRef, useState } from "react";
import CaseSpecimen, { useResolvedTokens, type FlagState } from "@/components/CaseSpecimen";

/**
 * Beat 03: the gate, with READABLE FEEDBACK (gate-feedback spec,
 * Elleta 23 Jul 2026; Vitaly's visibility-of-system-status). One
 * check at a time; as each runs, the ACTIVE annotation flag surfaces
 * the check name + the concrete value + the verdict, larger and
 * bolder than the resting flags (value and glyph in strong), using
 * the beat-01 grammar: the 5 fixed flags whose leaders never cross,
 * land on the part with a dot, render in front. One feedback flag at
 * a time; the ring and the chip rail (pending -> checking(info) ->
 * pass/fail) step as before. Values are REAL where readable live:
 * the title contrast ratio, the computed title face and size, the
 * resolved corner radius; the tokens fail is the approved drift
 * data-quote. The status line sits directly ABOVE the chip rail it
 * summarizes, a size step up, verdict + count bold.
 *
 * Reduced motion settles instantly to the all-green end state with
 * the final status. The run control lives in CaseBeat's control
 * slot (runSignal). Checking wears semantic info (the warm warning
 * hue is constitutionally banned).
 */

const AUDITS = [
  "structure", "fonts", "tokens", "copy", "reuse", "nda", "controls",
  "parity", "agents", "contrast", "axe", "type", "visual",
] as const;
type Audit = (typeof AUDITS)[number];

/* flag anchors: the five verified positions (leaders never cross) */
const F = {
  sphere: "--case-clarity-hi",
  kicker: "--color-ink-muted",
  title: "--color-ink",
  tag: "--case-clarity-text",
  corner: "--radius-lg",
} as const;

/* per check: the ring zone + which resting flag carries the feedback */
const MAP: Record<Audit, { zone: string; flag: string }> = {
  structure: { zone: "card", flag: F.corner },
  fonts: { zone: "title", flag: F.title },
  tokens: { zone: "card", flag: F.corner } /* the BORDER fail moment */,
  copy: { zone: "kicker", flag: F.kicker },
  reuse: { zone: "sphere", flag: F.sphere },
  nda: { zone: "kicker", flag: F.kicker },
  controls: { zone: "tag", flag: F.tag },
  parity: { zone: "tag", flag: F.tag },
  agents: { zone: "sphere", flag: F.sphere },
  contrast: { zone: "title", flag: F.title },
  axe: { zone: "kicker", flag: F.kicker },
  type: { zone: "title", flag: F.title },
  visual: { zone: "corner", flag: F.corner },
};

/* pacing: readable, not a blur */
const STEP_MS = 1000;
const FAIL_HOLD_MS = 1400;
const FIX_HOLD_MS = 1200;

type ChipState = "pending" | "checking" | "ok" | "bad";
type Phase = "idle" | "running" | "fixing" | "done";

const GLYPH: Record<ChipState, string> = { pending: "·", checking: "…", ok: "✓", bad: "✗" };

export default function GateRun({ runSignal = 0 }: { runSignal?: number }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [chips, setChips] = useState<Record<Audit, ChipState>>(
    () => Object.fromEntries(AUDITS.map((a) => [a, "pending"])) as Record<Audit, ChipState>
  );
  const [zone, setZone] = useState<string | null>(null);
  const [current, setCurrent] = useState<Audit | null>(null);
  const [failStage, setFailStage] = useState<"fail" | "fix" | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const specRef = useRef<HTMLDivElement>(null);
  const resolved = useResolvedTokens(["--radius-lg"]);
  const [ratio, setRatio] = useState("…");
  const [titleFace, setTitleFace] = useState("Geist");
  const [titlePx, setTitlePx] = useState("…");

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  /* honest data, read from the rendered card: contrast ratio, face,
     computed title size */
  useEffect(() => {
    const read = () => {
      const title = specRef.current?.querySelector('[data-part="title"]');
      const card = specRef.current?.querySelector('[data-part="card"]');
      if (!title || !card) return;
      const cs = getComputedStyle(title);
      setTitleFace(cs.fontFamily.split(",")[0].replace(/["']/g, "").trim());
      setTitlePx(`${Math.round(parseFloat(cs.fontSize))}px`);
      const lum = (c: number[]) => {
        const f = (v: number) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
      };
      const parse = (s: string) => (s.match(/\d+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
      const l1 = lum(parse(cs.color));
      const l2 = lum(parse(getComputedStyle(card).backgroundColor));
      setRatio(`${((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(1)}:1`);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const setChip = (a: Audit, s: ChipState) => setChips((c) => ({ ...c, [a]: s }));

  const run = () => {
    clearTimers();
    const allGreen = Object.fromEntries(AUDITS.map((a) => [a, "ok"])) as Record<Audit, ChipState>;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChips(allGreen);
      setZone(null);
      setCurrent(null);
      setFailStage(null);
      setPhase("done");
      return;
    }
    setChips(Object.fromEntries(AUDITS.map((a) => [a, "pending"])) as Record<Audit, ChipState>);
    setPhase("running");
    let t = 0;
    for (const a of AUDITS) {
      timers.current.push(
        setTimeout(() => {
          setCurrent(a);
          setZone(MAP[a].zone);
          setChip(a, "checking");
          setFailStage(null);
        }, t)
      );
      if (a === "tokens") {
        /* the real drift moment: fail, fix at source, re-check green */
        timers.current.push(setTimeout(() => { setChip(a, "bad"); setFailStage("fail"); setPhase("fixing"); }, t + STEP_MS));
        timers.current.push(setTimeout(() => { setChip(a, "checking"); setFailStage("fix"); setPhase("running"); }, t + STEP_MS + FAIL_HOLD_MS));
        timers.current.push(setTimeout(() => setChip(a, "ok"), t + STEP_MS + FAIL_HOLD_MS + FIX_HOLD_MS));
        t += STEP_MS + FAIL_HOLD_MS + FIX_HOLD_MS;
      } else {
        timers.current.push(setTimeout(() => setChip(a, "ok"), t + STEP_MS));
        t += STEP_MS;
      }
    }
    timers.current.push(
      setTimeout(() => {
        setCurrent(null);
        setZone(null);
        setFailStage(null);
        setPhase("done");
      }, t + 400)
    );
  };

  /* the beat's control slot drives the run */
  useEffect(() => {
    if (runSignal > 0) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSignal]);

  const fixing = phase === "fixing";
  const done = phase === "done";
  const okCount = AUDITS.filter((a) => chips[a] === "ok").length;

  /* the ACTIVE check's feedback flag: name + concrete value +
     verdict, value and glyph bold. One at a time, on its verified
     anchor; every other flag rests on its token name. */
  const flagStates: Record<string, FlagState> = {};
  if (current) {
    const label =
      current === "tokens" ? (
        failStage === "fix" ? (
          <>tokens · <strong>→ --color-border-soft ✓</strong></>
        ) : (
          <>tokens · <strong>border #c7c7c7 hardcoded ✗</strong>{/* token-waiver: depicted drift value, data not paint */}</>
        )
      ) : current === "contrast" ? (
        <>contrast · title <strong>{ratio} ✓</strong></>
      ) : current === "fonts" ? (
        <>fonts · title <strong>{titleFace} ✓</strong></>
      ) : current === "type" ? (
        <>type · title <strong>{titlePx} ✓</strong></>
      ) : current === "visual" ? (
        <>visual · corner <strong>{resolved["--radius-lg"] || "…"} ✓</strong></>
      ) : (
        <>{current} <strong>✓</strong></>
      );
    flagStates[MAP[current].flag] = {
      label,
      tone: current === "tokens" && failStage === "fail" ? "fail" : "focus",
    };
  }

  return (
    <div ref={specRef} className="gv scene-vis">
      {/* the beat-01 annotation grammar: ring + the one feedback flag */}
      <CaseSpecimen
        zone={zone}
        flagStates={flagStates}
        label={done ? "Green, merged" : fixing ? "Red, fixing" : phase === "running" ? "Running" : "The gate"}
      />
      {/* the status line, directly ABOVE the rail it summarizes; the
          verdict and count carry the weight */}
      <p className={`gv-prog${done ? " gv-prog--done" : ""}`} aria-live="polite">
        {phase === "idle" && "idle · 13 audits waiting"}
        {phase === "running" && current && (
          <>checking audit:{current} · <b>{okCount}/13</b></>
        )}
        {phase === "running" && !current && (
          <>running · <b>{okCount}/13</b></>
        )}
        {fixing && (
          <>audit:tokens · <b>border #c7c7c7 hardcoded ✗</b> → fixed at source: <b>--color-border-soft</b>{/* token-waiver: depicted drift value, data not paint */}</>
        )}
        {done && (
          <>gate: <b>green (13/13)</b> · merged on green</>
        )}
      </p>
      {/* the 13 audits: label + state glyph, never colour-only */}
      <div className="gv-rail" role="log" aria-label="The thirteen audits, in gate order">
        {AUDITS.map((a) => (
          <i
            key={a}
            className={`gv-rail__chip gv-rail__chip--${chips[a]}`}
            aria-label={`audit ${a}: ${chips[a] === "ok" ? "pass" : chips[a] === "bad" ? "fail" : chips[a]}`}
          >
            <span aria-hidden="true" className="gv-rail__glyph">{GLYPH[chips[a]]}</span>
            {a}
          </i>
        ))}
      </div>
    </div>
  );
}
