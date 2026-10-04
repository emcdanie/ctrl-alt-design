"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useFigurePlay } from "./CaseFigure";
import s from "./DriftFigures.module.css";

/* The four Drift figures with motion (Site v3; masters on 🧪 Drift motion
   333:60). Each plays once when half of it is in view, restarts on
   Replay, and shows its finished frame under reduced motion (the CSS
   only animates inside prefers-reduced-motion: no-preference). The Case
   UI kit and markup colours are picture-only tokens (--kit-*,
   --markup-*); everything around them reads the semantic tokens, so the
   cards follow the theme. */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Step({ n }: { n: number | string }) {
  return <span className={s.step}>{n}</span>;
}

/* ── Figure 4 · Zoom levels (F4) ─────────────────────────────────── */
const LEVELS = [
  { title: "The file", meta: "40 pages that nobody owned.", short: "the file" },
  { title: "One page", meta: "120 frames, three called “final”.", short: "one page" },
  { title: "One frame", meta: "Five inputs, built five ways.", short: "one frame" },
  { title: "One field", meta: "Same input: 34px vs 40px, radius 4 vs 10.", short: "one field" },
];

function FileArt() {
  return (
    <svg viewBox="0 0 203 190" className={s.levelArt} aria-hidden="true">
      {Array.from({ length: 30 }, (_, k) => {
        const c = k % 5;
        const r = Math.floor(k / 5);
        const hot = c === 3 && r === 2;
        return (
          <rect
            key={k}
            x={12 + c * 36}
            y={14 + r * 28}
            width={30}
            height={20}
            rx={3}
            className={hot ? s.hotRect : s.fileRect}
          />
        );
      })}
    </svg>
  );
}

