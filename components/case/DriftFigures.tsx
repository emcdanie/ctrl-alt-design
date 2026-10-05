"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useFigurePlay } from "./CaseFigure";
import { KitButton, KitInput, KitPanel, MarkupBadge } from "./kit/Kit";
import { TokenPin } from "./pictures/DriftPictures";
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

/* ── Figure 3 · Zoom levels (F4) ─────────────────────────────────── */
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

/* ── Figure 4 · Token cascade (F1) ──────────────────────────────── */
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
          <MarkupBadge kind="fail">Inconsistent</MarkupBadge>
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
            <MarkupBadge kind="pass">Consistent</MarkupBadge>
          </span>
        </div>
        <p className={s.changeNote}>Every vertical reads action.primary. Change it once, and all four follow, in design and in code.</p>
      </div>
    </div>
  );
}

/* ── Figure 6 · Rollout (F2) ───────────────────────────────────────── */
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
                  {st.shared ? (
                    <MarkupBadge kind="pass" className={s.sharedTag}>
                      On system
                    </MarkupBadge>
                  ) : null}
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

/* ── Figure 7 · Shipped staircase (F3) ───────────────────────────── */
/* The drawing's own units (942 wide, Figma 366:33642): the system node on
   the baseline, then six risers, each area's node on its tread with its
   chip centred above it, 8px clear. Two geometries (Elleta, 5 Oct): from
   640px the rise is 52 and the viewBox starts at the top chip, so the
   chart fills the card (about 25% shorter, no empty top-left); on a
   phone the rise stays 78, the room a 16px label needs above its tread. */
type Pt = [number, number];
const BASE = 578;
const SYS_X = 250.5;
const END_X = 942;
const RISER_X = [318, 421, 519, 614, 698, 815];
const AREAS: { label: string[]; x: number }[] = [
  { label: ["system", "in code"], x: 369.5 },
  { label: ["search"], x: 470 },
  { label: ["flights"], x: 566.5 },
  { label: ["cars"], x: 656 },
  { label: ["checkout"], x: 756.5 },
  { label: ["users &", "roles"], x: 866.5 },
];
/* timing (Elleta, 5 Oct; total about 2.6s): the flat line draws 0.5s, the
   system pops at 0.5s, the stair draws 1.6s ease-out; each area pops when
   the line reaches it, then "next" fades in last */
const FLAT_S = 0.5;
const STAIR_S = 1.6;

function stairGeometry(rise: number, top: number, bottom: number) {
  const pts: Pt[] = [[SYS_X, BASE]];
  let y = BASE;
  for (const x of RISER_X) {
    pts.push([x, y]);
    y -= rise;
    pts.push([x, y]);
  }
  pts.push([END_X, y]);
  const d = `M${SYS_X} ${BASE}` + pts.slice(1).map(([x, py], k) => (pts[k][1] === py ? `H${x}` : `V${py}`)).join("");
  /* the length along the path's segments to a point on it */
  const seg = pts.slice(1).map((p, k) => Math.abs(p[0] - pts[k][0]) + Math.abs(p[1] - pts[k][1]));
  const total = seg.reduce((t, l) => t + l, 0);
  const lengthTo = ([tx, ty]: Pt) => {
    let run = 0;
    for (let k = 0; k < seg.length; k++) {
      const [ax, ay] = pts[k];
      const [bx, by] = pts[k + 1];
      const on = ay === by ? ty === ay && tx >= Math.min(ax, bx) && tx <= Math.max(ax, bx) : tx === ax && ty >= Math.min(ay, by) && ty <= Math.max(ay, by);
      if (on) return run + Math.abs(tx - ax) + Math.abs(ty - ay);
      run += seg[k];
    }
    return total;
  };
  const areas = AREAS.map((a, k) => {
    const ay = BASE - (k + 1) * rise;
    return { ...a, y: ay, delay: FLAT_S + STAIR_S * (lengthTo([a.x, ay]) / total) };
  });
  return { d, fill: `${d}V${BASE}Z`, areas, top, h: bottom - top };
}

const WIDE = stairGeometry(52, 190, 626);
const PHONE = stairGeometry(78, 20, 648);
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const sec = (v: number) => `${Math.round(v * 1000)}ms`;

