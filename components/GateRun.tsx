"use client";

import { useEffect, useRef, useState } from "react";
import { SpecimenCardBody } from "@/components/CaseSpecimen";

/**
 * Beat 03: the gate check, the ORIGINAL's clarity trimmed to the
 * half-column (pre-merge spec, Elleta 23 Jul 2026). Three stacked
 * pieces, top to bottom: the status readout, the card itself, and
 * the 13-audit chip rail filling in the REAL package.json order.
 * On run, audit:tokens halts red (the hardcoded border, a
 * data-quote), the card wears the drift outline for that moment,
 * the fix lands at source, the sweep finishes green, "merged on
 * green". The five annotation flags are CUT for legibility at this
 * width; the chips + the status line carry the story. Replayable;
 * reduced motion renders the final green state.
 *
 * The run control lives in CaseBeat's control slot under the body
 * (iris grammar) and drives the run via `runSignal`.
 */

const AUDITS = [
  "structure", "fonts", "tokens", "copy", "reuse", "nda", "controls",
  "parity", "agents", "contrast", "axe", "type", "visual",
] as const;

type Phase = "idle" | "running" | "fixing" | "done";

export default function GateRun({ runSignal = 0 }: { runSignal?: number }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [okCount, setOkCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const run = () => {
    clearTimers();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      setOkCount(AUDITS.length);
      return;
    }
    setPhase("running");
    setOkCount(0);
    let t = 0;
    AUDITS.forEach((a, i) => {
      t += a === "tokens" ? 400 : 300;
      if (a === "tokens") {
        const at = t;
        timers.current.push(setTimeout(() => setPhase("fixing"), at));
        t += 1400; /* the fail + the fix-at-source moment */
        timers.current.push(setTimeout(() => setPhase("running"), t));
      }
      timers.current.push(setTimeout(() => setOkCount(i + 1), t));
    });
    timers.current.push(setTimeout(() => setPhase("done"), t + 400));
  };

  /* the beat's control slot drives the run */
  useEffect(() => {
    if (runSignal > 0) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSignal]);

  const okSet = new Set(AUDITS.slice(0, okCount));
  const fixing = phase === "fixing";
  const done = phase === "done";

  return (
    <div className="gv scene-vis">
      <div className="scene-control">
        <p className="gv-prog" aria-live="polite">
          {phase === "idle" && "idle · 13 audits waiting"}
          {phase === "running" && (
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
      {/* the subject: the plain card; the drift outline marks the
          red moment, nothing else restyles it */}
      <div className={`gv-card${fixing ? " gv-card--fail" : ""}`}>
        <SpecimenCardBody />
      </div>
      {/* the 13 audits, in gate order, filling as they pass */}
      <div className="gv-rail" role="log" aria-label="The thirteen audits, in gate order">
        {AUDITS.map((a) => (
          <i key={a} className={`gv-rail__chip${okSet.has(a) || done ? " ok" : ""}${a === "tokens" && fixing ? " bad" : ""}`}>
            {a}
          </i>
        ))}
      </div>
    </div>
  );
}
