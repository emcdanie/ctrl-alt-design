"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

interface Bubble {
  /** bubble label (JSX so labels can line-break like the proto) */
  label: React.ReactNode;
  /** reveal-card kicker */
  kicker: string;
  /** reveal-card title */
  title: string;
  ingredients: string[];
  href: string;
  cta?: string;
  /** bubble gradient (recorded hero tokens) */
  hi: string;
  lo: string;
  /** bright case colour — drives the card glow (--cc) */
  glow: string;
  /** deep case colour — readable accent text on the light card (--ct) */
  deep: string;
  /** desktop geometry, from _proto/_hero.html */
  size: number;
  top: string;
  left: string;
}

/* Six case bubbles. Colours are the recorded --case-* tokens; geometry is
 * the vetted _proto cluster. */
const CASES: Bubble[] = [
  {
    label: "Code First",
    kicker: "Design Systems · 2024–25",
    title: "Code First",
    ingredients: ["Figma → code parity", "Primitive → semantic tokens", "Component governance"],
    href: "/case-studies/brad-frost",
    hi: "var(--case-code-first-hi)",
    lo: "var(--case-code-first-lo)",
    glow: "var(--case-code-first-lo)",
    deep: "var(--case-code-first-deep)",
    size: 150,
    top: "0%",
    left: "12%",
  },
  {
    label: (
      <>
        Drift to
        <br />
        Foundation
      </>
    ),
    kicker: "Complex SaaS · 2024–26",
    title: "From Drift to Foundation",
    ingredients: ["First design system, from zero", "Tokens wired to production", "5+ booking verticals"],
    href: "/case-studies/design-system-transformation",
    hi: "var(--case-drift-hi)",
    lo: "var(--case-drift-lo)",
    glow: "var(--case-drift-lo)",
    deep: "var(--case-drift-deep)",
    size: 154,
    top: "2%",
    left: "58%",
  },
  {
    label: "Guardian",
    kicker: "AI UX · 2026",
    title: "Guardian",
    ingredients: ["Drift detection at decision-time", "Contextual guidance", "Human-in-control governance"],
    href: "/case-studies/guardian",
    hi: "var(--case-guardian-hi)",
    lo: "var(--case-guardian-lo)",
    glow: "var(--case-guardian-lo)",
    deep: "var(--case-guardian-deep)",
    size: 140,
    top: "42%",
    left: "-3%",
  },
  {
    label: (
      <>
        Operational
        <br />
        Clarity
      </>
    ),
    kicker: "Data Dashboard · 2025",
    title: "Operational Clarity",
    ingredients: ["6+ operational domains, one interface", "Role-based analytics", "8-week contract"],
    href: "/case-studies/un-operational-dashboard",
    hi: "var(--case-clarity-hi)",
    lo: "var(--case-clarity-lo)",
    glow: "var(--case-clarity-lo)",
    deep: "var(--case-clarity-deep)",
    size: 142,
    top: "76%",
    left: "16%",
  },
  {
    label: "Design Lab",
    kicker: "Personal OS · 2026",
    title: "Design Lab",
    ingredients: ["CHIP: my own operating system", "AI-assisted workflows", "Building in public"],
    href: "/#design-lab",
    hi: "var(--case-design-lab-hi)",
    lo: "var(--case-design-lab-lo)",
    glow: "var(--case-design-lab-lo)",
    deep: "var(--case-design-lab-deep)",
    size: 132,
    top: "66%",
    left: "72%",
  },
  {
    label: "Writing",
    kicker: "Notes · 2026",
    title: "Writing",
    ingredients: ["Design systems in practice", "Learning in public", "Talks and workshops"],
    href: "/#learning",
    hi: "var(--case-writing-hi)",
    lo: "var(--case-writing-lo)",
    glow: "var(--case-writing-lo)",
    deep: "var(--case-writing-deep)",
    size: 126,
    top: "20%",
    left: "84%",
  },
];

