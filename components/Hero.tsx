"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/layout/Section";
import { HOME_STORY } from "@/lib/copy";
import styles from "./Hero.module.css";

/* Home hero v4 "design. [engineer]" (Elleta, 5 Oct 2026, job 43c; Figma
   371:37889 for the layout, words and callouts, the Hero Stack Lab
   "Yours v4" preset for the motion). "design." on the left, "engineer" in
   the ochre corners on the right, three plates between them: 01 the
   pattern (the soft fill, always behind Bella), 02 the photo, 03 the
   agent plate. Numbered pins on the plates lead, dashed and elbowed, to
   four callout chips under the right lede; the chips face the viewer
   while the plates turn. One custom property, --hero-p (1 apart, 0
   assembled), drives every transform over the first --hero-scroll of
   scroll. The real h1 is the story line, hidden; the big words are
   display text. Reduced motion: assembled, static. Phone: assembles as
   it scrolls into view, no pins or callouts. */

/* the pins' numerals, as Figma exports them (the code face, 9px,
   outlines): a pin is a picture, so nothing reads it as text */
const PIN_ZERO =
  "M4.616 11.046L7.064 6.519L7.784 6.564L5.336 11.091L4.616 11.046ZM6.2 12.144C5.732 12.144 5.327 12.009 4.985 11.739C4.643 11.469 4.382 11.085 4.202 10.587C4.022 10.089 3.932 9.498 3.932 8.814C3.932 8.124 4.022 7.53 4.202 7.032C4.382 6.534 4.643 6.15 4.985 5.88C5.327 5.604 5.732 5.466 6.2 5.466C6.674 5.466 7.079 5.604 7.415 5.88C7.757 6.15 8.018 6.534 8.198 7.032C8.378 7.53 8.468 8.124 8.468 8.814C8.468 9.498 8.378 10.089 8.198 10.587C8.018 11.085 7.757 11.469 7.415 11.739C7.079 12.009 6.674 12.144 6.2 12.144ZM6.2 11.262C6.47 11.262 6.698 11.166 6.884 10.974C7.076 10.776 7.223 10.494 7.325 10.128C7.433 9.762 7.487 9.324 7.487 8.814C7.487 8.292 7.433 7.848 7.325 7.482C7.223 7.116 7.076 6.837 6.884 6.645C6.698 6.447 6.47 6.348 6.2 6.348C5.936 6.348 5.708 6.447 5.516 6.645C5.324 6.837 5.174 7.116 5.066 7.482C4.964 7.848 4.913 8.292 4.913 8.814C4.913 9.324 4.964 9.762 5.066 10.128C5.174 10.494 5.324 10.776 5.516 10.974C5.708 11.166 5.936 11.262 6.2 11.262Z";
