"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type Dispatch, type ReactNode, type SetStateAction } from "react";
import Preview from "@/components/theming/Preview";
import {
  COMPONENT_SLOTS,
  JSON_ROLES,
  ORDER,
  SEMANTIC_ROWS,
  THEMES,
  gatePct,
  gateRows,
  val,
  type Role,
  type ThemeKey,
} from "@/components/theming/themes";
import s from "@/components/ThemingCase.module.css";

/* The theme the exhibit is showing, shared with the tier 2 JSON in
 * section 02 so both always name the same theme. */
const Ctx = createContext<{ theme: ThemeKey; setTheme: Dispatch<SetStateAction<ThemeKey>> }>({ theme: "ground", setTheme: () => {} });

export function ThemeStage({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeKey>("ground");
  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

const STEP = 1700; /* ms per theme, the mock's DUR */

const useReducedMotion = () => {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
};

/* one gate row: the bar grows and the grade pops; the ratio is always
 * the real one (job 32: a count-up from 0 meant stills caught "0.00").
 * Remounted per theme change (key), so every theme replays it. */
function GateRow({ row, index, still }: { row: ReturnType<typeof gateRows>[number]; index: number; still: boolean }) {
  const [grown, setGrown] = useState(still);
  const [badge, setBadge] = useState(still);
  useEffect(() => {
    if (still) return;
    const delay = 60 + index * 70;
    const t1 = window.setTimeout(() => setGrown(true), delay);
    const t2 = window.setTimeout(() => setBadge(true), delay + 450);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [still, index]);
  /* reduced motion is known only after mount, so `still` overrides the
     animated state rather than seeding it: the final frame, always */
  const full = still || grown;
  const popped = still || badge;
  const tone = row.grade.tone === "aaa" ? "" : row.grade.tone === "aa" ? s.aa : s.no;
  return (
    <div className={s.grow}>
      <span className={s.growLabel}>{row.label}</span>
      <span className={s.track} aria-hidden="true">
        <i style={{ left: `${gatePct(3)}%` }} />
        <i style={{ left: `${gatePct(4.5)}%` }} />
        <i style={{ left: `${gatePct(7)}%` }} />
        <span className={`${s.bar} ${tone}`} style={{ width: full ? `${Math.min(100, gatePct(row.ratio))}%` : 0 }} />
      </span>
      <span className={s.growValue}>{row.ratio.toFixed(2)}</span>
      <span className={`${s.badge} ${tone} ${popped ? s.badgeOn : ""}`}>{row.grade.label}</span>
    </div>
  );
}

export function ThemeExhibit() {
  const { theme: key, setTheme } = useContext(Ctx);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [gen, setGen] = useState(0);
  const [hot, setHot] = useState<Role | null>(null);
  const [pinned, setPinned] = useState<Role | null>(null);
  const [tokensOpen, setTokensOpen] = useState(false);
  const figRef = useRef<HTMLElement>(null);
  const running = !paused && !reduce && inView;

  const show = useCallback(
    (k: ThemeKey) => {
      setTheme(k);
      setGen((g) => g + 1);
    },
    [setTheme],
  );

  useEffect(() => {
    const el = figRef.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => setInView(es.some((e) => e.isIntersecting)), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTheme((k) => ORDER[(ORDER.indexOf(k) + 1) % ORDER.length]);
      setGen((g) => g + 1);
    }, STEP);
    return () => window.clearInterval(id);
  }, [running, setTheme]);

  const t = THEMES[key];
  const rows = gateRows(t);
  const tint = { "--tint": t.tint[t.mode === "dark" ? 1 : 0] } as CSSProperties;

  const rowProps = (role: Role) => ({
    type: "button" as const,
    className: `${s.mapRow} ${hot === role ? s.hot : ""}`,
    "aria-pressed": pinned === role,
    onMouseEnter: () => setHot(role),
    onMouseLeave: () => setHot(pinned),
    onFocus: () => setHot(role),
    onBlur: () => setHot(pinned),
    onClick: () => {
      const next = pinned === role ? null : role;
      setPinned(next);
      setHot(next);
    },
  });

  return (
    <div className={s.exCol}>
      <div className={s.picker} role="group" aria-label="Theme">
        {ORDER.map((k) => (
          <button
            key={k}
            type="button"
            className={s.th}
            aria-pressed={k === key}
            onClick={() => {
              setPaused(true);
              show(k);
            }}
          >
            <span className={s.sw} style={{ "--a": THEMES[k].swatch[0], "--b": THEMES[k].swatch[1] } as CSSProperties} aria-hidden="true" />
            {k}
            {k === key && running ? <span key={gen} className={`${s.pr} ${s.run}`} aria-hidden="true" /> : null}
          </button>
        ))}
        {reduce ? null : (
          <button type="button" className={s.play} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
            pause
          </button>
        )}
      </div>

      {/* pinned to the theme it shows (job 38): ground, coast and market
          are light themes, night is dark, whatever the page's own mode */}
      <figure
        ref={figRef}
        className={`${s.ex} ${t.mode === "dark" ? s.pinDark : s.pinLight}`}
        data-theme={t.mode}
        style={tint}
        aria-label={`The ${key} theme: tier 1 primitives, the tier 2 roles that point into them, the tier 3 component slots that read those roles, the contrast gate, and the listing card they dress. Every theme passes the gate.`}
      >
        {/* phones (job O15): the card first, the tier lists behind "Show the tokens" */}
        <button type="button" className={`${s.play} ${s.tokBtn}`} aria-expanded={tokensOpen} aria-controls="theme-sheets" onClick={() => setTokensOpen((o) => !o)}>
          {tokensOpen ? "Hide the tokens" : "Show the tokens"}
        </button>
        <div id="theme-sheets" className={s.sheets} data-open={tokensOpen}>
          <div className={s.sheet}>
            <b className={s.sheetLabel}>tier 1 · primitives</b>
            <div className={s.ramp} aria-hidden="true">
              {t.neutral.map((c, i) => (
                <i key={i} style={{ background: c }} />
              ))}
            </div>
            <div className={s.ramp} aria-hidden="true">
              {t.brand.map((c, i) => (
                <i key={i} style={{ background: c }} />
              ))}
            </div>
          </div>
          <div className={s.sheet}>
            <b className={s.sheetLabel}>tier 2 · semantic</b>
            <div className={s.map}>
              {SEMANTIC_ROWS.map((r) => (
                <button key={r} {...rowProps(r)}>
                  <i style={{ background: val(t, r) }} />
                  <span>{r}</span>
                  <em>
                    {t.sem[r][0]}-{t.sem[r][1]}
                  </em>
                  <span className="sr-only">, show where the card reads it</span>
                </button>
              ))}
            </div>
          </div>
          <div className={s.sheet}>
            <b className={s.sheetLabel}>tier 3 · component</b>
            <div className={s.map}>
              {COMPONENT_SLOTS.map(([c, r]) => (
                <button key={c} {...rowProps(r)}>
                  <i style={{ background: val(t, r) }} />
                  <span>{c}</span>
                  <em>{r}</em>
                  <span className="sr-only">, show where the card reads it</span>
                </button>
              ))}
            </div>
          </div>
          <div className={`${s.sheet} ${s.gsheet}`}>
            <b className={s.sheetLabel}>the gate · every theme must pass before it ships</b>
            <div className={s.gate}>
              {rows.map((row, i) => (
                <GateRow key={`${key}-${gen}-${i}`} row={row} index={i} still={reduce} />
              ))}
              {/* a legend, not numbers over the ticks: on a log scale 4.5
                  and 7 sit too close to label (job 38) */}
              <p className={s.glegend}>ticks at 3, 4.5 and 7 to 1 · the bar runs 1 to 21</p>
            </div>
          </div>
        </div>
        {/* from 1024 the face takes the sheets' height and crops below
            (I3, 6 Oct 2026: the exhibit fits one screen) */}
        <div className={s.exFace}>
          <Preview theme={t} hot={hot} live />
        </div>
        <figcaption className={s.cap}>
          <span>theme</span>
          <b>{key}</b>
          <span>{t.note}</span>
        </figcaption>
      </figure>
    </div>
  );
}

/* section 02: the tier 2 file for whichever theme the exhibit shows */
export function ThemeJson() {
  const { theme: key } = useContext(Ctx);
  const t = THEMES[key];
  const body = JSON.stringify(
    { theme: key, semantic: Object.fromEntries(JSON_ROLES.map((r) => [r, `{${t.sem[r][0]}.${t.sem[r][1]}}`])) },
    null,
    2,
  );
  /* the line the beat is about (a button reads action) wears the ochre
     highlight; nothing else is dimmed (K3, Elleta, 6 Oct 2026) */
  const lines = `// tier 2 · ${key}.tokens.json · the same names in every theme\n${body}`.split("\n");
  return (
    <pre className={s.json} tabIndex={0} aria-label="Tier 2 mapping for the current theme">
      {lines.map((l, i) =>
        l.trimStart().startsWith('"action"') ? (
          <mark key={i} className={s.jsonHot} data-t="action">
            {l}
            {"\n"}
          </mark>
        ) : (
          `${l}\n`
        ),
      )}
    </pre>
  );
}
