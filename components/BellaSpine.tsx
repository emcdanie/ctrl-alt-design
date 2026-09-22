"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/Button";
import s from "./BellaSpine.module.css";

/**
 * The System page (Elleta, 22 Sep 2026, W1 release): rebuilt from
 * bella/docs/reference/system-page-mock.html. Hero stats, then 01 why,
 * 02 lifecycle, 03 playground, 04 the gate, 04b accessibility, 05
 * maturity, 06 what your team gets. Every section is a layout Section
 * with a SectionHeader; the demos sit under the header on one panel.
 *
 * Motion plays ONCE when a demo enters view; the two auto-cycling demos
 * (lifecycle, accessibility) carry a pause button and stop for good
 * the moment someone picks a step. Reduced motion shows the final frame.
 */

/* ── shared: reduced motion + play once in view ── */
function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useOnceInView<T extends Element>(cb: () => void, threshold = 0.35) {
  const ref = useRef<T>(null);
  const fn = useRef(cb);
  fn.current = cb;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          fn.current();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/* timers that die with the component or a replay */
function useTimers() {
  const ids = useRef<number[]>([]);
  const clear = useCallback(() => {
    ids.current.forEach((i) => window.clearTimeout(i));
    ids.current = [];
  }, []);
  const later = useCallback((f: () => void, ms: number) => {
    ids.current.push(window.setTimeout(f, ms));
  }, []);
  useEffect(() => clear, [clear]);
  return { later, clear };
}

/* ── the gate: every audit `npm run gate` runs, in gate order ──
   audit:debt asserts this list against package.json in BOTH directions,
   so it cannot describe a gate that no longer exists. */
const GATE: { name: string; stops: string }[] = [
  { name: "audit:sync", stops: "a component vendored from BELLA edited in place, or left stale" },
  { name: "audit:structure", stops: "more than one route tree per case, or anything off palette" },
  { name: "audit:layout", stops: "a page that sets its own spacing" },
  { name: "audit:frame", stops: "a page off the frame: a second content edge or a stray title size" },
  { name: "audit:sharp", stops: "a picture shown wider than half its pixels" },
  { name: "audit:fonts", stops: "a typeface or weight the system doesn't own" },
  { name: "audit:tokens", stops: "a raw colour or spacing value in the code" },
  { name: "audit:copy", stops: "an em dash, or the wrong positioning term" },
  { name: "audit:reuse", stops: "a component nothing imports, or a second copy left rendering" },
  { name: "audit:nda", stops: "a client or employer name anywhere in the tree" },
  { name: "audit:controls", stops: "a filter dressed as an action, or two primary buttons in one view" },
  { name: "audit:parity", stops: "a case study that is routable but missing from the work list" },
  { name: "audit:agents", stops: "bella.json or llms.txt disagreeing with the live registry" },
  { name: "audit:contract", stops: "a component contract describing code that isn't there" },
  { name: "audit:contrast", stops: "any text under WCAG AA, in either theme" },
  { name: "audit:axe", stops: "any axe violation, on any route, in either theme" },
  { name: "audit:type", stops: "reading text below 16px, or a heading off the type scale" },
  { name: "audit:visual", stops: "a second page ground, or sibling cards of unequal height" },
  { name: "audit:dark", stops: "an embedded demo that ships one skin in dark mode" },
  { name: "audit:order", stops: "a change to what a screen reader reads, and in which order" },
  { name: "audit:debt", stops: "a doc citing a missing file, or a token nothing uses" },
];

/* ══════════════════════════════ HERO ══════════════════════════════ */

export function HeroStats({ auditCount }: { auditCount: number }) {
  const [on, setOn] = useState(false);
  const [n, setN] = useState([0, 0]);
  const ref = useOnceInView<HTMLDivElement>(() => {
    setOn(true);
    const to = [7, auditCount];
    if (reduced()) return setN(to);
    const t0 = performance.now();
    const tick = () => {
      const now = performance.now();
      const v = to.map((t, i) => {
        const x = Math.max(0, Math.min(1, (now - t0 - i * 150) / 900));
        return Math.round(t * (1 - Math.pow(1 - x, 3)));
      });
      setN(v);
      if (v[0] < to[0] || v[1] < to[1]) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, 0.4);

  return (
    <div ref={ref} className={s.stats}>
      <div>
        <div className={`${s.sv} ${s.sv7}`} aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} className={on ? s.on : undefined} style={{ transitionDelay: `${i * 120}ms` }} />
          ))}
        </div>
        <b>
          <span aria-hidden="true">{n[0]}</span>
          <span className="sr-only">7</span>
        </b>
        <span className={s.statL}>steps, a human at every one</span>
      </div>
      <div>
        <div className={`${s.sv} ${s.sv21}`} aria-hidden="true">
          {Array.from({ length: auditCount }, (_, i) => (
            <i key={i} className={on ? s.on : undefined} style={{ transitionDelay: `${i * 40}ms` }} />
          ))}
        </div>
        <b>
          <span aria-hidden="true">{n[1]}</span>
          <span className="sr-only">{auditCount}</span>
        </b>
        <span className={s.statL}>checks that can stop a merge</span>
      </div>
      <div>
        <div className={`${s.sv} ${s.sv2}`} aria-hidden="true">
          <i />
          <i />
        </div>
        <b>AAA</b>
        <span className={s.statL}>text contrast, in both themes</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════ 01 ══════════════════════════════ */

type Part = [text: string, marked: 0 | 1, note?: string];
const CODE_L: Part[] = [
  ["<", 0], ["div", 1, "custom div, not the Card component"], [' className="card"\n  style={{ ', 0],
  ['background: "#f7f7f7"', 1, "invented grey"], [",\n    borderRadius: ", 0], ["11", 1, "radius not on the scale"], // token-waiver: the guessed code shown as text
  [" }}>\n  …\n  <button style={{ ", 0], ["fontSize: 13", 1, "below the type floor"],
  [" }}>\n    Book a visit\n  </button>\n</div>", 0],
];
const CODE_R: Part[] = [
  ["<", 0], ["ListingCard", 1], ["\n  surface=", 0], ['"panel"', 1], ["\n  radius=", 0], ['"md"', 1],
  [">\n  …\n  <", 0], ['Button variant="primary"', 1], [">\n    Book a visit\n  </Button>\n</ListingCard>", 0],
];
const lenOf = (p: Part[]) => p.reduce((a, x) => a + x[0].length, 0);

function Typed({ parts, n, marks, bad }: { parts: Part[]; n: number; marks: number; bad: boolean }) {
  let used = 0;
  let k = 0;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const [t, m, note] = parts[i];
    const take = Math.max(0, Math.min(t.length, n - used));
    used += t.length;
    if (!take) break;
    const txt = t.slice(0, take);
    if (m) {
      const idx = k++;
      const lit = idx < marks;
      out.push(
        <span key={i} className={`${s.m} ${lit ? (bad ? s.mBad : s.mOk) : ""}`} title={note}>
          {txt}
        </span>,
      );
      if (bad && lit) out.push(<span key={`p${i}`} className={s.pin} aria-hidden="true">{idx + 1}</span>);
    } else out.push(<span key={i} className={s.k}>{txt}</span>);
  }
  return <>{out}</>;
}

