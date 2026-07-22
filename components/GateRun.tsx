"use client";

import { useEffect, useRef, useState } from "react";
import CaseSpecimen, { type FlagState, useResolvedTokens } from "@/components/CaseSpecimen";

/**
 * Beat 04: the gate check (binding contract _proto/beat4.html), on
 * the SHARED case-card specimen (the site's own component; the
 * proto's keycap subject would be a second visible primary, which
 * audit:controls hard-fails, and the shared-specimen mandate names
 * the case card for all three beats). On run, the thirteen audits
 * sweep in the REAL package.json order; the featured checks
 * highlight the exact part they validate and flip that flag to a
 * green PASS with values read LIVE from the rendered card;
 * audit:tokens fails first (the hardcoded border, a data-quote),
 * fixes at source to --color-border-soft, goes green; the 13-audit
 * rail fills; ends "gate: green (13/13), merged on green".
 * Replayable; reduced motion renders the final green state with the
 * red moment resolved. The run control is the iris run action from
 * the proto, deliberately NOT a keycap.
 */

const AUDITS = [
  "structure", "fonts", "tokens", "copy", "reuse", "nda", "controls",
  "parity", "agents", "contrast", "axe", "type", "visual",
] as const;

/* featured checks validate a specimen part (proto map, on the card) */
const MAP: Record<string, { token: string; zone: string }> = {
  tokens: { token: "--case-clarity-hi", zone: "sphere" },
  contrast: { token: "--color-ink", zone: "title" },
  visual: { token: "--radius-lg", zone: "corner" },
  controls: { token: "--case-clarity-text", zone: "tag" },
  axe: { token: "--color-ink-muted", zone: "kicker" },
};

type Phase = "idle" | "running" | "fixing" | "done";

export default function GateRun({ runSignal = 0 }: { runSignal?: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [okCount, setOkCount] = useState(0);
  const [zone, setZone] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resolved = useResolvedTokens(["--radius-lg", "--color-ink", "--color-ink-muted"]);
  const specRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState("…");

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  /* honest data: the title contrast ratio, read from the rendered card */
  useEffect(() => {
    const read = () => {
      const title = specRef.current?.querySelector('[data-part="title"]');
      const card = specRef.current?.querySelector('[data-part="card"]');
      if (!title || !card) return;
      const lum = (c: number[]) => {
        const f = (v: number) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
      };
      const parse = (s: string) => (s.match(/\d+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
      const l1 = lum(parse(getComputedStyle(title).color));
      const l2 = lum(parse(getComputedStyle(card).backgroundColor));
      setRatio(`${((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(1)}:1`);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

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

  /* the beat's control slot drives the run (template-first fix) */
  useEffect(() => {
    if (runSignal > 0) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSignal]);

  const okSet = new Set(AUDITS.slice(0, okCount));
  const fixing = phase === "fixing";
  const done = phase === "done";

  /* flag states follow the sweep: featured checks flip their flag */
  const flagStates: Record<string, FlagState> = {};
  for (const [audit, m] of Object.entries(MAP)) {
    if (audit === "tokens" && fixing) {
      flagStates[m.token] = { label: "FAIL · border hardcoded → --color-border-soft", tone: "fail" };
    } else if (okSet.has(audit as (typeof AUDITS)[number]) || done) {
      const label =
        audit === "contrast"
          ? `PASS · title ${ratio}`
          : audit === "visual"
            ? `PASS · corner ${resolved["--radius-lg"] || ""}`.trim()
            : audit === "tokens"
              ? "PASS · border --color-border-soft"
              : audit === "controls"
                ? "PASS · tag hit area"
                : "PASS · meta from token";
      flagStates[m.token] = { label, tone: "pass" };
    }
  }

  return (
    /* the gate device fills the ONE scene skeleton's visual column:
       [control slot: Run + progress] [the specimen] [footnote slot:
       the audit chips, the console, the machine surfaces] */
    <div ref={hostRef} className="gv scene-vis">
      <div className="scene-control demo-scope">
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
      <div ref={specRef} data-hl={zone ?? undefined} className="gv-host">
        <CaseSpecimen flagStates={flagStates} label={done ? "Green, merged" : fixing ? "Red, fixing" : phase === "running" ? "Running" : "The gate"} onZone={setZone} />
      </div>
      {/* the 13 audit chips and the /llms.txt + /api/bella.json
          machine-surface links are CUT (insider detail, no reader
          payoff, per the template-first audit). TODO(elleta):
          restore as ONE quiet footnote line only if a one-line
          "what this is" earns them. */}
    </div>
  );
}