const PIN_DIGIT: Record<string, string> = {
  "01": "M11.3535 12V7.446H9.71548V6.645H10.5255C10.7595 6.645 10.9485 6.612 11.0925 6.546C11.2365 6.474 11.3415 6.363 11.4075 6.213C11.4735 6.063 11.5065 5.862 11.5065 5.61H12.2985V12H11.3535ZM9.40048 12V11.109H13.7925V12H9.40048Z",
  "02": "M9.32848 12C9.32848 11.526 9.39748 11.103 9.53548 10.731C9.67348 10.359 9.91648 10.011 10.2645 9.687C10.6185 9.357 11.1075 9.027 11.7315 8.697C12.0015 8.559 12.2205 8.427 12.3885 8.301C12.5565 8.175 12.6795 8.04 12.7575 7.896C12.8355 7.752 12.8745 7.578 12.8745 7.374C12.8745 7.164 12.8325 6.984 12.7485 6.834C12.6645 6.684 12.5385 6.567 12.3705 6.483C12.2025 6.393 11.9925 6.348 11.7405 6.348C11.3325 6.348 11.0115 6.456 10.7775 6.672C10.5495 6.888 10.4055 7.197 10.3455 7.599L9.36448 7.536C9.43048 6.906 9.66748 6.405 10.0755 6.033C10.4835 5.655 11.0385 5.466 11.7405 5.466C12.1965 5.466 12.5805 5.544 12.8925 5.7C13.2105 5.856 13.4505 6.075 13.6125 6.357C13.7745 6.639 13.8555 6.966 13.8555 7.338C13.8555 7.668 13.8015 7.953 13.6935 8.193C13.5855 8.433 13.4055 8.655 13.1535 8.859C12.9015 9.063 12.5565 9.282 12.1185 9.516C11.7525 9.714 11.4465 9.909 11.2005 10.101C10.9605 10.287 10.7775 10.467 10.6515 10.641C10.5315 10.809 10.4655 10.965 10.4535 11.109H13.8645V12H9.32848Z",
  "03": "M11.5425 12.144C10.8405 12.144 10.3035 11.976 9.93148 11.64C9.55948 11.304 9.35848 10.863 9.32848 10.317L10.2915 10.254C10.3275 10.62 10.4595 10.881 10.6875 11.037C10.9215 11.187 11.2095 11.262 11.5515 11.262C11.7855 11.262 12.0045 11.226 12.2085 11.154C12.4125 11.082 12.5745 10.968 12.6945 10.812C12.8205 10.656 12.8835 10.446 12.8835 10.182C12.8835 9.924 12.8265 9.711 12.7125 9.543C12.6045 9.375 12.4485 9.252 12.2445 9.174C12.0465 9.09 11.8185 9.048 11.5605 9.048H11.0655V8.202H11.5605C11.7645 8.202 11.9505 8.172 12.1185 8.112C12.2865 8.052 12.4185 7.953 12.5145 7.815C12.6165 7.677 12.6675 7.5 12.6675 7.284C12.6675 6.972 12.5715 6.738 12.3795 6.582C12.1935 6.426 11.9265 6.348 11.5785 6.348C11.2185 6.348 10.9455 6.423 10.7595 6.573C10.5795 6.723 10.4685 6.93 10.4265 7.194L9.45448 7.131C9.52048 6.633 9.73348 6.231 10.0935 5.925C10.4595 5.619 10.9575 5.466 11.5875 5.466C12.0075 5.466 12.3705 5.538 12.6765 5.682C12.9885 5.82 13.2285 6.018 13.3965 6.276C13.5645 6.534 13.6485 6.843 13.6485 7.203C13.6485 7.599 13.5225 7.92 13.2705 8.166C13.0245 8.406 12.6645 8.571 12.1905 8.661V8.49C12.7065 8.55 13.1145 8.736 13.4145 9.048C13.7145 9.354 13.8645 9.741 13.8645 10.209C13.8645 10.617 13.7655 10.965 13.5675 11.253C13.3755 11.541 13.1025 11.763 12.7485 11.919C12.4005 12.069 11.9985 12.144 11.5425 12.144Z",
  "04": "M12.2625 12V10.65H9.22048V9.831L12.1635 5.61H13.2075V9.777H13.9725V10.65H13.2075V12H12.2625ZM10.1475 9.777H12.2625V6.87L10.1475 9.777Z",
};