function Duo() {
  const total = Math.max(lenOf(CODE_L), lenOf(CODE_R));
  const [n, setN] = useState(0);
  const [marks, setMarks] = useState(0);
  const [done, setDone] = useState(false);
  const run = useRef(0);
  const { later, clear } = useTimers();

  const play = useCallback(() => {
    const my = ++run.current;
    clear();
    setDone(false);
    setMarks(0);
    if (reduced()) {
      setN(total);
      setMarks(4);
      setDone(true);
      return;
    }
    let c = 0;
    const tick = () => {
      if (run.current !== my) return;
      c += 4;
      setN(c);
      if (c < total) requestAnimationFrame(tick);
      else {
        for (let i = 1; i <= 4; i++) later(() => run.current === my && setMarks(i), 400 + (i - 1) * 450);
        later(() => run.current === my && setDone(true), 400 + 4 * 450);
      }
    };
    requestAnimationFrame(tick);
  }, [total, later, clear]);

  const ref = useOnceInView<HTMLDivElement>(play, 0.35);

  const Mini = ({ g1 }: { g1?: boolean }) => (
    <div className={s.mini} aria-hidden="true">
      <div className={s.miImg} />
      <div className={s.miB}>
        <b>Canet de Mar, Spain</b>
        <span className="ds-meta">2 rooms · €1,150 month</span>
        <span className={`${s.miBtn} ${g1 ? s.g1 : ""}`}>Book a visit</span>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={s.panel}>
      <div className={s.top}>
        <span className="text-code">prompt: &quot;a booking card for a rental&quot;</span>
        <button type="button" className={s.chip} onClick={play}>
          replay
        </button>
      </div>
      <div className={s.duoG}>
        <div className={s.side}>
          <div className={s.sideH}>
            <b>No documentation</b>
            <span className={`${s.vb} ${done ? s.vbBad : ""} text-code`} aria-live="polite">
              {done ? "refused · 4 guesses" : "checking"}
            </span>
          </div>
          <Mini g1 />
          <pre className={`${s.code} text-code`} aria-label="Code the agent wrote without documentation: a custom div, an invented grey, a radius off the scale, and a font size below the floor.">
            <Typed parts={CODE_L} n={n} marks={marks} bad />
          </pre>
        </div>
        <div className={s.side}>
          <div className={s.sideH}>
            <b>With BELLA&apos;s contract</b>
            <span className={`${s.vb} ${done ? s.vbOk : ""} text-code`} aria-live="polite">
              {done ? "merged · 0 guesses" : "checking"}
            </span>
          </div>
          <Mini />
          <pre className={`${s.code} text-code`} aria-label="Code the agent wrote with BELLA's contract: ListingCard, the panel surface, the md radius, and the primary Button.">
            <Typed parts={CODE_R} n={n} marks={marks} bad={false} />
          </pre>
        </div>
      </div>
      <div className={`${s.legend} text-code`}>
        <span className="text-code">
          <i className={`${s.lg} ${s.lgBad}`} aria-hidden="true" />
          guessed: not in the system
        </span>
        <span className="text-code">
          <i className={`${s.lg} ${s.lgOk}`} aria-hidden="true" />
          read from the contract
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════ 02 ══════════════════════════════ */

const STEPS: [string, string, string, string, string, [number, number, number]][] = [
  ["Intent", "What it's for", "I start with what the component is for: its job, its states, and the words we'll all use for it. Claude helps me synthesise the research and audits so the decision is grounded.", "Figma · Claude · audits", "Never. Everything downstream depends on it.", [1, 1, 0]],
  ["Tokens", "Values first", "Every colour, space and type size is a token before it's a pixel. One build turns the token source into CSS, JSON and the Storybook theme.", "tokens/bella.json · build script", "Never. No mystery hex codes.", [1, 0, 1]],
  ["AI draft", "First coded draft", "Claude Code writes the first draft against AGENTS.md, BELLA's rulebook for machines: token-first, the accessibility bar. I review every line.", "Claude Code · AGENTS.md", "For a one-line fix I just write it myself.", [1, 1, 0]],
  ["Pull request", "Context for review", "The why goes into the PR: what changed, what it replaces, and screenshots in both themes. Reviewers shouldn't have to guess.", "GitHub · screenshots", "Never. The PR is the conversation.", [0, 1, 1]],
  ["The gate", "Standards, tests, a11y", "One command runs it all: tokens rebuilt and diff-checked, contract parity, visual snapshots and accessibility. Nothing merges until it passes.", "npm run gate · Storybook test runner · axe", "Never. The gate is the point.", [0, 0, 1]],
  ["Release", "Versioned, readable", "Versioned with a changelog and documented in Storybook, so people and AI tools can read what each component promises.", "Changelog · Storybook", "Small doc fixes ride along with the next release.", [0, 0, 1]],
  ["Product", "Shipped at fidelity", "The site you're reading. What ships is what the system promised, in both themes, and feedback starts the next round.", "Next.js · Vercel · sync:bella", "Never. This is where it has to hold up.", [1, 0, 1]],
];
const LANES: [string, boolean][] = [
  ["Me · designer", false],
  ["Claude · never merges", true],
  ["Me · context engineer", false],
];

/* the popover arrow points at the picked item: measured, so it tracks
   any width */
function useArrow(pop: React.RefObject<HTMLElement | null>) {
  const [ax, setAx] = useState<number | null>(null);
  const point = useCallback(
    (target: Element | null | undefined, frac = 0.5) => {
      const p = pop.current;
      if (!p || !target) return;
      const pr = p.getBoundingClientRect();
      const br = target.getBoundingClientRect();
      setAx(Math.max(18, Math.min(pr.width - 18, br.left + br.width * frac - pr.left)));
    },
    [pop],
  );
  return { ax, point };
}

function Lifecycle() {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const { ax, point } = useArrow(popRef);

  const ref = useOnceInView<HTMLDivElement>(() => setStarted(true), 0.3);

  useEffect(() => {
    if (reduced()) setPaused(true);
  }, []);

  useEffect(() => {
    if (!started || paused) return;
    const t = window.setInterval(() => setCur((c) => (c + 1) % STEPS.length), 2600);
    return () => window.clearInterval(t);
  }, [started, paused]);

  useEffect(() => {
    const fn = () => point(stepsRef.current?.children[cur]?.querySelector("i"));
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [cur, point]);

  const d = STEPS[cur];
  return (
    <div ref={ref} className={s.panel}>
      <div className={s.top}>
        <span className="text-code">
          step <b className={s.inkB}>{cur + 1}</b> of 7
        </span>
        <button type="button" className={s.chip} onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play the steps" : "Pause the steps"}>
          {paused ? "play" : "pause"}
        </button>
      </div>
      <div ref={stepsRef} className={s.lcSteps} role="tablist" aria-label="Lifecycle steps">
        {STEPS.map((st, i) => (
          <button
            key={st[0]}
            type="button"
            role="tab"
            id={`lc-tab-${i}`}
            aria-controls="lc-panel"
            aria-selected={i === cur}
            className={`${s.lcs} ${i < cur ? s.done : ""}`}
            onClick={() => {
              setPaused(true);
              setCur(i);
            }}
          >
            <i>{i + 1}</i>
            <b>{st[0]}</b>
            <span>{st[1]}</span>
          </button>
        ))}
      </div>
      <div className={s.lanes} aria-hidden="true">
        {LANES.map(([name, claude], k) => (
          <div key={name} className={`${s.lane} ${claude ? s.claude : ""}`}>
            <span className="text-code">{name}</span>
            {STEPS.map((st, i) => (
              <i key={i} className={`${st[5][k] ? s.laneOn : ""} ${i === cur ? s.cur : ""}`} />
            ))}
          </div>
        ))}
      </div>
      <div
        ref={popRef}
        id="lc-panel"
        role="tabpanel"
        aria-labelledby={`lc-tab-${cur}`}
        className={s.pop}
        style={ax === null ? undefined : ({ "--ax": `${ax}px` } as React.CSSProperties)}
      >
        <span className={s.ar} aria-hidden="true" />
        <div className={s.popH}>
          <b>{d[0]}</b>
          <span className="text-code">{d[1]}</span>
        </div>
        <p>{d[2]}</p>
        <div className={s.lcMeta}>
          <span>
            <span className="text-code">tools</span> {d[3]}
          </span>
          <span>
            <span className="text-code">when I skip it</span> {d[4]}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════ 03 ══════════════════════════════ */

const lum = (h: string) => {
  const c = (h.match(/\w\w/g) ?? []).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a: string, b: string) => {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
/* the contrast maths needs real values, so the playground's brand swatches
   and the two grounds it checks against are literals, each reviewed */
const ACC: [string, string][] = [
  ["iris", "#5b4bd1"], // token-waiver: a brand swatch the visitor tries
  ["sea", "#1f5f7a"], // token-waiver: a brand swatch the visitor tries
  ["market", "#0a7a5c"], // token-waiver: a brand swatch the visitor tries
  ["coral", "#e8603c"], // token-waiver: a brand swatch the visitor tries
  ["sun", "#ffd23f"], // token-waiver: a brand swatch the visitor tries
];
const GROUND = {
  light: { bg: "#ffffff", ink: "#121212", mu: "#515151", line: "#e3e3e3", panel: "#f2f2f2" }, // token-waiver: BELLA light values, for the contrast maths
  dark: { bg: "#161616", ink: "#ededed", mu: "#b1b1b1", line: "#2a2a2a", panel: "#1f1f1f" }, // token-waiver: BELLA dark values, for the contrast maths
};
const RAD: [string, string][] = [["sharp", "3px"], ["system", "12px"], ["soft", "22px"]];
const DEN: [string, string][] = [["compact", "10px"], ["system", "16px"], ["comfy", "24px"]];
const MOD = ["light", "dark"] as const;

function Playground() {
  const [st, setSt] = useState({ a: 0, r: 1, d: 1, m: 0 });
  const { later } = useTimers();
  const ref = useOnceInView<HTMLDivElement>(() => {
    if (reduced()) return;
    ([[3, 700], [4, 1900], [0, 3300]] as const).forEach(([i, t]) => later(() => setSt((x) => ({ ...x, a: i })), t));
  }, 0.5);

  const a = ACC[st.a][1];
  const g = GROUND[MOD[st.m]];
  const on = ratio("#ffffff", a) >= ratio("#121212", a) ? "#ffffff" : "#121212"; // token-waiver: the two label candidates
  const rows: [string, number, boolean][] = [
    ["button label on accent", ratio(on, a), false],
    ["accent against the card", ratio(a, g.bg), true],
    ["body text", ratio(g.ink, g.bg), false],
    ["muted text", ratio(g.mu, g.bg), false],
  ];
  let fail = 0;
  const graded = rows.map(([name, r, ui]) => {
    const grade = ui ? (r >= 3 ? ["≥ 3:1", ""] : ["fails", "no"]) : r >= 7 ? ["AAA", ""] : r >= 4.5 ? ["AA", "aa"] : ["fails", "no"];
    if (grade[1] === "no") fail++;
    return { name, r, grade };
  });
  const vars = {
    "--a": a, "--on": on, "--r": RAD[st.r][1], "--pd": DEN[st.d][1],
    "--lbg": g.bg, "--link": g.ink, "--lm": g.mu, "--lline": g.line, "--lp": g.panel,
  } as React.CSSProperties;

  const Seg = ({ k, items }: { k: "r" | "d" | "m"; items: readonly string[] }) => (
    <div className={s.seg}>
      {items.map((x, i) => (
        <button key={x} type="button" aria-pressed={st[k] === i} onClick={() => setSt((v) => ({ ...v, [k]: i }))}>
          {x}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={`${s.panel} ${s.pg}`}>
      <div className={`${s.box} ${s.pgCtl}`}>
        <div className={s.grp} role="group" aria-labelledby="pg-acc">
          <span id="pg-acc" className="text-code">--accent</span>
          <div className={s.sws}>
            {ACC.map(([name, hex], i) => (
              <button key={name} type="button" aria-label={name} aria-pressed={st.a === i} style={{ background: hex }} onClick={() => setSt((v) => ({ ...v, a: i }))} />
            ))}
          </div>
        </div>
        <div className={s.grp} role="group" aria-labelledby="pg-rad">
          <span id="pg-rad" className="text-code">--radius</span>
          <Seg k="r" items={RAD.map((x) => x[0])} />
        </div>
        <div className={s.grp} role="group" aria-labelledby="pg-den">
          <span id="pg-den" className="text-code">--density</span>
          <Seg k="d" items={DEN.map((x) => x[0])} />
        </div>
        <div className={s.grp} role="group" aria-labelledby="pg-mode">
          <span id="pg-mode" className="text-code">--mode</span>
          <Seg k="m" items={MOD} />
        </div>
        <button type="button" className={s.chip} onClick={() => setSt({ a: 0, r: 1, d: 1, m: 0 })}>
          ↺ reset to BELLA
        </button>
      </div>
      <div className={s.pgOut}>
        <div className={s.lst} style={vars}>
          <div className={s.lstImg}>
            <span className={s.lstNew}>new</span>
            <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect x="0" y="150" width="400" height="70" className={s.sea} />
              <path d="M0 150 H400 M150 150 V92 L200 60 L250 92 V150 M180 150 V118 H200 V150" className={s.ln} />
              <rect x="214" y="104" width="22" height="16" rx="3" className={`${s.ac} ${s.ln}`} />
              <circle cx="320" cy="52" r="15" className={`${s.ac} ${s.ln}`} />
            </svg>
          </div>
          <div className={s.lstB}>
            <div className={s.lstR}>
              <b>Canet de Mar, Spain</b>
              <span>★ 4.92</span>
            </div>
            <span className={`${s.lstM} ds-meta`}>2 rooms · 64 m² · 5 min to the beach</span>
            <div className={s.lstBar}>
              <span>
                <b>€1,150</b> month
              </span>
              <span className={s.lstBtn} aria-hidden="true">
                Book a visit
              </span>
            </div>
          </div>
        </div>
        <div className={s.box} aria-live="polite">
          <div className={s.pgGh}>
            <span className="text-code">the gate</span>
            <span className={`${s.verdict} ${fail ? s.vBad : ""} text-code`}>{fail ? `blocked · ${fail} fail` : "ships"}</span>
          </div>
          {graded.map(({ name, r, grade }) => (
            <div key={name} className={s.pgr}>
              <span>{name}</span>
              <span className={`${s.v} text-code`}>{r.toFixed(2)}</span>
              <span className={`${s.bd} ${grade[1] === "aa" ? s.bdAa : grade[1] === "no" ? s.bdNo : ""} text-code`}>{grade[0]}</span>
            </div>
          ))}
        </div>
        <p className="text-code">
          {`// --accent: ${a} · radius: ${RAD[st.r][1]} · density: ${DEN[st.d][0]} · mode: ${MOD[st.m]}`}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════ 04 ══════════════════════════════ */

function Pipeline({ auditCount }: { auditCount: number }) {
  const NODES: [string, string][] = [
    ["write", "tokens"], ["build", "build.py"], ["generate", "css · json"], ["check", `${auditCount} audits`], ["ship", "site"],
  ];
  const [tok, setTok] = useState(-1);
  const [lit, setLit] = useState(-1);
  const [passed, setPassed] = useState(0);
  const [pass, setPass] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const run = useRef(0);
  const { later, clear } = useTimers();
  const gridRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const { ax, point } = useArrow(popRef);

  const play = useCallback(() => {
    const my = ++run.current;
    clear();
    setPass(false);
    setPassed(0);
    if (reduced()) {
      setTok(4);
      setLit(4);
      setPassed(GATE.length);
      setPass(true);
      return;
    }
    setTok(0);
    setLit(-1);
    const go = (i: number, at: number, cb?: () => void) => {
      later(() => run.current === my && setTok(i), at);
      later(() => {
        if (run.current !== my) return;
        setLit(i);
        cb?.();
      }, at + 420);
    };
    go(0, 0);
    go(1, 600);
    go(2, 1200);
    go(3, 1800, () => {
      GATE.forEach((_, k) =>
        later(() => {
          if (run.current !== my) return;
          setPassed(k + 1);
          if (k === GATE.length - 1) {
            setPass(true);
            go(4, 400);
          }
        }, k * 80),
      );
    });
  }, [clear, later]);

  const ref = useOnceInView<HTMLDivElement>(play, 0.35);

  useEffect(() => {
    if (pick === null) return;
    const fn = () => point(gridRef.current?.children[pick]);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [pick, point]);

  return (
    <div ref={ref} className={s.panel}>
      <div className={s.pipeHead}>
        <p className="sr-only">
          A change travels through write, build, generate, check and ship. The check step runs {auditCount} audits and passes only
          when all of them do.
        </p>
        <button type="button" className={s.chip} onClick={play}>
          replay
        </button>
      </div>
      <div className={s.pipe} aria-hidden="true">
        <span className={s.pipeLine} />
        {NODES.map(([t1, t2], i) => (
          <div key={t1} className={`${s.nd} ${lit === i && !(i === 3 && pass) ? s.lit : ""} ${i === 3 && pass ? s.pass : ""}`}>
            <b>{t1}</b>
            <span>{t2}</span>
            {i === 3 && <i className={`${s.tick} ${pass ? s.tickOn : ""}`}>✓</i>}
          </div>
        ))}
        <span className={s.tok} style={{ "--i": Math.max(0, tok) } as React.CSSProperties}>
          <i />
          <span>your change</span>
        </span>
      </div>
      <div ref={gridRef} className={s.grid21} role="group" aria-label={`The ${auditCount} checks`}>
        {GATE.map((g, i) => (
          <button
            key={g.name}
            type="button"
            aria-pressed={pick === i}
            className={`${s.c21} ${i < passed ? s.c21Done : ""}`}
            onClick={() => setPick(i)}
          >
            <span className={s.dot} aria-hidden="true" />
            <b>{g.name.replace("audit:", "")}</b>
            <span className="text-code">{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <p className={`${s.count} text-code`} aria-live="polite">
        <b>{passed}</b> of {auditCount} passed
      </p>
      <div ref={popRef} className={s.pop} hidden={pick === null} style={ax === null ? undefined : ({ "--ax": `${ax}px` } as React.CSSProperties)}>
        <span className={s.ar} aria-hidden="true" />
        {pick !== null && (
          <>
            <div className={s.popH}>
              <code className={s.popCode}>{GATE[pick].name}</code>
              <button type="button" className={s.x} aria-label="Close" onClick={() => setPick(null)}>
                ×
              </button>
            </div>
            <p>
              <span className="text-code">stops</span> {GATE[pick].stops}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════ 04b ══════════════════════════════ */

const A11Y: { t: string; ref: string; what: string; by: string }[] = [
  { t: "Keyboard first", ref: "2.1.1 · 2.4.7", what: "Every control is reachable with Tab and shows a visible focus ring, separate from hover.", by: "audit:axe · keyboard pass by hand" },
  { t: "Never colour alone", ref: "1.4.1", what: "Status always pairs colour with an icon and a word, so it survives colour blindness and greyscale.", by: "contracts · visual review" },
  { t: "Reduced motion", ref: "2.3.3", what: "Every animation respects prefers-reduced-motion and shows its finished frame instead.", by: "reduced-motion pass by hand" },
  { t: "Target size", ref: "2.5.8", what: "Interactive targets are at least 24px, and 44px on touch, so fingers and shaky hands can hit them.", by: "contracts · 390px screenshots" },
  { t: "Names for screen readers", ref: "4.1.2 · 1.1.1", what: "Icons, diagrams and toggles carry real labels. Every diagram on this page describes its story in words.", by: "audit:axe · audit:order" },
  { t: "Reflow and zoom", ref: "1.4.10 · 1.4.4", what: "Layouts reflow to 320px and survive 200% text zoom with no sideways scroll.", by: "audit:frame at 390 · 200% zoom by hand" },
];

function A11yDemo({ i, cur }: { i: number; cur: number }) {
  const active = i === cur;
  const [f, setF] = useState(1);
  const [dx, setDx] = useState(0);
  useEffect(() => {
    if (!active || reduced()) return;
    if (i === 0) {
      const t = window.setInterval(() => setF((k) => (k + 1) % 3), 500);
      return () => window.clearInterval(t);
    }
    if (i === 2) {
      setDx(40);
      const a = window.setTimeout(() => setDx(-40), 700);
      const b = window.setTimeout(() => setDx(0), 1400);
      return () => {
        window.clearTimeout(a);
        window.clearTimeout(b);
      };
    }
  }, [active, i]);
  switch (i) {
    case 0:
      return (
        <>
          {["Save", "Book", "Share"].map((x, k) => (
            <span key={x} className={`${s.dBtn} ${k === f ? s.dF : ""}`}>{x}</span>
          ))}
        </>
      );
    case 1:
      return (
        <>
          <span className={`${s.dPill} ${s.dOk}`}>✓ passed</span>
          <span className={`${s.dPill} ${s.dNo}`}>✕ failed</span>
        </>
      );
    case 2:
      return <span className={s.dDot} style={{ transform: `translateX(${dx}px)` }} />;
    case 3:
      return (
        <>
          <span className={`${s.dBtn} ${s.dSmall}`}>×</span>
          <span className={s.dHit} />
        </>
      );
    case 4:
      return <span className={s.dSr}>aria-label=&quot;Close dialog&quot;</span>;
    default:
      return (
        <span className={`${s.dDoc} ${active ? s.dDocNarrow : ""}`}>
          <i />
          <i />
          <i />
        </span>
      );
  }
}

function Accessibility() {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const gRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const { ax, point } = useArrow(popRef);
  const ref = useOnceInView<HTMLDivElement>(() => setStarted(true), 0.3);

  useEffect(() => {
    if (reduced()) setPaused(true);
  }, []);
  useEffect(() => {
    if (!started || paused) return;
    const t = window.setInterval(() => setCur((c) => (c + 1) % A11Y.length), 2600);
    return () => window.clearInterval(t);
  }, [started, paused]);
  useEffect(() => {
    const fn = () => point(gRef.current?.children[cur]);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [cur, point]);

  const a = A11Y[cur];
  return (
    <div ref={ref} className={s.panel}>
      <div className={s.top}>
        <span className="text-code">
          <b className={s.inkB}>{cur + 1}</b> of 6
        </span>
        <button type="button" className={s.chip} onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play the tour" : "Pause the tour"}>
          {paused ? "play" : "pause"}
        </button>
      </div>
      <div ref={gRef} className={s.axG}>
        {A11Y.map((x, i) => (
          <button
            key={x.t}
            type="button"
            aria-pressed={i === cur}
            className={s.axt}
            onClick={() => {
              setPaused(true);
              setCur(i);
            }}
          >
            <span className={s.ah}>
              <b>{x.t}</b>
              <span className="text-code">WCAG {x.ref}</span>
            </span>
            <span className={s.demo} aria-hidden="true">
              <A11yDemo i={i} cur={cur} />
            </span>
          </button>
        ))}
      </div>
      <div ref={popRef} className={s.pop} aria-live="polite" style={ax === null ? undefined : ({ "--ax": `${ax}px` } as React.CSSProperties)}>
        <span className={s.ar} aria-hidden="true" />
        <div className={s.popH}>
          <b>{a.t}</b>
          <span className="text-code">WCAG {a.ref}</span>
        </div>
        <p>{a.what}</p>
        <p className={s.next}>
          <span className="text-code">checked by</span> {a.by}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════ 05 ══════════════════════════════ */

function Maturity({ auditCount }: { auditCount: number }) {
  const M: [string, number, string, string, string][] = [
    ["Foundations", 3, "teenage", "Three token tiers, a 4px grid, AAA-minded contrast, zero hard-coded values.", "Motion and layout tokens get the same depth as colour."],
    ["Documentation & knowledge", 2, "growing", "Every token carries machine-readable metadata, plus DESIGN.md, bella.json and an llms.txt map.", "Usage guidance written for product teams, not just for me."],
    ["Governance & team", 2, "growing", `Governance as code: a ${auditCount}-audit gate that fails the build on drift, run by a team of one.`, "A contribution model and a second maintainer."],
    ["Adoption", 1, "V1", "Powers elleta.design today, with CHIP next. Few consumers, by design.", "A second product on the system, with its own theme."],
    ["Measurement & impact", 1, "V1", "Deliberately no vanity metrics; the working system is the evidence.", "Track time from design to merged component, and drift caught by the gate."],
    ["AI readiness", 3, "teenage", "The newest test of a system is the path an AI takes, and this one defaults agents into it.", "Skills shipped with the system, so agents can scaffold safely."],
  ];
  const [filled, setFilled] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const { ax, point } = useArrow(popRef);
  const ref = useOnceInView<HTMLDivElement>(() => setFilled(true), 0.3);
  const motion = !reduced();

  useEffect(() => {
    if (pick === null) return;
    const fn = () => point(rowsRef.current?.children[pick]?.querySelector(`.${s.tr}`), M[pick][1] / 4 - 0.04);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pick, point]);

  const tone = (n: number) => (n >= 3 ? "" : n === 2 ? s.fG : s.fV);
  return (
    <div ref={ref} className={s.panel}>
      <div className={`${s.mtScale} text-code`} aria-hidden="true">
        <span />
        <div>
          <span style={{ left: "12.5%" }}>V1</span>
          <span style={{ left: "37.5%" }}>growing</span>
          <span style={{ left: "62.5%" }}>teenage</span>
          <span style={{ left: "87.5%" }}>healthy</span>
        </div>
        <span />
      </div>
      <div ref={rowsRef}>
        {M.map((m, i) => (
          <button
            key={m[0]}
            type="button"
            aria-pressed={pick === i}
            aria-label={`${m[0]}: ${m[2]}, ${m[1]} of 4`}
            className={s.mtr}
            onClick={() => setPick(i)}
          >
            <b>{m[0]}</b>
            <span className={s.tr}>
              {[0, 1, 2, 3].map((k) => (
                <i
                  key={k}
                  className={filled && k < m[1] ? `${s.f} ${tone(m[1])}` : undefined}
                  style={motion ? { transitionDelay: `${i * 160 + k * 120}ms` } : undefined}
                />
              ))}
            </span>
            <span className={`${s.sc} text-code`}>{m[1]} / 4</span>
          </button>
        ))}
      </div>
      <div ref={popRef} className={s.pop} hidden={pick === null} aria-live="polite" style={ax === null ? undefined : ({ "--ax": `${ax}px` } as React.CSSProperties)}>
        <span className={s.ar} aria-hidden="true" />
        {pick !== null && (
          <>
            <div className={s.popH}>
              <b>{M[pick][0]}</b>
              <span className="text-code">
                {M[pick][2]} · {M[pick][1]} of 4
              </span>
            </div>
            <p>{M[pick][3]}</p>
            <p className={s.next}>
              <span className="text-code">next</span> {M[pick][4]}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════ PAGE ══════════════════════════════ */

export default function BellaSpine({ auditCount, auditCountWord }: { auditCount: number; auditCountWord: string }) {
  return (
    <>
      <Section id="s1" ruled>
        <SectionHeader
          kicker="01 · Why it matters"
          heading="It looks right."
          accent="The code says otherwise."
          lead="Same prompt, same agent. Without documentation it fills the gaps with guesses, and the guesses look almost right. You only see them in the code."
        />
        <Duo />
        <div className={s.tri}>
          <div>
            <span className="text-code">
              <i className={s.triC1} aria-hidden="true" />
              the idea
            </span>
            <p>If a decision isn&apos;t written down, AI will make one up.</p>
          </div>
          <div>
            <span className="text-code">
              <i className={s.triC2} aria-hidden="true" />
              what shows it
            </span>
            <p>Two cards you can&apos;t tell apart, and four guesses hiding in the code.</p>
          </div>
          <div>
            <span className="text-code">
              <i className={s.triC3} aria-hidden="true" />
              why it matters
            </span>
            <p>Small guesses become drift. Documentation is what the gate checks against.</p>
          </div>
        </div>
      </Section>

      <Section id="life" ruled>
        <SectionHeader
          kicker="02 · How a component gets made"
          heading="A human at every step,"
          accent="AI where it helps."
          lead="My workflow, adapted from TJ Pitre's context-based design systems lifecycle and run for real on BELLA."
        />
        <Lifecycle />
      </Section>

      <Section id="try" ruled>
        <SectionHeader
          kicker="03 · Try your brand"
          heading="Bring your brand."
          accent="The system decides what ships."
          lead="Pick an accent, a corner and a density. The card follows, and the gate checks every choice live. Some brand colours won't make it, and it tells you why."
        />
        <Playground />
        <p className={s.after}>
          <Link href="/case-studies/theming" className="text-action">
            See theming in depth →
          </Link>
        </p>
      </Section>

      <Section id="gate" ruled>
        <SectionHeader
          kicker="04 · Every merge"
          heading="A system that can't refuse"
          accent="is a suggestion."
          lead={`Colour is one check of ${auditCountWord}. Every change walks this path, and any one of them can stop it.`}
        />
        <Pipeline auditCount={auditCount} />
        <p className={s.note}>Tap any check to see what it stops.</p>
      </Section>

      <Section id="a11y" ruled>
        <SectionHeader
          kicker="04b · Accessibility"
          heading="More than contrast."
          accent="Built in, not bolted on."
          lead="Contrast is the easy check. These are the other six BELLA holds itself to, on every component, before anything merges."
        />
        <Accessibility />
        <p className={s.note}>
          Target: WCAG 2.2 AA everywhere, AAA for body text. Reference:{" "}
          <a href="https://www.w3.org/WAI/WCAG22/quickref/" className="text-action">
            w3.org/WAI/WCAG22
          </a>
          . Automated checks catch about a third of issues, so every component also gets a keyboard and screen-reader pass by hand.
        </p>
      </Section>

      <Section id="stand" ruled>
        <SectionHeader
          kicker="05 · Self-assessment"
          heading="Where the system"
          accent="honestly stands."
          lead="Not a scoreboard. Scored against zeroheight's six-axis maturity model: strong where it can be for a team of one, early where it needs a team."
        />
        <Maturity auditCount={auditCount} />
        <p className={s.note}>
          Stages: V1, Growing, Teenage, Healthy product. Model: zeroheight Design System Maturity Model. Self-assessed. Tap an axis for the
          why and what&apos;s next.
        </p>
      </Section>

      <Section id="value" ruled>
        <SectionHeader kicker="06 · What your team gets" heading="One language," accent="three kinds of people." />
        <div className={s.val}>
          <div>
            <span className={`${s.tagv} ${s.triC1bg} text-code`}>designers</span>
            <h3 className="heading-item">Decisions that stick.</h3>
            <p>Tokens and contracts mean a choice made once shows up everywhere, in both themes.</p>
          </div>
          <div>
            <span className={`${s.tagv} ${s.triC2bg} text-code`}>developers</span>
            <h3 className="heading-item">No guessing.</h3>
            <p>The same names in Figma and code, a contract per component, and a gate that tells you why before review does.</p>
          </div>
          <div>
            <span className={`${s.tagv} ${s.triC3bg} text-code`}>product and leads</span>
            <h3 className="heading-item">Faster, without drift.</h3>
            <p>AI can draft safely because the system can say no. New brands are a token file, not a redesign.</p>
          </div>
        </div>
        <div className={s.cta}>
          <p>This is how I&apos;d start with your system: an audit, one component through the whole lifecycle, and a gate your team owns.</p>
          <div className={s.ctaB}>
            <Button href="/contact" variant="primary">
              Let&apos;s talk
            </Button>
            <a className={s.chip} href="https://emcdanie.github.io/bella" target="_blank" rel="noopener noreferrer">
              Storybook ↗
            </a>
            <a className={s.chip} href="https://github.com/emcdanie/bella" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
