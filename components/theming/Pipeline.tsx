"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Exhibit from "@/components/diagrams/Exhibit";
import s from "@/components/ThemingCase.module.css";

const STEPS: [string, string][] = [
  ["write", "tokens/*.json"],
  ["build", "build.py"],
  ["generate", "css · json · theme"],
  ["check", "the gate"],
  ["ship", "storybook + site"],
];
const GATE = 3;
const HOP = 700; /* ms between steps */
const LIGHT = 450; /* ms after the hop that the step lights */

const LABEL =
  "A token travels through five steps: write the tokens, build them, generate the CSS, check them at the gate, and ship to Storybook and the site. The gate lights up with a tick when it passes.";

/* wide: five boxes in a row (880 user units, drawn from 1024px up) */
const W = 150;
const GAP = (880 - 40 - 5 * W) / 4;
const XS = STEPS.map((_, i) => 20 + i * (W + GAP));
/* narrow: five boxes stacked (300 user units, phones and tablets) */
const VW = 232;
const VH = 56;
const VX = 52;
const VY = STEPS.map((_, i) => 12 + i * 80);

/* BELLA's pipeline: a token (the chip marked "action") hops from step
 * to step; each step lights as it arrives, the gate turns mint with a
 * tick, and the drawing holds on ship. Plays once in view (Exhibit),
 * replay restarts it; reduced motion shows that finished frame. */
export default function Pipeline() {
  const [pos, setPos] = useState(0);
  const [lit, setLit] = useState(-1);
  const [passed, setPassed] = useState(false);
  const [moving, setMoving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos(STEPS.length - 1);
      setLit(STEPS.length - 1);
      setPassed(true);
    }
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const play = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMoving(false);
    setPos(0);
    setLit(-1);
    setPassed(false);
    STEPS.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setMoving(true);
          setPos(i);
          timers.current.push(
            window.setTimeout(() => {
              setLit(i);
              if (i === GATE) setPassed(true);
            }, LIGHT),
          );
        }, i * HOP),
      );
    });
  }, []);

  const cls = (i: number) =>
    [s.nd, lit === i ? s.lit : "", passed && i === GATE ? s.pass : ""].filter(Boolean).join(" ");

  return (
    <Exhibit className={s.pipe} replayLabel="Replay the pipeline animation" onPlay={play}>
      <svg className={s.pipeWide} viewBox="0 0 880 150" data-bella-diagram role="img" aria-label={LABEL}>
        <path className={s.ln} d={`M${XS[0] + W / 2} 62 H${XS[4] + W / 2}`} />
        {STEPS.map(([a, b], i) => (
          <g key={a} className={cls(i)}>
            <rect className={s.bx} x={XS[i]} y="30" width={W} height="64" rx="12" />
            <text className={s.t1} x={XS[i] + W / 2} y="58" textAnchor="middle">
              {a}
            </text>
            <text className={`t ${s.t2}`} x={XS[i] + W / 2} y="79" textAnchor="middle">
              {b}
            </text>
            {i === GATE ? (
              <g className={s.tick}>
                <circle className={s.tickDot} cx={XS[i] + W - 8} cy="30" r="11" />
                <path className={s.tickMark} d={`M${XS[i] + W - 13} 30 l4 4 l7 -8`} />
              </g>
            ) : null}
          </g>
        ))}
        <g className={`${s.tok} ${moving ? s.tokMove : ""}`} style={{ transform: `translateX(${XS[pos] - XS[0]}px)` }}>
          <circle className={s.tokc} cx={XS[0] + W / 2} cy="118" r="7" />
          <text className="t" x={XS[0] + W / 2 + 13} y="122">
            action
          </text>
        </g>
      </svg>

      <svg className={s.pipeNarrow} viewBox="0 0 300 404" data-bella-diagram role="img" aria-label={LABEL}>
        <path className={s.ln} d={`M${VX + VW / 2} ${VY[0] + VH / 2} V${VY[4] + VH / 2}`} />
        {STEPS.map(([a, b], i) => (
          <g key={a} className={cls(i)}>
            <rect className={s.bx} x={VX} y={VY[i]} width={VW} height={VH} rx="12" />
            <text className={s.t1} x={VX + VW / 2} y={VY[i] + 25} textAnchor="middle">
              {a}
            </text>
            <text className={`t ${s.t2}`} x={VX + VW / 2} y={VY[i] + 44} textAnchor="middle">
              {b}
            </text>
            {i === GATE ? (
              <g className={s.tick}>
                <circle className={s.tickDot} cx={VX + VW - 8} cy={VY[i]} r="11" />
                <path className={s.tickMark} d={`M${VX + VW - 13} ${VY[i]} l4 4 l7 -8`} />
              </g>
            ) : null}
          </g>
        ))}
        <g className={`${s.tok} ${moving ? s.tokMove : ""}`} style={{ transform: `translateY(${VY[pos] - VY[0]}px)` }}>
          <circle className={s.tokc} cx="24" cy={VY[0] + VH / 2} r="7" />
        </g>
      </svg>
    </Exhibit>
  );
}