/* the callouts, top to bottom (Figma), each with the pin it leads from */
const CALLOUTS = [
  { pin: "03", token: "--radius-full", dot: "ochre" },
  { pin: "04", token: "--space-2", dot: "peach" },
  { pin: "02", token: "img · alt", dot: "ink" },
  { pin: "01", token: "--color-ground", dot: "ground" },
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

    /* each pin sits flat on its anchor (the anchor turns with its plate);
       the leaders run from each pin to its callout, as Figma: 03 right
       into a lane on the agent plate, then down; the others straight
       down; each ends in an open chevron at its chip */
    const annotate = (p: number) => {
      if (p < 0.02 || phone.matches) {
        svg.replaceChildren();
        return;
      }
      const box = hero.getBoundingClientRect();
      const agent = hero.querySelector<HTMLElement>("[data-plate-agent]")!.getBoundingClientRect();
      let d = "";
      for (const c of CALLOUTS) {
        const a = hero.querySelector<HTMLElement>(`[data-anchor="${c.pin}"]`)!.getBoundingClientRect();
        const pin = hero.querySelector<SVGSVGElement>(`[data-pin="${c.pin}"]`)!;
        const chip = hero.querySelector<HTMLElement>(`[data-callout="${c.pin}"]`)!.getBoundingClientRect();
        const x = a.left - box.left;
        const y = a.top - box.top;
        pin.style.translate = `${x}px ${y}px`;
        const r = pin.getBoundingClientRect().width / 2;
        const ex = chip.left - box.left - 4;
        const ey = chip.top - box.top + chip.height / 2;
        if (c.pin === "03") {
          const lane = agent.right - box.left - agent.width * 0.108;
          d += `<path d="M${x + r} ${y}H${lane}V${ey}H${ex}"/>`;
        } else {
          d += `<path d="M${x} ${y + r}V${ey}H${ex}"/>`;
        }
        d += `<path data-chev d="M${ex - 7} ${ey - 5}L${ex} ${ey}L${ex - 7} ${ey + 5}"/>`;
      }
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      svg.innerHTML = d;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      if (reduce.matches) {
        hero.style.setProperty("--hero-p", "0");
        annotate(0);
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
      annotate(p);
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
      <div className={styles.scroller} data-frame-exempt="Home hero v4: Figma 371:37889 runs on a 1440 canvas past the content edge (Elleta, 5 Oct 2026)">
        <div ref={heroRef} className={styles.hero}>
          <div className={`${styles.col} ${styles.left}`}>
            <p className={styles.word} aria-hidden="true">
              design
              <span className={styles.dot} />
            </p>
            <p className={styles.sub}>I bring people together through systems that humans can read.</p>
          </div>
          <div className={`${styles.col} ${styles.right}`}>
            <p className={`${styles.word} ${styles.engineer}`} aria-hidden="true">
              <span className={styles.corners}>
                <i className={styles.tl} />
                <i className={styles.tr} />
                <i className={styles.bl} />
                <i className={styles.br} />
                engineer
              </span>
            </p>
            <p className={`${styles.sub} ${styles.subCode}`}>And I build them in code, so agents can read them too.</p>
            <ul className={styles.callouts} aria-hidden="true">
              {CALLOUTS.map((c) => (
                <li key={c.pin} data-callout={c.pin}>
                  <i data-dot={c.dot} />
                  {c.token}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.stage} data-stage>
            <div className={styles.trail} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/home/pattern-ribbon.webp" alt="" width={1240} height={520} decoding="async" fetchPriority="low" />
            </div>
            {/* 01, the pattern: the soft fill, always behind the photo */}
            <div className={`${styles.layer} ${styles.paint}`} aria-hidden="true">
              <i className={styles.anchor} data-anchor="01" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={styles.soft} src="/images/home/hero-soft-fill.webp" alt="" width={900} height={860} decoding="async" fetchPriority="low" />
            </div>
            <div className={`${styles.layer} ${styles.you}`}>
              <i className={styles.anchor} data-anchor="02" />
              {/* the photo and the faint code fade at the bottom as ONE group
                  (18h): the photo covers the code first, so no code ever
                  reads through her */}
              <div className={styles.group}>
                {/* the faint code is a picture (CLAUDE.md §9): decoration far
                    under the contrast floor, so nothing for an audit to read. It
                    rides the photo's layer, behind the photo, in every state */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className={styles.code} src="/images/home/hero-code.webp" alt="" width={370} height={214} decoding="async" fetchPriority="low" />
                {/* the LCP (23, 4 Oct 2026): 800w for phones (396px at most,
                    sharp at 2x), 1080w for the 540px desktop; the hero's
                    decoration loads low so the photo gets the bandwidth */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.portrait}
                  src="/images/home/portrait.webp"
                  srcSet="/images/home/portrait-800.webp 800w, /images/home/portrait.webp 1080w"
                  sizes="(max-width: 900px) 396px, 540px"
                  alt="Elleta McDaniel with her dog Bella"
                  width={1080}
                  height={908}
                  fetchPriority="high"
                />
              </div>
            </div>
            <div className={`${styles.layer} ${styles.agent}`} aria-hidden="true" data-plate-agent>
              <div className={styles.grid} />
              <i className={styles.anchor} data-anchor="03" />
              <i className={styles.anchor} data-anchor="04" />
              {/* --space-2, measured: Figma's Measure (372:78) */}
              <svg className={styles.measure} viewBox="0 0 101 10" preserveAspectRatio="none">
                <path d="M0.75 0V10M0.75 5H99.55M99.55 0V10" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>

          <svg ref={svgRef} className={styles.leaders} aria-hidden="true" />
          {CALLOUTS.map((c) => (
            <svg key={c.pin} className={styles.pin} data-pin={c.pin} data-ochre={c.pin === "03" || undefined} viewBox="0 0 18 18" aria-hidden="true">
              <circle cx="9" cy="9" r="9" />
              <path d={PIN_ZERO + PIN_DIGIT[c.pin]} />
            </svg>
          ))}
        </div>
      </div>
    </Section>
  );
}
