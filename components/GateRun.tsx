"use client";

import { useEffect, useRef, useState } from "react";
import CaseSpecimen from "@/components/CaseSpecimen";

/**
 * Beat 03: the gate, SLOW AND ANNOTATED (gate+pullquote spec, Elleta
 * 23 Jul 2026). One check at a time, held long enough to read
 * (~1s per audit). Each of the 13 chips steps pending -> checking ->
 * pass/fail with a state GLYPH beside its label (never colour-only);
 * chip labels stay at full contrast in every state. As each check
 * runs, the beat-01 annotation grammar is the live pointer: the
 * specimen's ring lights the exact part that check inspects (one
 * highlight at a time, the shared leaders/flags layer, nothing
 * invented). audit:tokens keeps the real fail -> fix-at-source ->
 * green moment, now readable. Ends all green, "gate: green (13/13),
 * merged on green", the card clean.
 *
 * State colours are on-system: pass = the clarity pair, fail = the
 * writing pair (both AA both themes, the recorded drift register),
 * checking = a neutral glyph with the BELLA semantic info border
 * (the constitution bans amber; the spec's amber maps to info).
 * Reduced motion settles immediately to the final green state.
 * The run control lives in CaseBeat's control slot (runSignal).
 */

const AUDITS = [
  "structure", "fonts", "tokens", "copy", "reuse", "nda", "controls",
  "parity", "agents", "contrast", "axe", "type", "visual",
] as const;
type Audit = (typeof AUDITS)[number];

/* what each check inspects on the card: the live-pointer zone
   ([data-part] on the specimen; "card" rings the border) */
const ZONES: Record<Audit, string> = {
  structure: "card",
  fonts: "title",
  tokens: "card" /* the hardcoded BORDER, the fail moment */,
  copy: "kicker",
  reuse: "sphere",
  nda: "kicker",
  controls: "tag",
  parity: "tag",
  agents: "sphere",
  contrast: "title",
  axe: "kicker",
  type: "title",
  visual: "corner",
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
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const setChip = (a: Audit, s: ChipState) => setChips((c) => ({ ...c, [a]: s }));

  const run = () => {
    clearTimers();
    const allGreen = Object.fromEntries(AUDITS.map((a) => [a, "ok"])) as Record<Audit, ChipState>;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setChips(allGreen);
      setZone(null);
      setCurrent(null);
      setPhase("done");
      return;
    }
    setChips(Object.fromEntries(AUDITS.map((a) => [a, "pending"])) as Record<Audit, ChipState>);
    setPhase("running");
    let t = 0;
    for (const a of AUDITS) {
      /* the pointer moves, the chip goes checking */
      timers.current.push(
        setTimeout(() => {
          setCurrent(a);
          setZone(ZONES[a]);
          setChip(a, "checking");
        }, t)
      );
      if (a === "tokens") {
        /* the real drift moment: fail, fix at source, re-check green */
        timers.current.push(setTimeout(() => { setChip(a, "bad"); setPhase("fixing"); }, t + STEP_MS));
        timers.current.push(setTimeout(() => { setChip(a, "checking"); setPhase("running"); }, t + STEP_MS + FAIL_HOLD_MS));
        timers.current.push(setTimeout(() => setChip(a, "ok"), t + STEP_MS + FAIL_HOLD_MS + FIX_HOLD_MS));
        t += STEP_MS + FAIL_HOLD_MS + FIX_HOLD_MS;
      } else {
        timers.current.push(setTimeout(() => setChip(a, "ok"), t + STEP_MS));
        t += STEP_MS;
      }
    }
    /* settle: pointer off, card clean, all green */
    timers.current.push(
      setTimeout(() => {
        setCurrent(null);
        setZone(null);
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

  return (
    <div className="gv scene-vis">
      <div className="scene-control">
        <p className="gv-prog" aria-live="polite">
          {phase === "idle" && "idle · 13 audits waiting"}
          {phase === "running" && current && (
            <>checking audit:{current} · <b>{okCount}/13</b></>
          )}
          {phase === "running" && !current && (
            <>running · <b>{okCount}/13</b></>
          )}
          {fixing && (
            <>audit:tokens · border #c7c7c7 hardcoded → fixed at source: --color-border-soft{/* token-waiver: depicted drift value, data not paint */}</>
          )}
          {done && (
            <>gate: <b>green (13/13)</b> · merged on green</>
          )}
        </p>
      </div>
      {/* the beat-01 annotation grammar as the live pointer: the run
          rings the part each check inspects, one at a time */}
      <CaseSpecimen
        zone={zone}
        label={done ? "Green, merged" : fixing ? "Red, fixing" : phase === "running" ? "Running" : "The gate"}
      />
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
