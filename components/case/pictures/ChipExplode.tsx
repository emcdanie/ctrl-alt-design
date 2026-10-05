"use client";

import type { CSSProperties } from "react";
import ScaledArt from "@/components/case/ScaledArt";
import { useFigurePlay } from "@/components/case/CaseFigure";
import caseStyles from "@/components/case/Case.module.css";
import { Key, PanelHead, Picture, Pin, PARTS, PartLabel } from "./Chip";
import s from "./Chip.module.css";

/* Figure 1 · Take it apart (Site v3, Figma Figure · Take it apart ·
   Button, in 407:8187). The Button specimen at rest, five numbered parts
   pinned to it, beside the same five layers exploded: tilted plates (the
   frame's matrix 0.94, -0.16, 0.34, 0.46) with soft shadows, 5 at the top
   to 1 at the bottom, a dot and one horizontal leader from each plate to
   its flat label, so nothing crosses. Motion: in view the stack explodes
   over 0.8s, ease-out (cubic-bezier(.22,1,.36,1)); Replay puts it back
   together and explodes it again; reduced motion shows the exploded
   frame (the CSS only animates under no-preference). */

/* the rest specimen's pins: [n, pin left, pin top] in its 480x260 drawing */
const REST_PINS: [number, number, number][] = [
  [1, 226, 198],
  [2, 12, 116],
  [3, 20.5, 42.5],
  [4, 226, 34],
  [5, 440, 96.8],
];

/* the 390 specimen (job 38): the real 44px key, drawn at its own size in
   a 280x160 stage instead of the 480 drawing scaled to 0.6, so the label
   and pins stay 14px. [n, pin left, pin top] and [left, top, w, h] */
const PHONE_PINS: [number, number, number][] = [
  [1, 126, 124],
  [2, 6, 66],
  [3, 70, 8],
  [4, 126, 8],
  [5, 246, 66],
];
const PHONE_LEADERS: [number, number, number, number][] = [
  [140, 102, 1, 22],
  [34, 80, 36, 1],
  [84, 36, 1, 22],
  [140, 36, 1, 36],
  [216, 80, 30, 1],
];

const k = (n: number) => ({ "--k": n }) as CSSProperties;

function Plate({ n }: { n: number }) {
  return (
    <span className={s.plate}>
      {n === 5 ? <span className={s.plateRing} /> : null}
      {n === 4 ? <span className={s.plateLabel}>Save changes</span> : null}
      {n === 3 ? (
        <span className={s.plateBox}>
          <span className={s.platePad} />
        </span>
      ) : null}
      {n === 2 ? <span className={s.plateFill} /> : null}
      {n === 1 ? <span className={s.plateShadow} /> : null}
    </span>
  );
}

export function ChipExplode({ label }: { label: string }) {
  const { playing, run } = useFigurePlay();
  const top = [...PARTS].reverse();
  return (
    <Picture label={label}>
      <div className={s.apart}>
        <div className={s.panel}>
          <PanelHead>Rest</PanelHead>
          <div className={s.restBody}>
            <div className={`${s.specimenBox} ${caseStyles.wideOnly}`}>
              <ScaledArt width={480}>
                <div className={s.specimen}>
                  <span className={s.specimenRing} />
                  <Key className={s.specimenKey} />
                  <span className={s.restLeader} data-n="1" />
                  <span className={s.restLeader} data-n="2" />
                  <span className={s.restLeader} data-n="3" />
                  <span className={s.restLeader} data-n="4" />
                  <span className={s.restLeader} data-n="5" />
                  {REST_PINS.map(([n, x, y]) => (
                    <span key={n} className={s.restPin} style={{ left: `calc(50% - 140px + ${x}px)`, top: y }}>
                      <Pin n={n} />
                    </span>
                  ))}
                </div>
              </ScaledArt>
            </div>
            <div className={caseStyles.phoneOnly}>
              <span className={s.phoneStage}>
                <span className={s.phoneRing} />
                <Key className={s.phoneKey} />
                {PHONE_LEADERS.map(([x, y, w, h]) => (
                  <span key={`${x}-${y}`} className={s.phoneLeader} style={{ left: `calc(50% - 140px + ${x}px)`, top: y, width: w, height: h }} />
                ))}
                {PHONE_PINS.map(([n, x, y]) => (
                  <span key={n} className={s.restPin} style={{ left: `calc(50% - 140px + ${x}px)`, top: y }}>
                    <Pin n={n} />
                  </span>
                ))}
              </span>
            </div>
            <div className={s.legend}>
              {PARTS.map((p) => (
                <PartLabel key={p.n} {...p} />
              ))}
            </div>
          </div>
        </div>
        <div className={s.panel}>
          <PanelHead>Exploded</PanelHead>
          <div className={s.stack} data-play={playing ? "on" : "off"} key={run}>
            {top.map((p, i) => (
              <div key={p.n} className={s.layer} style={k(i)}>
                <span className={s.plateWrap}>
                  <Plate n={p.n} />
                </span>
                <span className={s.callout}>
                  <span className={s.dot} />
                  <span className={s.leader} />
                  <PartLabel {...p} short />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Picture>
  );
}
