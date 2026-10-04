"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/layout/Section";
import { HOME_STORY } from "@/lib/copy";
import styles from "./Hero.module.css";

/* Home hero v3 (Elleta, 4 Oct 2026, hero v3 lock; prototype option C).
   "designer" on the left, "code" in the ochre corners on the right, the
   portrait specimen between them. The real h1 is the story line, hidden;
   the two big words are display text. The specimen starts pulled apart
   (03 Agent layer, 02 Me, 01 Pattern, with leaders to a legend) and one
   custom property, --hero-p, assembles it over the first --hero-scroll
   of scroll. transform, opacity and clip-path only. Reduced motion: the
   finished picture, static. Phone: assembles as it scrolls into view,
   no leaders. */

const LEGEND = [
  { num: "03", label: "Agent layer", note: "tokens and labels a machine reads", ochre: true },
  { num: "02", label: "Me", note: "the person, with alt text" },
  { num: "01", label: "Pattern", note: "ELLETA pattern, on Bella" },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const svg = svgRef.current;
    if (!hero || !svg) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const phone = matchMedia("(max-width: 900px)");
    const css = getComputedStyle(document.documentElement);
    const scrollSpan = () => parseFloat(css.getPropertyValue("--hero-scroll")) * parseFloat(css.fontSize) || 420;

    /* the leaders: from each layer's anchor (on its visible part) to its
       legend number, one curve each, redrawn while pulled apart */
    const leaders = (p: number) => {
      if (p < 0.5 || phone.matches) {
        svg.replaceChildren();
        return;
      }
      const box = hero.getBoundingClientRect();
      const nums = [...hero.querySelectorAll<HTMLElement>("[data-legend-num]")];
      /* in legend order: 03 agent, 02 me, 01 pattern */
      const anchors = ["agent", "me", "pattern"].map((k) => hero.querySelector<HTMLElement>(`[data-anchor-${k}]`)!);
      let d = "";
      anchors.forEach((a, i) => {
        const s = a.getBoundingClientRect();
        const e = nums[i].getBoundingClientRect();
        const sx = s.left - box.left;
        const sy = s.top - box.top;
        const ex = e.left - box.left - 10;
        const ey = e.top - box.top + e.height / 2;
        const dx = ex - sx;
        const c1x = sx + Math.max(60, dx * 0.55);
        const c1y = sy + (i === 0 ? 60 : i === 2 ? 50 : 0);
        const c2x = ex - Math.max(60, dx * 0.5);
        d += `<path d="M${sx} ${sy} C${c1x} ${c1y} ${c2x} ${ey} ${ex} ${ey}"/><circle cx="${sx}" cy="${sy}" r="4"/>`;
      });
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      svg.innerHTML = d;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduce.matches) {
        hero.style.setProperty("--hero-p", "0");
        leaders(0);
        return;
      }
      let p: number;
      if (phone.matches) {
        const top = hero.querySelector<HTMLElement>("[data-stage]")!.getBoundingClientRect().top;
        p = Math.min(1, Math.max(0, (top - innerHeight * 0.15) / (innerHeight * 0.5)));
      } else {
        p = 1 - Math.min(1, Math.max(0, scrollY / scrollSpan()));
      }
      p = p * p * (3 - 2 * p);
      hero.style.setProperty("--hero-p", p.toFixed(3));
      hero.toggleAttribute("data-apart", p > 0.5);
      leaders(p);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    reduce.addEventListener("change", queue);
    document.fonts?.ready.then(queue);
    update();
    return () => {
      removeEventListener("scroll", queue);
      removeEventListener("resize", queue);
      reduce.removeEventListener("change", queue);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section labelledBy="home-hero-title">
      <h1 id="home-hero-title" className="sr-only">
        {HOME_STORY}
      </h1>
      <div className={styles.scroller} data-frame-exempt="Home h1: story line locked by Elleta 3 Oct (hero v3, 4 Oct)">
        <div ref={heroRef} className={styles.hero}>
          <div className={`${styles.col} ${styles.left}`}>
            <p className={styles.word} aria-hidden="true">
              designer
              <span className={styles.dot} />
            </p>
            <p className={styles.sub}>I bring people together through systems that humans can read.</p>
          </div>
          <div className={`${styles.col} ${styles.right}`}>
            <p className={styles.word} aria-hidden="true">
              <span className={styles.corners}>
                <i className={styles.tl} />
                <i className={styles.tr} />
                <i className={styles.bl} />
                <i className={styles.br} />
                code
              </span>
            </p>
            <p className={`${styles.sub} ${styles.subCode}`}>And I build them in code, so agents can read them too.</p>
          </div>

          <div className={styles.stage} data-stage>
            <div className={styles.trail} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/home/pattern-ribbon.webp" alt="" width={1240} height={520} decoding="async" />
            </div>
            <div className={`${styles.layer} ${styles.you}`}>
              <i className={styles.anchor} data-anchor-me />
              {/* the faint code is a picture (CLAUDE.md §9): decoration far
                  under the contrast floor, so nothing for an audit to read. It rides
                  the photo's layer, behind the photo, in every state */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.code} src="/images/home/hero-code.webp" alt="" width={399} height={222} decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.portrait}
                src="/images/home/portrait.webp"
                alt="Elleta McDaniel with her dog Bella"
                width={1080}
                height={908}
                fetchPriority="high"
              />
            </div>
            <div className={`${styles.layer} ${styles.paint}`} aria-hidden="true">
              <i className={styles.anchor} data-anchor-pattern />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.fill} src="/images/home/bella-ear-pattern.webp" alt="" width={900} height={908} decoding="async" />
            </div>
            <div className={`${styles.layer} ${styles.agent}`} aria-hidden="true">
              <div className={styles.grid} />
              <div className={`${styles.box} ${styles.boxAlt}`}>
                <b>img · alt</b>
              </div>
              <div className={`${styles.box} ${styles.boxRadius} ${styles.ochre}`}>
                <b>--radius-full</b>
              </div>
              <div className={`${styles.box} ${styles.boxSpace} ${styles.peach}`}>
                <b>--space-2</b>
                <i className={styles.anchorEnd} data-anchor-agent />
              </div>
              <div className={`${styles.box} ${styles.boxPattern}`}>
                <b>bella · pattern</b>
              </div>
            </div>
          </div>

          <svg ref={svgRef} className={styles.leaders} aria-hidden="true" />
          <div className={styles.legend} aria-hidden="true">
            {LEGEND.map((l) => (
              <div key={l.num}>
                <em data-legend-num className={l.ochre ? styles.ochre : undefined}>
                  {l.num}
                </em>
                <span>
                  {l.label}
                  <small>{l.note}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