function StairDrawing({ g, className }: { g: ReturnType<typeof stairGeometry>; className: string }) {
  const grad = useId();
  const y = (v: number) => pct(v - g.top, g.h);
  return (
    <div className={`${s.drawing} ${className}`} style={{ aspectRatio: `${END_X} / ${g.h}`, "--base": y(BASE) } as CSSProperties}>
      <svg viewBox={`0 ${g.top} ${END_X} ${g.h}`} className={s.drawingSvg} aria-hidden="true">
        <defs>
          <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className={s.fillStopTop} />
            <stop offset="1" className={s.fillStopEnd} />
          </linearGradient>
        </defs>
        <path d={g.fill} className={s.areaFill} fill={`url(#${grad})`} />
        <path d={`M0 ${BASE}H${END_X}`} className={s.baseline} />
        <path d={`M0 ${BASE}H${SYS_X}`} className={s.flat} pathLength={1} />
        <path d={g.d} className={s.stair} pathLength={1} />
        <circle cx={SYS_X} cy={BASE} r={10} className={s.sysNode} />
        {g.areas.map((a) => (
          <circle key={a.label.join(" ")} cx={a.x} cy={a.y} r={7} className={s.areaNode} style={{ "--d": sec(a.delay) } as CSSProperties} />
        ))}
      </svg>
      <span className={s.sysChip} style={{ left: pct(SYS_X, END_X), top: y(529) }}>
        the system
      </span>
      <ol className={s.areaChips}>
        {g.areas.map((a) => (
          <li key={a.label.join(" ")} className={s.areaChip} style={{ "--d": sec(a.delay), left: pct(a.x, END_X), top: y(a.y - 15) } as CSSProperties}>
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
  );
}

export function Staircase() {
  const { playing, run } = useFigurePlay();
  /* "6 areas live" counts up with the chips; the count is decoration
     (aria-hidden, no live region), the final text stays for readers */
  const [live, setLive] = useState(AREAS.length);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLive(AREAS.length);
      return;
    }
    setLive(0);
    if (!playing) return;
    const g = window.matchMedia("(max-width: 639px)").matches ? PHONE : WIDE;
    const timers = g.areas.map((a, k) => setTimeout(() => setLive(k + 1), a.delay * 1000));
    return () => timers.forEach(clearTimeout);
  }, [playing, run]);
  return (
    <div className={`${s.stage}`} data-play={playing ? "on" : "off"} key={run}>
      {/* the real staircase at every width; at 390 its labels sit at 16px
         left of each node (Figma option B, build spec 4 Oct late) */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <p className={s.cardTitle}>Shipped on the system</p>
          <span className={s.status}>
            <span aria-hidden="true">{live} areas live</span>
            <span className="sr-only">{AREAS.length} areas live</span>
          </span>
        </div>
        <StairDrawing g={WIDE} className={s.drawingWide} />
        <StairDrawing g={PHONE} className={s.drawingPhone} />
      </div>
    </div>
  );
}

/* ── Showcase card 3 · one token, every screen (Elleta, 5 Oct) ───── */
/* action.primary cycles indigo → teal → ochre every 2.4s, only while the
   card is in view. One attribute on the card (data-swatch) sets the
   product action colour; the pill, the mini Harbour loft card, the search
   bar and the booking bar all read it, so they recolour together (300ms
   ease-out) and the pill pulses once per change. Reduced motion: no loop,
   the first state, and a tap on the pill steps the colour. */
const SWATCHES = ["indigo", "teal", "ochre"] as const;
const CYCLE_MS = 2400;

export function TokenEverywhere() {
  const root = useRef<HTMLSpanElement>(null);
  /* steps taken: the colour is steps mod 3; the pulse alternates two
     identical animations by parity so each change replays it */
  const [steps, setSteps] = useState(0);
  const step = () => setSteps((n) => n + 1);
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          timer = setInterval(() => setSteps((n) => n + 1), CYCLE_MS);
        } else if (!e.isIntersecting && timer) {
          clearInterval(timer);
          timer = undefined;
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);
  return (
    <span className={s.everywhere} ref={root} data-swatch={SWATCHES[steps % SWATCHES.length]}>
      {/* pointer only: the card is a picture (aria-hidden), so the tap is a
         convenience for reduced motion, not a control */}
      <span className={s.everyPill} data-pulse={steps === 0 ? undefined : steps % 2 ? "a" : "b"} onClick={step}>
        <TokenPin token="action.primary" swatch="var(--kit-action)" />
      </span>
      <KitPanel className={s.everyStay}>
        <span className={s.everyStayText}>
          <span className={s.everyTitle}>Harbour loft</span>
          <span className={s.everyPrice}>
            €142 <span className={s.everyPer}>/ night</span>
          </span>
        </span>
        <KitButton size="sm" className={s.everyFill}>
          Book now
        </KitButton>
      </KitPanel>
      <span className={s.everySearch}>
        <KitInput search className={s.everyInput}>
          Where to?
        </KitInput>
        <KitButton size="sm" className={`${s.everyFill} ${s.everyIcon}`}>
          <Icon name="ArrowRight" size="sm" />
        </KitButton>
      </span>
      <KitPanel className={s.everyBar}>
        <span className={s.everyTotal}>
          <span className={s.everyPer}>Total</span>
          <span className={s.everyTitle}>€438</span>
        </span>
        <KitButton size="sm" className={s.everyFill}>
          Pay €438
        </KitButton>
      </KitPanel>
    </span>
  );
}
