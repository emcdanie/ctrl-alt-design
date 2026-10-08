"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { THEMES, type Role } from "@/components/theming/themes";
import styles from "./SystemBeat.module.css";

/* The Home system beat (Elleta, 8 Oct 2026; Claude outputs/system-beat-hifi.html,
   approved light and dark). One real case card taken apart into four filled
   planes, a curved leader to a dot ON each part (recomputed from the
   transformed planes), the pins on the right. A slider pulls it whole to
   apart; "Rebuild as another brand" swaps the parts to the Coast demo brand
   and puts it back together. It plays once when it comes into view. Reduced
   motion and no-JS show the apart frame. Drawn in design units (--u), so it
   scales with its column and never reflows; the art is aria-hidden and the
   pins carry the content. */

const PINS = [
  { i: 4, name: "The words", text: "Every size is a role, not a number.", code: ["Label/Eyebrow", "Heading/Card"] },
  { i: 3, name: "The picture", text: "The cover, clipped to the card.", code: ["radius/inner"] },
  { i: 2, name: "The card", text: "Edge, corner and shadow.", code: ["surface", "shadow.card"] },
  { i: 1, name: "The tokens", text: "One source for every value. Change one, every card follows.", code: ["action.primary"] },
];

/* Coast is the Theming case's demo brand, read from its data so no value is
   written twice */
const coast = THEMES.coast;
const pick = (r: Role) => {
  const [ramp, step] = coast.sem[r];
  return coast[ramp][step];
};
const COAST = {
  "--c-surface": pick("bg"),
  "--c-ink": pick("ink"),
  "--c-muted": pick("muted"),
  "--c-action": pick("action"),
  "--c-accent": pick("accent"),
  "--c-tag": pick("line"),
} as CSSProperties;

/* the digit shown counts down the pins, 1 at the top (Elleta, 8 Oct 2026);
   `i` stays the key the planes and leaders find a part by */