const HUB: Bubble = {
  label: "Design Systems",
  kicker: "Point of view",
  title: "How I think about design systems",
  ingredients: [
    "Systems are agreements, not component libraries.",
    "Governance is what stops the drift.",
    "I read code, so design and engineering stay honest.",
  ],
  href: "/point-of-view",
  cta: "Read my full take",
  hi: "var(--hub-hi)",
  lo: "var(--hub-lo)",
  glow: "var(--hub-bright)",
  deep: "var(--hub-deep)",
  size: 196,
  top: "34%",
  left: "33%",
};

/* index 6 = hub; hub connects to all, plus cross-links for the hive */
const BUBBLES = [...CASES, HUB];
const HUB_I = 6;
const CONNS: [number, number][] = [
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [0, 1], [0, 2], [1, 5], [2, 3], [3, 4], [4, 5],
];

/**
 * Bubble-cluster hero (from _proto/_hero.html). Six glossy case bubbles
 * around the "Design Systems / my take" hub. Every bubble is a real
 * <button> (aria-expanded) that opens the reveal card — a light card with
 * a breathing glow in the case colour, popover on desktop, bottom sheet
 * on mobile — whose CTA links to the case route (hub → point of view).
 * Connectors light iris for the selection. SVG + particle pop are
 * aria-hidden; reduced motion drops pop/transforms and freezes the glow.
 */
