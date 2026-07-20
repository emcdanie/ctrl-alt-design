"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WORK_ITEMS, HUB_ITEM } from "@/lib/workLibrary";
import styles from "./BubbleCluster.module.css";

/* Cluster geometry + label sizes — the proto percentages resolved to px
 * in a fixed 620x640 DESIGN SPACE (proto stage width 568, shifted so the
 * leftmost bubble sits at x=0). The whole space scales uniformly to the
 * measured stage width, so no bubble is ever cut at any viewport (§8
 * containment). Label px are recorded §5 exceptions, see DESIGN.md. */
const DESIGN_W = 620;
const DESIGN_H = 640;
const GEOMETRY: Record<string, { size: number; top: number; left: number; fontSize: number }> = {
  "code-first": { size: 150, top: 0, left: 85, fontSize: 19 },
  drift: { size: 154, top: 13, left: 346, fontSize: 19 },
  guardian: { size: 124, top: 269, left: 0, fontSize: 18 },
  clarity: { size: 142, top: 486, left: 108, fontSize: 18 },
  "design-lab": { size: 156, top: 410, left: 415, fontSize: 19 },
  chip: { size: 126, top: 128, left: 494, fontSize: 18 },
  hub: { size: 196, top: 218, left: 205, fontSize: 22 },
};

/* The cluster renders only inCluster rows (Elleta, 20 Jul): six
 * bubbles + hub. GEOMETRY is keyed by id; a row flagged out of the
 * cluster never reaches it. */
const CLUSTER_ITEMS = WORK_ITEMS.filter((i) => i.inCluster !== false);
const BUBBLES = [...CLUSTER_ITEMS, HUB_ITEM];
const HUB_I = CLUSTER_ITEMS.length;
/* hub connects to all, plus cross-links for the hive */
const CONNS: [number, number][] = [
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [0, 1], [0, 2], [1, 5], [2, 3], [3, 4], [4, 5],
];

/* connector endpoints are bubble centres in design space — deterministic,
 * no DOM measurement, and they scale with the space */
const LINES = CONNS.map(([a, b]) => {
  const ga = GEOMETRY[BUBBLES[a].id];
  const gb = GEOMETRY[BUBBLES[b].id];
  return {
    x1: ga.left + ga.size / 2,
    y1: ga.top + ga.size / 2,
    x2: gb.left + gb.size / 2,
    y2: gb.top + gb.size / 2,
  };
});

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
  onOpenChange,
}: {
  /** when set (library Map view filters), bubbles not listed render dimmed */
  highlightIds?: string[] | null;
  /** peek open/close (the open peek owns the view's primary action) */
  onOpenChange?: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bubRefs = useRef<(HTMLButtonElement | null)[]>([]);
  /* §8 containment: uniform scale = stage width / design width, never >1 */
  const [scale, setScale] = useState(1);

  const placePanel = useCallback((i: number) => {
    const el = bubRefs.current[i];
    const panel = panelRef.current;
    if (!el || !panel || window.innerWidth < 860) return;
    const r = el.getBoundingClientRect();
    const pw = 360;
    const ph = panel.offsetHeight || 280;
    const gap = 16;
    const margin = 16;
    const navSafe = 88; // clear the fixed header so the card never hides behind it
    // Consistent direction: the card ALWAYS opens to the right of the bubble.
    // For bubbles near the right edge, clamp to the viewport instead of
    // flipping sides, so every card reads the same way.
    let left = r.right + gap;
    const maxLeft = window.innerWidth - pw - margin;
    if (left > maxLeft) left = maxLeft;
    if (left < margin) left = margin;
    let top = r.top + r.height / 2 - ph / 2;
    top = Math.max(navSafe, Math.min(top, window.innerHeight - ph - margin));
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
    const cols = [glow, "var(--peri)", "var(--color-card)"];
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
      onOpenChange?.(true);
      pop(i);
      requestAnimationFrame(() => {
        placePanel(i);
        requestAnimationFrame(() => {
          placePanel(i);
          panelRef.current?.focus();
        });
      });
    },
    [placePanel, pop, onOpenChange]
  );

  const close = useCallback((refocus = false) => {
    setSelected((prev) => {
      if (refocus && prev !== null) bubRefs.current[prev]?.focus();
      return null;
    });
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / DESIGN_W));
    });
    ro.observe(stage);
    const onResize = () => {
      setSelected((s) => {
        if (s !== null) placePanel(s);
        return s;
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [placePanel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (panelRef.current?.contains(t)) return;
      if (t.closest("[data-bubble]")) return;
      // Route through close(): it updates local state and fires onOpenChange
      // OUTSIDE the state updater, so the parent (Hero) is never updated while
      // BubbleCluster is rendering — kills the setState-in-render warning.
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
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
      <div
        className={styles.stage}
        ref={stageRef}
        style={{ ["--cluster-scale" as string]: scale }}
      >
        <div className={styles.space}>
          <svg className={styles.links} viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`} aria-hidden="true">
            {LINES.map((l, i) => {
              const on =
                selected !== null && (CONNS[i][0] === selected || CONNS[i][1] === selected);
              /* a connector dims with its endpoints: full-strength
                 hairlines through 35%-opacity discs read as lines ON
                 TOP of the bubbles (docs/fixes/map-connector-dim.md) */
              const dimmed =
                highlightIds &&
                (!highlightIds.includes(BUBBLES[CONNS[i][0]].id) ||
                  !highlightIds.includes(BUBBLES[CONNS[i][1]].id));
              return (
                <line
                  key={i}
                  {...l}
                  className={
                    [on ? styles.on : "", dimmed ? styles.dimLine : ""].filter(Boolean).join(" ") ||
                    undefined
                  }
                />
              );
            })}
          </svg>

        <button
          ref={(el) => {
            bubRefs.current[HUB_I] = el;
          }}
          type="button"
          data-bubble
          className={`${styles.bub} ${styles.hub} ${selected === HUB_I ? styles.sel : ""}`}
          style={bubbleStyle(HUB_I)}
          aria-expanded={selected === HUB_I}
          onClick={() => select(HUB_I)}
        >
          Design Systems
          <span className={styles.sub}>My take</span>
        </button>

        {CLUSTER_ITEMS.map((b, i) => (
          <button
            key={b.id}
            ref={(el) => {
              bubRefs.current[i] = el;
            }}
            type="button"
            data-bubble
            className={`${styles.bub} ${selected === i ? styles.sel : ""} ${
              highlightIds && !highlightIds.includes(b.id) ? styles.dim : ""
            }`}
            style={bubbleStyle(i)}
            aria-expanded={selected === i}
            onClick={() => select(i)}
          >
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <BubbleLabel label={b.bubbleLabel} />
              {b.featured && <span className={styles.sub}>Current focus</span>}
            </span>
          </button>
        ))}
        </div>
      </div>

      {/* ── Reveal card ── */}
      <div
        ref={panelRef}
        tabIndex={-1}
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
              {active.cta ?? "Read case"} <Icon name="ArrowRight" size="sm" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
