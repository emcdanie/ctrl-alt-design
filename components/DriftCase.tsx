"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Section from "@/components/layout/Section";
import Exhibit from "@/components/diagrams/Exhibit";
import { Words } from "@/components/diagrams/Decisions";
import { buttonGrave, SCENES, DECISIONS } from "@/components/diagrams/driftScenes";
import type { CaseStudy } from "@/lib/content";

/**
 * From Drift to Foundation (Geist refresh, Elleta 22 Sep 2026): Part B
 * of bella/docs/reference/case-study-mock.html, built on the site's
 * Section, Exhibit and tokens. Six sections, each claim, evidence, so
 * what; every picture is a recreated inline-SVG exhibit that draws once
 * in view, holds still, and replays on request. Reduced motion shows the
 * finished frame. The mock's reviewer notes stay out; two of its "your
 * words" boxes carry Elleta's copy (24 Sep audit, B5; the trade-off moved
 * to the booking page, F1).
 */

/* a media query as external state: false on the server, live after */
function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
const useNarrow = () => useMedia("(max-width: 640px)");
const useReduce = () => useMedia("(prefers-reduced-motion: reduce)");

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow dfc-eyebrow">{children}</p>;
}

function Cee({ items }: { items: [string, string][] }) {
  const fills = ["var(--color-chip-c1)", "var(--color-chip-c2)", "var(--color-chip-c3)"];
  return (
    <div className="dfc-cee">
      {items.map(([k, v], i) => (
        <div key={k}>
          <p className="dfc-cee__k">
            <i aria-hidden="true" style={{ background: fills[i] }} />
            {k}
          </p>
          <p className="dfc-cee__v">{v}</p>
        </div>
      ))}
    </div>
  );
}

/* ── 01 what the research said, in words (24 Sep audit, B3): no
   percentages and no people rows, which read as exact counts ── */
const FINDINGS = [
  "Most people said booking was overly complex.",
  "More than half said changing a booking was hard.",
  "A third of support had lost a booking to complexity.",
  "Nearly half spent 10+ hours a week helping customers book.",
];

function People() {
  return (
    <div className="dfc-ppl-wrap">
      <ul className="dfc-ppl">
        {FINDINGS.map((f) => (
          <li key={f} className="dfc-pc">
            <p className="text-lead dfc-pc__l">{f}</p>
          </li>
        ))}
      </ul>
      <div className="dfc-src-row">
        <p className="dfc-src text-meta">My interviews with customer success and sales.</p>
      </div>
    </div>
  );
}

/* ── 01b the zoom story ──────────────────────────────────────────── */
const TABS = ["01 the file", "02 one field", "03 the fix", "04 in the product"];