export default function Hero({ onEnterDashboard }: { onEnterDashboard?: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const drawLinks = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || window.innerWidth < 860) return;
    const sr = stage.getBoundingClientRect();
    const centers = bubRefs.current.map((b) => {
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
    });
    setLines(
      CONNS.map(([a, b]) => {
        const ca = centers[a];
        const cb = centers[b];
        return ca && cb
          ? { x1: ca.x, y1: ca.y, x2: cb.x, y2: cb.y }
          : { x1: 0, y1: 0, x2: 0, y2: 0 };
      })
    );
  }, []);

  const placePanel = useCallback((i: number) => {
    const el = bubRefs.current[i];
    const panel = panelRef.current;
    if (!el || !panel || window.innerWidth < 860) return;
    const r = el.getBoundingClientRect();
    const pw = 360;
    const ph = panel.offsetHeight || 280;
    const gap = 16;
    // left-side bubbles: card to the RIGHT (clear of the hero text); else left
    let left = r.left + r.width / 2 < window.innerWidth * 0.62 ? r.right + gap : r.left - pw - gap;
    if (left + pw > window.innerWidth - 16) left = r.left - pw - gap;
    if (left < 16) left = Math.min(r.right + gap, window.innerWidth - pw - 16);
    let top = r.top + r.height / 2 - ph / 2;
    top = Math.max(16, Math.min(top, window.innerHeight - ph - 16));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }, []);

  /** aria-hidden particle pop, skipped under prefers-reduced-motion */
  const pop = useCallback((i: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = bubRefs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const cols = [BUBBLES[i].glow, "var(--color-brand-amber)", "var(--color-card)"];
    for (let k = 0; k < 14; k++) {
      const p = document.createElement("span");
      p.className = styles.particle;
      p.setAttribute("aria-hidden", "true");
      const s = 6 + Math.random() * 14;
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.width = `${s}px`;
      p.style.height = `${s}px`;
      p.style.background = cols[k % 3];
      p.style.setProperty("--dx", `${Math.random() * 140 - 70}px`);
      p.style.setProperty("--rise", `${100 + Math.random() * 160}px`);
      p.style.animationDelay = `${Math.random() * 0.12}s`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1250);
    }
  }, []);

  const select = useCallback(
    (i: number) => {
      setSelected(i);
      pop(i);
      requestAnimationFrame(() => {
        placePanel(i);
        requestAnimationFrame(() => placePanel(i));
      });
    },
    [placePanel, pop]
  );

  const close = useCallback((refocus = false) => {
    setSelected((prev) => {
      if (refocus && prev !== null) bubRefs.current[prev]?.focus();
      return null;
    });
  }, []);

  useEffect(() => {
    drawLinks();
    document.fonts?.ready.then(drawLinks);
    const t = setTimeout(drawLinks, 300);
    const onResize = () => {
      drawLinks();
      setSelected((s) => {
        if (s !== null) placePanel(s);
        return s;
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [drawLinks, placePanel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const active = selected !== null ? BUBBLES[selected] : null;

  const bubbleStyle = (b: Bubble, i: number): React.CSSProperties => ({
    width: b.size,
    height: b.size,
    top: b.top,
    left: b.left,
    ["--bub-hi" as string]: b.hi,
    ["--bub-lo" as string]: b.lo,
    zIndex: i === HUB_I ? 3 : 2,
  });

  return (
    <section className="hero-landing" style={{ display: "flex", alignItems: "center", flex: 1, minHeight: 0 }}>
      <div className={styles.hero}>
        {/* ── Headline ── */}
        <div>
          <p className={styles.kicker}>Elleta McDaniel — Barcelona</p>
          <h1 className={styles.headline}>
            Pick a<br />
            <span className={styles.o}>piece.</span>
          </h1>
          <p className={styles.intro}>
            I design <b>AI-augmented design systems</b> — tokens, components, and the governance
            that keeps them from drifting. I read code and work with engineers directly.
          </p>

          {/* CTA kept from the previous hero — the path into the dashboard */}
          <div className={styles.ctaRow}>
            <button
              onClick={() => onEnterDashboard?.()}
              className="surface-dark"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-sm)",
                fontWeight: "var(--typography-font-weight-medium)",
                borderRadius: "var(--radius-full)",
                padding: "14px var(--spacing-8)",
                border: "none",
                cursor: "pointer",
                minHeight: "var(--spacing-touch-target)",
              }}
            >
              Come see what I&apos;ve been building
              <span style={{ fontSize: "var(--typography-font-size-base)", lineHeight: 1 }} aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>

        {/* ── Bubble cluster ── */}
        <div className={styles.stage} ref={stageRef}>
          <svg className={styles.links} ref={svgRef} aria-hidden="true">
            {lines.map((l, i) => (
              <line
                key={i}
                {...l}
                className={
                  selected !== null && (CONNS[i][0] === selected || CONNS[i][1] === selected)
                    ? styles.on
                    : undefined
                }
              />
            ))}
          </svg>

          <button
            ref={(el) => {
              bubRefs.current[HUB_I] = el;
            }}
            type="button"
            className={`${styles.bub} ${styles.hub} ${selected === HUB_I ? styles.sel : ""}`}
            style={bubbleStyle(HUB, HUB_I)}
            aria-expanded={selected === HUB_I}
            onClick={() => select(HUB_I)}
          >
            Design Systems
            <span className={styles.sub}>My take</span>
          </button>

          {CASES.map((b, i) => (
            <button
              key={b.title}
              ref={(el) => {
                bubRefs.current[i] = el;
              }}
              type="button"
              className={`${styles.bub} ${selected === i ? styles.sel : ""}`}
              style={bubbleStyle(b, i)}
              aria-expanded={selected === i}
              onClick={() => select(i)}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reveal card ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label={active ? active.title : "Case preview"}
        className={`${styles.panel} ${active ? styles.show : ""}`}
        style={
          active
            ? ({ "--cc": active.glow, "--ct": active.deep } as React.CSSProperties)
            : undefined
        }
        inert={!active}
      >
        {active && (
          <>
            <button className={styles.pclose} aria-label="Close" onClick={() => close(true)}>
              ✕
            </button>
            <p className={styles.pk}>{active.kicker}</p>
            <p className={styles.pt}>{active.title}</p>
            <p className={styles.pi}>
              {active.ingredients.map((x) => (
                <span key={x}>◦ {x}</span>
              ))}
            </p>
            <Link className={styles.pr} href={active.href} onClick={() => close()}>
              {active.cta ?? "Read case"} <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