function PageArt() {
  const rows = ["Search · v4", "Search · v4 final", "Search · v4 FINAL 2", "Checkout · old", "Stays · card", "Flights · card"];
  return (
    <svg viewBox="0 0 203 190" className={s.levelArt} aria-hidden="true">
      <rect x={8} y={68} width={177} height={24} rx={4} className={s.hotOutline} />
      {rows.map((t, k) => (
        <g key={t}>
          <rect x={16} y={20 + k * 28} width={10} height={8} rx={2} className={k === 2 ? s.hotFill : s.fileRect} />
          <text x={32} y={28 + k * 28} className={k === 2 ? s.kitTextHot : s.kitText}>
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}

function FrameArt() {
  const inputs: [string, number, number, number][] = [
    ["Where to?", 14, 26, 4],
    ["Check in", 48, 24, 2],
    ["Guests", 82, 28, 10],
    ["Promo code", 116, 22, 3],
    ["Email", 150, 26, 6],
  ];
  return (
    <svg viewBox="0 0 203 190" className={s.levelArt} aria-hidden="true">
      {inputs.map(([t, y, h, r], k) => (
        <g key={t}>
          <rect x={14} y={y} width={171} height={h} rx={r} className={k === 0 ? s.hotOutline : s.inputBox} />
          <text x={24} y={y + h / 2 + 4} className={s.kitText}>
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}

function FieldArt() {
  return (
    <svg viewBox="0 0 203 190" className={s.levelArt} aria-hidden="true">
      <rect x={40} y={28} width={145} height={34} rx={4} className={s.inputBox} />
      <text x={52} y={50} className={s.kitText}>
        Where to?
      </text>
      <rect x={40} y={104} width={145} height={40} rx={10} className={s.hotOutline} />
      <text x={54} y={129} className={s.kitTextInk}>
        Where to?
      </text>
      <path d="M27 28v34M22 28h10M22 62h10" className={s.markRed} />
      <text x={36} y={79} className={s.kitTextRed}>
        34px
      </text>
      <path d="M27 104v40M22 104h10M22 144h10" className={s.markRed} />
      <text x={36} y={161} className={s.kitTextRed}>
        40px
      </text>
    </svg>
  );
}

const LEVEL_ART = [FileArt, PageArt, FrameArt, FieldArt];

export function ZoomLevels() {
  const { playing, run } = useFigurePlay();
  const track = useRef<HTMLOListElement>(null);
  const [at, setAt] = useState(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.firstElementChild instanceof HTMLElement ? el.firstElementChild.offsetWidth : el.clientWidth;
      setAt(Math.max(0, Math.min(LEVELS.length - 1, Math.round(el.scrollLeft / Math.max(1, w)))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className={`${s.stage}`} data-play={playing ? "on" : "off"} key={run}>
      <ol className={s.levels} ref={track} aria-label="Four zoom levels">
        {LEVELS.map((l, k) => {
          const Art = LEVEL_ART[k];
          return (
            <li key={l.title} className={s.level} style={i(k)}>
              <div className={s.levelStage}>
                <Art />
              </div>
              <p className={s.levelHead}>
                <Step n={k + 1} />
                {l.title}
              </p>
              <p className={s.levelMeta}>{l.meta}</p>
              {k < LEVELS.length - 1 ? (
                <svg className={s.levelArrow} viewBox="0 0 28 12" aria-hidden="true">
                  <path d="M0 6h26M21 1l5 5-5 5" />
                </svg>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className={s.swipeMeta} aria-live="polite">
        <span className={s.dots} aria-hidden="true">
          {LEVELS.map((l, k) => (
            <span key={l.title} className={k === at ? s.dotOn : s.dot} />
          ))}
        </span>
        {at + 1} of 4 · {LEVELS[at].short} · swipe
      </p>
    </div>
  );
}

/* ── Figure 5 · Token cascade (F1) ──────────────────────────────── */
/* the ramp, each step its own token (written out so audit:debt can see
   every var() read) */
const RAMP: [number, string][] = [
  [100, "var(--kit-ramp-100)"],
  [200, "var(--kit-ramp-200)"],
  [300, "var(--kit-ramp-300)"],
  [400, "var(--kit-ramp-400)"],
  [500, "var(--kit-ramp-500)"],
  [600, "var(--kit-ramp-600)"],
  [700, "var(--kit-ramp-700)"],
  [800, "var(--kit-ramp-800)"],
  [900, "var(--kit-ramp-900)"],
];
const RAMP_HEX = "#4A5BD4"; // token-waiver: the hex shown as text in the picture, not a colour
const TOKENS: [string, string, string][] = [
  ["action.primary", "indigo.600", "action"],
  ["text.primary", "ink.900", "ink"],
  ["border.subtle", "grey.200", "line"],
  ["surface.card", "white", "card"],
];
/* the Before buttons are the drift itself (off-brand fills that miss AA),
   so they ship as pictures, never live DOM (CLAUDE.md section 9): crops of
   the frame at 2x, [width, height] at 1x */
const VERTICALS: [string, string, string, string, [number, number]][] = [
  ["Stays", "Book", "Book stays", "stays", [64, 33]],
  ["Flights", "BOOK NOW", "Book flights", "flights", [103, 34]],
  ["Trains", "Reserve", "Book trains", "trains", [79, 35]],
  ["Cars", "BOOK", "Book cars", "cars", [73, 32]],
];

function Badge({ kind, label }: { kind: "pass" | "fail"; label: string }) {
  return (
    <span className={kind === "pass" ? s.badgePass : s.badgeFail} role="img" aria-label={label}>
      <Icon name={kind === "pass" ? "Check" : "Xmark"} size="sm" />
    </span>
  );
}

export function TokenCascade() {
  const { playing, run } = useFigurePlay();
  return (
    <div className={`${s.stage} ${s.cascade}`} data-play={playing ? "on" : "off"} key={run}>
      <ol className={s.tiers}>
        <li className={s.tier}>
          <p className={s.tierHead}>
            <Step n={1} />
            Foundation
          </p>
          <p className={s.tierLead}>The raw colour, set once.</p>
          <span className={s.ramp} aria-hidden="true">
            {RAMP.map(([r, fill]) => (
              <span key={r} className={r === 600 ? s.swatchOn : s.swatch} style={{ background: fill }} />
            ))}
          </span>
          <code className={s.token}>indigo.600</code>
          <code className={s.tokenQuiet}>{RAMP_HEX}</code>
        </li>
        <li className={s.tier}>
          <p className={s.tierHead}>
            <Step n={2} />
            Semantic
          </p>
          <p className={s.tierLead}>A name for what it means.</p>
          <ul className={s.tokenList}>
            {TOKENS.map(([name, value, dot]) => (
              <li key={name} className={dot === "action" ? s.tokenRowOn : s.tokenRow}>
                <span className={s.tokenDot} data-dot={dot} aria-hidden="true" />
                <code className={s.token}>{name}</code>
                <span className={s.tokenValue}>{value}</span>
              </li>
            ))}
          </ul>
        </li>
        <li className={s.tier}>
          <p className={s.tierHead}>
            <Step n={3} />
            Component
          </p>
          <p className={s.tierLead}>Reads the name, never the hex.</p>
          <span className={s.priceRow}>
            <span className={s.kitButton} data-fill>
              Book now
            </span>
            <span className={s.price}>
              €142 <span className={s.per}>/ night</span>
            </span>
          </span>
        </li>
        <li className={s.tierArrows} aria-hidden="true">
          <svg viewBox="0 0 36 12" className={s.tierArrow} style={i(0)}>
            <path d="M0 6h34M29 1l5 5-5 5" />
          </svg>
          <svg viewBox="0 0 36 12" className={s.tierArrow} style={i(1)}>
            <path d="M0 6h34M29 1l5 5-5 5" />
          </svg>
        </li>
      </ol>
      <div className={s.change}>
        <div className={s.changeRow}>
          <p className={s.changeLabel}>Before: each team picked</p>
          <ul className={s.verticals}>
            {VERTICALS.map(([v, before, , key, [w, h]]) => (
              <li key={v} className={s.vertical}>
                <span className={s.verticalName}>{v}</span>
                <img className={s.beforeButton} src={`/images/case/drift/before-${key}.png`} width={w} height={h} alt={`${v}: a ${before} button in its own style`} />
              </li>
            ))}
          </ul>
          <Badge kind="fail" label="Inconsistent" />
        </div>
        <div className={s.changeRow}>
          <p className={s.changeLabel}>After: one decision</p>
          <ul className={s.verticals}>
            {VERTICALS.map(([v, , after], k) => (
              <li key={v} className={s.vertical}>
                <span className={s.verticalName}>{v}</span>
                <span className={s.kitButton} data-after style={i(k)}>
                  {after}
                </span>
              </li>
            ))}
          </ul>
          <span className={s.passPop}>
            <Badge kind="pass" label="Consistent" />
          </span>
        </div>
        <p className={s.changeNote}>Every vertical reads action.primary. Change it once, and all four follow, in design and in code.</p>
      </div>
    </div>
  );
}

/* ── Figure 7 · Rollout (F2) ───────────────────────────────────────── */
const STEPS: { title: string; meta: string; icon: IconName; no?: boolean; shared?: boolean; cto?: boolean }[] = [
  { title: "Proposed", meta: "Told it wasn’t necessary", icon: "ChatBubbleXmark", no: true },
  { title: "Built it for myself", meta: "Nights and side time", icon: "Cube" },
  { title: "Paired", meta: "One designer, one developer", icon: "Group" },
  { title: "Showed the CTO", meta: "Funding for a team", icon: "Presentation", cto: true },
  { title: "Shared", meta: "Every product team", icon: "DotsGrid3x3", shared: true },
];

export function Rollout() {
  const { playing, run } = useFigurePlay();
  return (
    <div className={`${s.stage}`} data-play={playing ? "on" : "off"} key={run}>
      <div className={s.card}>
        <div className={s.cardHead}>
          <p className={s.cardTitle}>Rollout</p>
          <span className={s.status}>Every product team</span>
        </div>
        <ol className={s.rollout}>
          <li className={s.track} aria-hidden="true">
            <span className={s.trackLine} />
            <span className={s.trackShared} />
          </li>
          {STEPS.map((st, k) => (
            <li key={st.title} className={s.rStep} style={i(k)} data-cto={st.cto || undefined}>
              <span className={s.disc} data-shared={st.shared || undefined} aria-hidden="true">
                <Icon name={st.icon} size="md" />
              </span>
              <span className={s.rCard}>
                <span className={s.rTop}>
                  <Step n={k + 1} />
                  {st.no ? <span className={s.no}>No</span> : null}
                  {st.shared ? <Badge kind="pass" label="Shared" /> : null}
                </span>
                <span className={s.rTitle}>{st.title}</span>
                <span className={s.rMeta}>{st.meta}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className={s.panels}>
          <div className={s.broke}>
            <p className={s.panelTitle}>Where it broke</p>
            <ul className={s.panelList}>
              <li>Developers felt I was changing their workflow.</li>
              <li>They said the components were too complex and unnecessary.</li>
              <li>We argued a lot about naming. Even an accordion was hard to get built.</li>
            </ul>
          </div>
          <div className={s.changed}>
            <p className={s.panelTitle}>What changed it</p>
            <ul className={s.panelList}>
              <li>A new team of senior developers who built it with me.</li>
              <li>Later, the system moved to every product team, and only approved changes reached code.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Figure 8 · Shipped staircase (F3) ───────────────────────────── */
/* the drawing's own coordinates (942 × 648, Figma 366:33642): each area's
   node, and its chip centred above it with an 8px gap */
const AREAS: { label: string[]; x: number; y: number }[] = [
  { label: ["system", "in code"], x: 369.5, y: 500 },
  { label: ["search"], x: 470, y: 422 },
  { label: ["flights"], x: 566.5, y: 344 },
  { label: ["cars"], x: 656, y: 266 },
  { label: ["checkout"], x: 756.5, y: 188 },
  { label: ["users &", "roles"], x: 866.5, y: 110 },
];
const STAIR = "M250.5 578H318V500H421V422H519V344H614V266H698V188H815V110H942";
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

export function Staircase() {
  const { playing, run } = useFigurePlay();
  return (
    <div className={`${s.stage}`} data-play={playing ? "on" : "off"} key={run}>
      {/* the real staircase at every width; at 390 its labels sit at 16px
         left of each node (Figma option B, build spec 4 Oct late) */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <p className={s.cardTitle}>Shipped on the system</p>
          <span className={s.status}>6 areas live</span>
        </div>
        <div className={s.drawing}>
          <svg viewBox="0 0 942 648" className={s.drawingSvg} aria-hidden="true">
            <path d="M0 578H942" className={s.baseline} />
            <path d="M0 578H250.5" className={s.flat} pathLength={1} />
            <path d={STAIR} className={s.stair} pathLength={1} />
            <circle cx={250.5} cy={578} r={10} className={s.sysNode} />
            {AREAS.map((a, k) => (
              <circle key={a.label.join(" ")} cx={a.x} cy={a.y} r={7} className={s.areaNode} style={i(k)} />
            ))}
          </svg>
          <span className={s.sysChip} style={{ left: pct(250.5, 942), top: pct(529, 648) }}>
            the system
          </span>
          <ol className={s.areaChips}>
            {AREAS.map((a, k) => (
              <li key={a.label.join(" ")} className={s.areaChip} style={{ ...i(k), left: pct(a.x, 942), top: pct(a.y - 15, 648) }}>
                {a.label.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </li>
            ))}
          </ol>
          <span className={s.flatLabel}>2 years of redesign · nothing live</span>
          <span className={s.nextChip}>
            next: flight extras<span className={s.nextMore}>, nearly done</span>
          </span>
        </div>
      </div>
    </div>
  );
}