const shown = (i: number) => PINS.length + 1 - i;

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export default function SystemBeat() {
  const fig = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lines = useRef<SVGSVGElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const t = useRef(1);
  const busy = useRef(false);
  const reduce = useRef(false);
  const [active, setActive] = useState<number | null>(null);
  const [brand, setBrand] = useState<"bella" | "coast">("bella");

  /* the rightmost visible corner of a plane, pulled slightly inside its
     edge: the dot sits on the part, not beside it */
  const anchor = useCallback((pl: HTMLElement): [number, number] | null => {
    const f = fig.current;
    if (!f) return null;
    const body = pl.querySelector<HTMLElement>("[data-a]");
    const w = pl.offsetWidth;
    const h = pl.offsetHeight;
    const bx = body ? body.offsetLeft : 0;
    const by = body ? body.offsetTop : 0;
    const bw = body ? body.offsetWidth : w;
    const bh = body ? body.offsetHeight : h;
    const tf = getComputedStyle(pl).transform;
    const m = new DOMMatrix(tf === "none" ? undefined : tf);
    const world = pl.parentElement as HTMLElement;
    const cw = world.getBoundingClientRect();
    const sc = cw.width / world.offsetWidth;
    const pts = [
      [bx, by],
      [bx + bw, by],
      [bx + bw, by + bh],
      [bx, by + bh],
    ].map(([x, y]) => {
      const p = m.transformPoint(new DOMPoint(x - w / 2, y - h / 2));
      return [p.x, p.y];
    });
    let best = pts[0];
    pts.forEach((p) => {
      if (p[0] > best[0]) best = p;
    });
    const cc = m.transformPoint(new DOMPoint(bx + bw / 2 - w / 2, by + bh / 2 - h / 2));
    const k = 0.1;
    const ax = best[0] + (cc.x - best[0]) * k;
    const ay = best[1] + (cc.y - best[1]) * k;
    const fr = f.getBoundingClientRect();
    return [cw.left + cw.width / 2 + ax * sc - fr.left, cw.top + cw.height / 2 + ay * sc - fr.top];
  }, []);

  const draw = useCallback(() => {
    const f = fig.current;
    const svg = lines.current;
    if (!f || !svg) return;
    const fr = f.getBoundingClientRect();
    const show = clamp((t.current - 0.55) / 0.35);
    let html = "";
    f.querySelectorAll<HTMLElement>("[data-pin]").forEach((b) => {
      const i = b.dataset.pin as string;
      const pl = f.querySelector<HTMLElement>(`[data-i="${i}"]`);
      const num = b.querySelector<HTMLElement>("[data-num]");
      const a = pl && anchor(pl);
      if (!a || !num) return;
      const [ax, ay] = a;
      const n = num.getBoundingClientRect();
      const x0 = n.left - fr.left - 8;
      const y0 = n.top + n.height / 2 - fr.top;
      const on = b.getAttribute("aria-pressed") === "true" ? ' class="on"' : "";
      const dx = Math.max(40, (x0 - ax) * 0.5);
      html += `<path${on} opacity="${show}" d="M${x0} ${y0} C${x0 - dx} ${y0} ${ax + dx} ${ay} ${ax} ${ay}"/><circle${on} opacity="${show}" cx="${ax}" cy="${ay}" r="4.5"/>`;
      const bd = f.querySelector<HTMLElement>(`[data-badge="${i}"]`);
      if (bd) {
        bd.style.left = `${ax}px`;
        bd.style.top = `${ay}px`;
        bd.style.opacity = String(show);
      }
    });
    svg.innerHTML = html;
  }, [anchor]);

  const setT = useCallback(
    (v: number) => {
      t.current = clamp(v);
      fig.current?.style.setProperty("--t", t.current.toFixed(3));
      if (slider.current) slider.current.value = String(Math.round(t.current * 100));
      draw();
    },
    [draw],
  );

  const anim = useCallback(
    (to: number, ms: number) =>
      new Promise<void>((res) => {
        if (reduce.current) {
          setT(to);
          return res();
        }
        const from = t.current;
        const s = performance.now();
        const step = (n: number) => {
          const k = Math.min(1, (n - s) / ms);
          setT(from + (to - from) * ease(k));
          if (k < 1) requestAnimationFrame(step);
          else res();
        };
        requestAnimationFrame(step);
      }),
    [setT],
  );

  const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, reduce.current ? 0 : ms));

  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setT(1);
    const on = () => draw();
    addEventListener("resize", on);
    document.fonts?.ready.then(on);
    /* plays once when it comes into view: whole, then apart */
    let played = false;
    const io = new IntersectionObserver(
      async (es) => {
        if (played || !es[0].isIntersecting) return;
        played = true;
        if (reduce.current) return;
        setT(0);
        await wait(350);
        await anim(1, 1400);
      },
      { threshold: 0.45 },
    );
    if (stage.current) io.observe(stage.current);
    return () => {
      removeEventListener("resize", on);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    draw();
  }, [active, draw]);

  const press = (i: number) => {
    const next = active === i ? null : i;
    setActive(next);
    if (next !== null && t.current < 0.6) anim(1, 700);
  };

  const rebuild = async () => {
    if (busy.current) return;
    busy.current = true;
    if (t.current < 0.95) await anim(1, 700);
    await wait(200);
    setBrand((b) => (b === "bella" ? "coast" : "bella"));
    await wait(500);
    await anim(0, 1000);
    busy.current = false;
  };

  const isCoast = brand === "coast";
  const hl = (i: number) => (active === i ? ` ${styles.on}` : "");

  return (
    <div ref={fig} className={styles.fig} data-brand={brand} style={isCoast ? COAST : undefined}>
      <div ref={stage} className={styles.stage}>
        <div
          className={styles.world}
          role="img"
          aria-label="A case card from this site, pulled apart into four layers: the words, the picture, the card, and the tokens every value comes from."
        >
          <div className={`${styles.pl} ${styles.p1}${hl(1)}`} data-i="1" aria-hidden="true">
            <div className={styles.tk}>
              <span className={styles.chip}>
                <i className={styles.dotAction} />
                action.primary
              </span>
              <span className={styles.chip}>
                <i className={styles.dotInk} />
                text.primary
              </span>
              <span className={styles.chip}>
                <i className={styles.dotAccent} />
                accent
              </span>
              <span className={styles.chip}>radius/card {isCoast ? "3" : "16"}</span>
              <span className={styles.chip}>shadow.card</span>
              <span className={styles.chip}>Heading/Card</span>
            </div>
          </div>
          <div className={`${styles.pl} ${styles.p2}${hl(2)}`} data-i="2" aria-hidden="true">
            <span className={`${styles.slot} ${styles.s1}`} />
            <span className={`${styles.slot} ${styles.s2}`} />
            <span className={`${styles.slot} ${styles.s3}`} />
            <span className={`${styles.slot} ${styles.s4}`} />
            <span className={styles.rad} />
          </div>
          <div className={styles.pl} data-i="3" aria-hidden="true">
            <div className={`${styles.ph}${hl(3)}`} data-a>
              {/* 1200px source, at most 300 design units wide (audit:sharp) */}
              <img src="/images/kit/product-coat.jpg" width={1200} height={754} alt="" loading="lazy" decoding="async" />
              <span className={`${styles.ui} ${styles.back}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </span>
              <span className={`${styles.ui} ${styles.heart}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
                </svg>
              </span>
              <span className={`${styles.ui} ${styles.count}`}>1 / 8</span>
            </div>
          </div>
          <div className={styles.pl} data-i="4" aria-hidden="true">
            <div className={`${styles.plate}${hl(4)}`} data-a />
            <div className={styles.wd}>
              <p className={styles.eb}>{isCoast ? "Coast · demo brand" : "Complex SaaS · Design systems"}</p>
              <p className={styles.tt}>From Drift to Foundation</p>
              <div className={styles.tags}>
                <span className={styles.tag}>Tokens</span>
                <span className={styles.tag}>Governance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ol className={styles.pins} aria-label="The four layers">
        {PINS.map((p) => (
          <li key={p.i}>
            <button type="button" className={styles.pin} data-pin={p.i} aria-pressed={active === p.i} onClick={() => press(p.i)}>
              <span className={styles.num} data-num data-digit={shown(p.i)}>
                {shown(p.i)}
              </span>
              <span className={styles.pn}>{p.name}</span>
              <span className={styles.pd}>
                {p.text}{" "}
                {p.code.map((c, k) => (
                  <span key={c}>
                    {k ? " · " : ""}
                    <code>{c}</code>
                  </span>
                ))}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <svg ref={lines} className={styles.leadLines} aria-hidden="true" />
      {PINS.map((p) => (
        <span key={p.i} className={styles.badge} data-badge={p.i} data-digit={shown(p.i)} aria-hidden="true">
          {shown(p.i)}
        </span>
      ))}

      <div className={styles.ctl}>
        <label className={styles.sl}>
          Whole
          <input
            ref={slider}
            type="range"
            min={0}
            max={100}
            defaultValue={100}
            aria-label="Pull the card apart"
            onInput={(e) => setT(Number((e.target as HTMLInputElement).value) / 100)}
          />
          Apart
        </label>
        <button type="button" className={styles.btn} onClick={rebuild}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4" />
          </svg>
          {isCoast ? "Rebuild as BELLA" : "Rebuild as another brand"}
        </button>
      </div>
      <p className={styles.cap} aria-live="polite">
        {isCoast ? "Same parts, same token names, another brand. That’s the Theming case." : "The card on the site. Every value comes from BELLA."}
      </p>
    </div>
  );
}
