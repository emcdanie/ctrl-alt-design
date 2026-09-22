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

/* one gate row: the bar grows, the ratio counts up, the grade pops.
 * Remounted per theme change (key), so every theme replays it. */
function GateRow({ row, index, still }: { row: ReturnType<typeof gateRows>[number]; index: number; still: boolean }) {
  const [grown, setGrown] = useState(still);
  const [shown, setShown] = useState(still ? row.ratio : 0);
  const [badge, setBadge] = useState(still);
  useEffect(() => {
    if (still) return;
    let raf = 0;
    const delay = 60 + index * 70;
    const t1 = window.setTimeout(() => {
      setGrown(true);
      const t0 = performance.now();
      const tick = () => {
        const x = Math.max(0, Math.min(1, (performance.now() - t0) / 550));
        setShown(row.ratio * x);
        if (x < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    const t2 = window.setTimeout(() => setBadge(true), delay + 450);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      cancelAnimationFrame(raf);
    };
  }, [still, index, row.ratio]);
  const tone = row.grade.tone === "aaa" ? "" : row.grade.tone === "aa" ? s.aa : s.no;
  return (
    <div className={s.grow}>
      <span className={s.growLabel}>{row.label}</span>
      <span className={s.track} aria-hidden="true">
        <i style={{ left: `${gatePct(3)}%` }} />
        <i style={{ left: `${gatePct(4.5)}%` }} />
        <i style={{ left: `${gatePct(7)}%` }} />
        <span className={`${s.bar} ${tone}`} style={{ width: grown ? `${Math.min(100, gatePct(row.ratio))}%` : 0 }} />
      </span>
      <span className={s.growValue}>{(still ? row.ratio : shown).toFixed(2)}</span>
      <span className={`${s.badge} ${tone} ${badge ? s.badgeOn : ""}`}>{row.grade.label}</span>
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
  const tint = { "--tint-l": t.tint[0], "--tint-d": t.tint[1] } as CSSProperties;

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
    <>
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

      <figure
        ref={figRef}
        className={s.ex}
        style={tint}
        aria-label={`The ${key} theme: tier 1 primitives, the tier 2 roles that point into them, the tier 3 component slots that read those roles, the contrast gate, and the listing card they dress. Every theme passes the gate.`}
      >
        <div className={s.sheets}>
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
              <div className={s.gscale} aria-hidden="true">
                <span />
                <div>
                  <span style={{ left: `${gatePct(3)}%` }}>3</span>
                  <span style={{ left: `${gatePct(4.5)}%` }}>4.5</span>
                  <span style={{ left: `${gatePct(7)}%` }}>7</span>
                  <span style={{ left: "100%" }}>21</span>
                </div>
                <span />
                <span />
              </div>
              {rows.map((row, i) => (
                <GateRow key={`${key}-${gen}-${i}`} row={row} index={i} still={reduce} />
              ))}
            </div>
          </div>
        </div>
        <Preview theme={t} hot={hot} />
        <figcaption className={s.cap}>
          <span>theme</span>
          <b>{key}</b>
          <span>{t.note}</span>
        </figcaption>
      </figure>
    </>
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
  return (
    <pre className={s.json} tabIndex={0} aria-label="Tier 2 mapping for the current theme">
      {`// tier 2 · ${key}.tokens.json · the same names in every theme\n${body}`}
    </pre>
  );
}
