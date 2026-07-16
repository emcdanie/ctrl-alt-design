"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WORK_ITEMS, HUB_ITEM } from "@/lib/workLibrary";
import styles from "./BubbleCluster.module.css";

/* Cluster geometry + label sizes, from _proto/_hero.html — proto-exact
 * recorded data (label px are recorded §5 exceptions, see DESIGN.md) */
const GEOMETRY: Record<string, { size: number; top: string; left: string; fontSize: number }> = {
  "code-first": { size: 150, top: "0%", left: "12%", fontSize: 19 },
  drift: { size: 154, top: "2%", left: "58%", fontSize: 19 },
  guardian: { size: 140, top: "42%", left: "-3%", fontSize: 19 },
  clarity: { size: 142, top: "76%", left: "16%", fontSize: 18 },
  "design-lab": { size: 132, top: "66%", left: "72%", fontSize: 18 },
  writing: { size: 126, top: "20%", left: "84%", fontSize: 18 },
  hub: { size: 196, top: "34%", left: "33%", fontSize: 22 },
};

const BUBBLES = [...WORK_ITEMS, HUB_ITEM];
const HUB_I = WORK_ITEMS.length;
/* hub connects to all, plus cross-links for the hive */
const CONNS: [number, number][] = [
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [0, 1], [0, 2], [1, 5], [2, 3], [3, 4], [4, 5],
];

function BubbleLabel({ label }: { label: string }) {
  const parts = label.split("|");
  return (
    <>
      {parts.map((p, i) => (
        <span key={p} style={{ display: "contents" }}>
          {i > 0 && <br />}
          {p}
        </span>
      ))}
    </>
  );
}

/**
 * The glossy bubble cluster (from _proto/_hero.html): six case bubbles
 * around the "Design Systems / my take" hub, iris connectors for the
 * selection, and the reveal card — a light card with a breathing glow in
 * the case colour; popover on desktop, bottom sheet on mobile. Every
 * bubble is a real <button> (aria-expanded, visible focus, 44px+); SVG
 * and particle pop are aria-hidden; reduced motion drops pop/transforms
 * and freezes the glow. Used by the hero and the /work Map view.
 */
export default function BubbleCluster({
  highlightIds = null,
}: {
  /** when set (library Map view filters), bubbles not listed render dimmed */
  highlightIds?: string[] | null;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
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
    const glow = i === HUB_I ? "var(--hub-bright)" : BUBBLES[i].lo;
    const cols = [glow, "var(--color-brand-amber)", "var(--color-card)"];
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
  const activeGlow = selected === HUB_I ? "var(--hub-bright)" : active?.lo;

  const bubbleStyle = (i: number): React.CSSProperties => {
    const b = BUBBLES[i];
    const g = GEOMETRY[b.id];
    return {
      width: g.size,
      height: g.size,
      top: g.top,
      left: g.left,
      fontSize: g.fontSize,
      ["--bub-hi" as string]: b.hi,
      ["--bub-lo" as string]: b.lo,
      zIndex: i === HUB_I ? 3 : 2,
    };
  };

  return (
    <>
      <div className={styles.stage} ref={stageRef}>
        <svg className={styles.links} aria-hidden="true">
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
          style={bubbleStyle(HUB_I)}
          aria-expanded={selected === HUB_I}
          onClick={() => select(HUB_I)}
        >
          Design Systems
          <span className={styles.sub}>My take</span>
        </button>

        {WORK_ITEMS.map((b, i) => (
          <button
            key={b.id}
            ref={(el) => {
              bubRefs.current[i] = el;
            }}
            type="button"
            className={`${styles.bub} ${selected === i ? styles.sel : ""} ${
              highlightIds && !highlightIds.includes(b.id) ? styles.dim : ""
            }`}
            style={bubbleStyle(i)}
            aria-expanded={selected === i}
            onClick={() => select(i)}
          >
            <BubbleLabel label={b.bubbleLabel} />
          </button>
        ))}
      </div>

      {/* ── Reveal card ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label={active ? active.title : "Case preview"}
        className={`${styles.panel} ${active ? styles.show : ""}`}
        style={
          active
            ? ({ "--cc": activeGlow, "--ct": active.deep } as React.CSSProperties)
            : undefined
        }
        inert={!active}
      >
        {active && (
          <div className={styles.pin}>
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
          </div>
        )}
      </div>
    </>
  );
}