function Zoom() {
  const [cur, setCur] = useState(0);
  const [shown, setShown] = useState(0);
  const [out, setOut] = useState(false);
  const [hk, setHk] = useState(0);
  const [act, setAct] = useState<number | null>(null);
  const [lc, setLc] = useState(false);
  const [arrow, setArrow] = useState(50);
  const reduce = useReduce();
  const popRef = useRef<HTMLDivElement>(null);
  const narrow = useNarrow();
  const tabIds = useId().replace(/:/g, "");

  const show = useCallback(
    (i: number) => {
      setCur(i);
      if (i !== 3) {
        setAct(null);
        setLc(false);
      }
      if (reduce) {
        setShown(i);
        return;
      }
      setOut(true);
      window.setTimeout(() => {
        setShown(i);
        setOut(false);
      }, 180);
    },
    [reduce],
  );

  const openDec = (i: number, from?: HTMLElement | null) => {
    setAct(i);
    requestAnimationFrame(() => {
      const pop = popRef.current;
      const pin =
        from ??
        document.querySelector<HTMLElement>(`.dfc-pin[data-i="${i}"].is-after`) ??
        document.querySelector<HTMLElement>(`.dfc-pin[data-i="${i}"]`);
      if (!pop || !pin) return;
      const pr = pop.getBoundingClientRect();
      const br = pin.getBoundingClientRect();
      setArrow(Math.max(18, Math.min(pr.width - 18, br.left + br.width / 2 - pr.left)));
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAct(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const svgClass = [
    "dfc-zsvg",
    out ? "is-out" : "",
    hk ? `hl${hk}` : "",
    act != null ? `dh${act + 1}` : "",
    lc ? "lcon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const scene = SCENES[shown];
  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (cur + (e.key === "ArrowRight" ? 1 : 3)) % 4;
    show(n);
    document.getElementById(`${tabIds}-tab-${n}`)?.focus();
  };

  const mark = (k: number, text: string) => (
    /* an inline control: a <button> is atomic and cannot wrap across
       lines, so the phrase is a span with the button role and keys */
    <span
      role="button"
      tabIndex={0}
      className={`dfc-mark${hk === k ? " is-on" : ""}`}
      data-k={k}
      onMouseEnter={() => {
        setHk(k);
        if (cur !== k - 1) show(k - 1);
      }}
      onFocus={() => {
        setHk(k);
        if (cur !== k - 1) show(k - 1);
      }}
      onMouseLeave={() => setHk(0)}
      onBlur={() => setHk(0)}
      onClick={() => show(k - 1)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show(k - 1);
        }
      }}
    >
      {text}
    </span>
  );

  /* the users & roles scene: one wide picture, or before above after on phones */
  const halves = narrow && shown === 3;
  const views = halves
    ? [
        { vb: "10 10 430 340", x0: 10, y0: 10, w: 430, h: 340, side: "before" },
        { vb: "470 10 430 340", x0: 470, y0: 10, w: 430, h: 340, side: "after" },
      ]
    : [{ vb: "0 0 900 340", x0: 0, y0: 0, w: 900, h: 340, side: "all" }];

  return (
    <>
      <p className="text-lead dfc-lead dfc-zl">
        It started with {mark(1, "one file holding every style and component")}. Zoom in and{" "}
        {mark(2, "the same field was built five ways")}. The fix was {mark(3, "one component, with size and intent as variants")}, and you
        can see it in the product, where {mark(4, "a badge stopped looking like a button")}.
      </p>
      <div className="dfc-ztabs" role="tablist" aria-label="Zoom level" onKeyDown={onTabKey}>
        {TABS.map((t, i) => (
          <button
            key={t}
            id={`${tabIds}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={cur === i}
            aria-controls={`${tabIds}-panel`}
            tabIndex={cur === i ? 0 : -1}
            onClick={() => show(i)}
          >
            {t}
          </button>
        ))}
      </div>
      <figure className="exhibit dfc-zfig" id={`${tabIds}-panel`} role="tabpanel" aria-labelledby={`${tabIds}-tab-${cur}`}>
        {shown === 3 && (
          <button type="button" className="exhibit__replay dfc-lcbtn" aria-pressed={lc} onClick={() => setLc((v) => !v)}>
            show what looks clickable
          </button>
        )}
        <div className={halves ? "dfc-zstack" : undefined}>
          {views.map((v) => (
            <div className="dfc-zwrap" key={v.side}>
              <svg
                viewBox={v.vb}
                className={svgClass}
                data-bella-diagram
                role="img"
                aria-label={scene.label}
                dangerouslySetInnerHTML={{ __html: scene.svg }}
              />
              {shown === 3 && (
                <div className="dfc-pins">
                  {DECISIONS.flatMap((d, i) =>
                    d.pins
                      .filter(([x]) => v.side === "all" || (v.side === "before" ? x < 450 : x >= 450))
                      .map(([x, y, k]) => (
                        <button
                          key={`${i}-${x}`}
                          type="button"
                          data-i={i}
                          className={`dfc-pin ${k === "b" ? "is-before" : "is-after"}`}
                          style={{ left: `${((x - v.x0) / v.w) * 100}%`, top: `${((y - v.y0) / v.h) * 100}%` }}
                          aria-pressed={act === i}
                          aria-label={`Decision ${i + 1}: ${d.t}${k === "b" ? " (the problem, before)" : " (the fix, after)"}`}
                          onClick={(e) => openDec(i, e.currentTarget)}
                        >
                          {i + 1}
                        </button>
                      )),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {shown === 3 && act != null && (
          <div className="dfc-zpop" ref={popRef} role="status" style={{ "--ax": `${arrow}px` } as React.CSSProperties}>
            <span className="dfc-zpop__arrow" aria-hidden="true" />
            <div className="dfc-zpop__head">
              <span className="dfc-zpop__n">{act + 1}</span>
              <b>{DECISIONS[act].t}</b>
              <span className="dfc-zpop__nav">
                <button type="button" aria-label="Previous decision" onClick={() => openDec((act + DECISIONS.length - 1) % DECISIONS.length)}>
                  ←
                </button>
                <button type="button" aria-label="Next decision" onClick={() => openDec((act + 1) % DECISIONS.length)}>
                  →
                </button>
                <button type="button" aria-label="Close" onClick={() => setAct(null)}>
                  ×
                </button>
              </span>
            </div>
            <p>
              <span className="dfc-zpop__k">before</span> {DECISIONS[act].b}
            </p>
            <p>
              <span className="dfc-zpop__k">why</span> {DECISIONS[act].w}
            </p>
          </div>
        )}
        <figcaption className="exhibit__caption">{scene.caption}</figcaption>
      </figure>
      {shown === 3 && <p className="dfc-hint">tap a number on the picture to see the decision and why</p>}
    </>
  );
}

/* ── 02 token cascade ───────────────────────────────────────────── */
function Cascade() {
  return (
    <Exhibit className="dfc-cas" replayLabel="Replay the token animation" caption="The token cascade. Recreated concept.">
      <svg
        viewBox="0 0 900 190"
        data-bella-diagram
        role="img"
        aria-label="A raw colour value is set once in the foundation, travels to a semantic token called action, and the Book button picks it up. Then the value changes once and the button follows."
      >
        {/* three equal frames, 30px in from each side, content centred on
            the wire: the swatch row, then the label on two lines, so no
            label runs past its frame (24 Sep audit, A7) */}
        <rect className="s fr" pathLength={1} x="60.5" y="30.5" width="220" height="130" rx="14" />
        <rect className="s fr f2" pathLength={1} x="340.5" y="30.5" width="220" height="130" rx="14" />
        <rect className="s fr f3" pathLength={1} x="620.5" y="30.5" width="220" height="130" rx="14" />
        <path className="s wr w1" pathLength={1} d="M280.5 95.5 H340.5" />
        <path className="s wr w2" pathLength={1} d="M560.5 95.5 H620.5" />
        <g className="ck k1">
          <rect className="sw" x="90.5" y="54.5" width="40" height="24" rx="8" />
        </g>
        <text className="ti tx x1" x="142" y="71">
          brand-600
        </text>
        <text className="t tx x1 opt" x="90.5" y="115">
          <tspan x="90.5">foundation</tspan>
          <tspan x="90.5" dy="17">raw value</tspan>
        </text>
        <g className="ck k2">
          <rect className="sw" x="370.5" y="54.5" width="40" height="24" rx="8" />
        </g>
        <text className="ti tx x2" x="422" y="71">
          --action
        </text>
        <text className="t tx x2 opt" x="370.5" y="115">
          <tspan x="370.5">semantic</tspan>
          <tspan x="370.5" dy="17">what it&apos;s for</tspan>
        </text>
        <g className="ck k3">
          <rect className="sw" x="650.5" y="51.5" width="130" height="30" rx="15" />
          <text className="tk" x="715.5" y="71" textAnchor="middle">
            Book
          </text>
        </g>
        <text className="t tx x3 opt" x="650.5" y="115">
          <tspan x="650.5">component</tspan>
          <tspan x="650.5" dy="17">reads meaning</tspan>
        </text>
        <circle className="tv v1" cx="280.5" cy="95.5" r="5" />
        <circle className="tv v2" cx="560.5" cy="95.5" r="5" />
        <text className="t tx x4 opt" x="450" y="182" textAnchor="middle">
          change it once in the foundation, and every button follows
        </text>
      </svg>
    </Exhibit>
  );
}

/* ── 03 rollout timeline ────────────────────────────────────────── */
const STEPS: [string, string][] = [
  ["proposed", '"not necessary"'],
  ["built", "for myself"],
  ["paired", "1 designer + 1 dev"],
  ["showed", "the CTO"],
  ["shared", "every product team"],
];

function StepIcon({ i, x }: { i: number; x: number }) {
  switch (i) {
    case 0: /* speech bubble, crossed out: the proposal turned down */
      return (
        <>
          <path
            className="s c2"
            d={`M${x - 12} 46 h24 a4 4 0 0 1 4 4 v12 a4 4 0 0 1 -4 4 h-14 l-6 5 v-5 h-4 a4 4 0 0 1 -4 -4 v-12 a4 4 0 0 1 4 -4z`}
          />
          <path className="s" d={`M${x - 5} 52 l10 8 M${x + 5} 52 l-10 8`} />
        </>
      );
    case 1: /* stacked blocks: built it anyway */
      return (
        <>
          <rect className="s" x={x - 13} y="58" width="12" height="12" rx="2" />
          <rect className="s" x={x + 1} y="58" width="12" height="12" rx="2" />
          <rect className="s c1" x={x - 6} y="45" width="12" height="12" rx="2" />
        </>
      );
    case 2: /* two people: designer + developer */
      return (
        <>
          <circle className="s" cx={x - 6} cy="50" r="4.5" />
          <circle className="s c3" cx={x + 7} cy="50" r="4.5" />
          <path className="s" d={`M${x - 14} 68 a8 8 0 0 1 16 0 M${x - 1} 68 a8 8 0 0 1 16 0`} />
        </>
      );
    case 3: /* board with a rising line: the pitch */
      return (
        <>
          <rect className="s c1" x={x - 13} y="44" width="26" height="18" rx="2" />
          <path className="s" d={`M${x - 8} 57 l5 -4 l4 2 l6 -6 M${x} 62 v6 M${x - 6} 70 h12`} />
        </>
      );
    default: /* many people: every product team */
      return (
        <>
          {[
            [-10, 48],
            [0, 48],
            [10, 48],
            [-10, 62],
            [0, 62],
            [10, 62],
          ].map(([dx, dy], j) => (
            <circle key={j} className={j === 4 ? "s c3" : "s"} cx={x + dx} cy={dy} r="3.5" />
          ))}
        </>
      );
  }
}

function Rollout() {
  return (
    <Exhibit className="dfc-tl" replayLabel="Replay the rollout animation" caption="From one designer's side project to every team's.">
      <svg
        viewBox="0 0 900 150"
        data-bella-diagram
        role="img"
        aria-label="Five steps on one line, drawn left to right: proposed, and told it was not necessary; built for myself; paired, one designer and one developer; showed the CTO, which lights up; then shared with every product team, and it holds still."
      >
        <line className="s track" pathLength={1} x1="36" y1="58" x2="864" y2="58" />
        <rect className="c1 funded" x="669" y="56.5" width="147" height="3" rx="1.5" />
        {STEPS.map(([a, b], i) => {
          const x = 60 + i * 195;
          const d = (i / 4) * 2.3 + 0.05;
          const anc = i === 0 ? "start" : i === 4 ? "end" : "middle";
          const lx = i === 0 ? x - 24 : i === 4 ? x + 24 : x;
          return (
            <g key={a}>
              {i === 3 && <circle className="ring" cx={x} cy="58" r="24" style={{ animationDelay: `${d + 0.25}s` }} />}
              <g className="node" style={{ animationDelay: `${d}s` }}>
                <circle className="dfc-tl__disc" cx={x} cy="58" r="24" />
                <StepIcon i={i} x={x} />
              </g>
              <g className="lbl opt" style={{ animationDelay: `${d + 0.12}s` }}>
                <text className="ti" x={lx} y="112" textAnchor={anc}>
                  {a}
                </text>
                <text className="t" x={lx} y="134" textAnchor={anc}>
                  {b}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <ol className="dfc-legend" aria-hidden="true">
        {STEPS.map(([a, b]) => (
          <li key={a}>
            <b>{a}</b> {b}
          </li>
        ))}
      </ol>
    </Exhibit>
  );
}

/* ── 04 turnaround ──────────────────────────────────────────────── */
const AREAS = ["system in code", "search", "flights", "cars", "checkout", "users & roles"];
/* the first label wraps, so it stays left of the step it sits on (A7) */
const AREA_LINES: Record<string, string[]> = { "system in code": ["system", "in code"] };
const PTS: [number, number][] = [
  [437.5, 172],
  [512.5, 144],
  [587.5, 116],
  [662.5, 88],
  [737.5, 60],
  [812.5, 32],
];

function Turnaround() {
  return (
    <Exhibit className="dfc-turn" replayLabel="Replay the turnaround animation" caption="Each step is a product area shipped on the system. Order as on my list; not to scale.">
      <svg
        viewBox="0 0 900 240"
        data-bella-diagram
        role="img"
        aria-label="A flat line for two years of redesign with nothing live. Then the system arrives, and a rising line passes six product areas as they ship: the design system, search, flights, cars, checkout and payment, users and roles. Flight extras are nearly done."
      >
        <line className="dfc-turn__base" x1="40" y1="200" x2="860" y2="200" />
        <path className="s flat" pathLength={1} d="M40 200 H330" />
        <text className="t tt t0 opt" x="40" y="226">
          2 years of redesign · nothing live
        </text>
        <g className="sys">
          <circle cx="330" cy="200" r="9" className="s c1" />
          <text className="ti opt" x="330" y="180" textAnchor="middle">
            the system
          </text>
        </g>
        <path className="s rise" pathLength={1} d="M330 200 H400 V172 H475 V144 H550 V116 H625 V88 H700 V60 H775 V32 H850" />
        {AREAS.map((a, i) => {
          const [x, y] = PTS[i];
          return (
            <g key={a} className="ship" style={{ animationDelay: `${2.2 + (i + 1) * 0.36}s` }}>
              <circle cx={x} cy={y} r="5" className="s c3" />
              <text className="t opt" x={x} y={y - 11 - ((AREA_LINES[a]?.length ?? 1) - 1) * 14} textAnchor="middle">
                {AREA_LINES[a]
                  ? AREA_LINES[a].map((line, j) => (
                      <tspan key={line} x={x} dy={j ? 14 : 0}>
                        {line}
                      </tspan>
                    ))
                  : a}
              </text>
            </g>
          );
        })}
        <g className="ship" style={{ animationDelay: "4.7s" }}>
          <text className="t opt" x="860" y="226" textAnchor="end">
            next: flight extras, nearly done
          </text>
        </g>
      </svg>
      <ol className="dfc-legend" aria-hidden="true">
        <li>2 years of redesign · nothing live</li>
        <li>
          <b>the system</b> then, shipped on it:
        </li>
        {AREAS.map((a) => (
          <li key={a}>{a}</li>
        ))}
        <li>next: flight extras, nearly done</li>
      </ol>
    </Exhibit>
  );
}

/* ── the page ──────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function DriftCase(_props: { cs: CaseStudy }) {
  return (
    <>
      <Section ruled>
        <Eyebrow>01 · The problem, framed</Eyebrow>
        <h2 className="text-display-2 dfc-h2">It felt complicated. The numbers said why.</h2>
        <People />
        <Cee
          items={[
            ["the idea", "The drift was structural. Every vertical solved the same need its own way, with no shared language."],
            ["what shows it", "17 buttons doing one job. The filter chip built four ways, which broke sort and empty states."],
            ["why it matters", "“It looks inconsistent” became “this costs us time, here’s the evidence”."],
          ]}
        />
        <figure className="exhibit">
          <svg
            className="dfc-grave"
            viewBox="0 0 900 200"
            data-bella-diagram
            role="img"
            aria-label="Seventeen near-identical buttons with different corners and weights; one, in lavender, is the one the system kept."
            dangerouslySetInnerHTML={{ __html: buttonGrave() }}
          />
          <figcaption className="exhibit__caption">17 near-identical buttons from one product. The lavender one is the one we kept. Recreated.</figcaption>
        </figure>
      </Section>

      <Section ruled id="zoom">
        <Eyebrow>01b · The problem, at four zoom levels</Eyebrow>
        <h2 className="text-display-2 dfc-h2">From the whole file, down to one field, and back.</h2>
        <Zoom />
      </Section>

      <Section ruled>
        <Eyebrow>02 · Decisions</Eyebrow>
        <h2 className="text-display-2 dfc-h2">Decide once, and let it travel.</h2>
        <Cee
          items={[
            ["the idea", "Tiered tokens, so a component reads a meaning, never a raw value."],
            ["what shows it", "The same names in Figma variables and in code. Every fare case mapped to one rule string."],
            ["why it matters", "A card can’t show the wrong text, and design and code stay in parity."],
          ]}
        />
        <Cascade />
      </Section>

      <Section ruled>
        <Eyebrow>03 · Collaboration, and where it broke</Eyebrow>
        <h2 className="text-display-2 dfc-h2">Nobody asked for a system.</h2>
        {/* the box leads the section; the lead that repeated it is gone (F2) */}
        <Words k="What I chose not to do">
          I didn&apos;t wait for sign-off. The team said a system, docs and changelogs weren&apos;t necessary, so I built it for
          myself and paired with one developer. The cost: months carrying it alone, and pushback later on workflows,
          complexity and naming.
        </Words>
        <Rollout />
        <div className="dfc-two">
          <div>
            <h3 className="heading-item">Where it broke</h3>
            <ul>
              <li>Developers felt I was changing their workflow.</li>
              <li>They said the components were too complex and unnecessary.</li>
              <li>We argued a lot about naming. Even an accordion was hard to get built.</li>
            </ul>
          </div>
          <div>
            <h3 className="heading-item">What changed it</h3>
            <ul>
              <li>A new team of senior developers who built it with me.</li>
              <li>Later, the system moved to every product team, and only approved changes reached code.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section ruled>
        <Eyebrow>04 · Outcome</Eyebrow>
        <h2 className="text-display-2 dfc-h2">From a redesign that stalled to one that shipped.</h2>
        <p className="text-lead dfc-lead">
          Two years of redesign, and nothing live. Then the system gave every squad one language, and the work started landing.
        </p>
        <Turnaround />
        <div className="dfc-stats">
          <div>
            <p className="dfc-stats__n">+2</p>
            <p className="dfc-stats__l">designers, plus a funded engineering team</p>
          </div>
          <div>
            <p className="dfc-stats__n">6</p>
            <p className="dfc-stats__l">product areas live on the system</p>
          </div>
          <div>
            <p className="dfc-stats__n">1</p>
            <p className="dfc-stats__l">checkout for every product</p>
          </div>
        </div>
        <Words k="AI, and where I kept it out">
          I used Figma Make to prototype components and whole flows, so developers found the gaps before the sprint instead
          of halfway through it. What I kept out: the decisions. What ships and what things are called were settled with the
          team, not generated.
        </Words>
      </Section>

      <Section ruled>
        <Eyebrow>05 · Reflection</Eyebrow>
        <h2 className="text-display-2 dfc-h2">Next time, the team comes first.</h2>
        <div className="dfc-two">
          <div>
            <h3 className="heading-item">What I learned</h3>
            <ul>
              <li>Inconsistency is a symptom. The cause is missing structure and decisions nobody wrote down.</li>
              <li>In a legacy product, half the job is finding out why things are there before you change them.</li>
            </ul>
          </div>
          <div>
            <h3 className="heading-item">What I&apos;d do differently</h3>
            <ul>
              <li>Build the team first.</li>
              <li>Review and name every component together.</li>
              <li>Get senior developers on board before building.</li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
