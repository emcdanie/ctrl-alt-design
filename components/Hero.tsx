"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./Hero.module.css";

interface AtomNode {
  title: string;
  kicker: string;
  blurb: string;
  seen: { label: string; href: string }[];
  /** orbital position, % of the atom square (nucleus is 50/50) */
  x?: number;
  y?: number;
}

/* Nucleus is radio 0; the 8 skill nodes orbit on two rings.
 * Blurbs and mapping from _proto/_atom.html; "Seen in:" points at the
 * real case studies (or the section where that work lives). */
const CORE: AtomNode = {
  title: "Design Systems",
  kicker: "Core",
  blurb:
    "I build design systems, and the tools that keep them from drifting. Choose an area to see the work behind it.",
  seen: [],
};

const NODES: AtomNode[] = [
  {
    title: "Design Tokens",
    x: 50,
    y: 24,
    kicker: "Foundation",
    blurb: "Primitive to semantic to component. The layer that keeps a system honest.",
    seen: [
      { label: "From Drift to Foundation", href: "/case-studies/design-system-transformation" },
      { label: "Mango", href: "#experience" },
    ],
  },
  {
    title: "AI Workflows",
    x: 79,
    y: 21,
    kicker: "Frontier",
    blurb: "Agents that read and audit a system. Machine-readable design, human in control.",
    seen: [
      { label: "CHIP", href: "#design-lab" },
      { label: "Guardian", href: "/case-studies/guardian" },
    ],
  },
  {
    title: "Governance",
    x: 76,
    y: 50,
    kicker: "Foundation",
    blurb: "The rules that stop a system drifting. Contribution models, versioning, extend vs build.",
    seen: [
      { label: "From Drift to Foundation", href: "/case-studies/design-system-transformation" },
      { label: "Code First", href: "/case-studies/brad-frost" },
    ],
  },
  {
    title: "Figma ⇄ Code",
    x: 79,
    y: 79,
    kicker: "Frontier",
    blurb: "Design and code kept in parity, wired through Figma MCP and the Desktop Bridge.",
    seen: [
      { label: "Code First", href: "/case-studies/brad-frost" },
      { label: "Mango", href: "#experience" },
    ],
  },
  {
    title: "Component Libraries",
    x: 50,
    y: 76,
    kicker: "Foundation",
    blurb: "Reusable parts, documented and owned, so teams stop rebuilding the same button.",
    seen: [
      { label: "Code First", href: "/case-studies/brad-frost" },
      { label: "From Drift to Foundation", href: "/case-studies/design-system-transformation" },
    ],
  },
  {
    title: "Accessibility",
    x: 21,
    y: 79,
    kicker: "Frontier",
    blurb: "WCAG as a system default, not a per-screen fix. Contrast, focus, target size.",
    seen: [
      { label: "Operational Clarity", href: "/case-studies/un-operational-dashboard" },
      { label: "Mango", href: "#experience" },
    ],
  },
  {
    title: "Atomic Design",
    x: 24,
    y: 50,
    kicker: "Foundation",
    blurb: "Atoms to templates. The model I build systems on, learned in the open from Brad Frost.",
    seen: [{ label: "Code First", href: "/case-studies/brad-frost" }],
  },
  {
    title: "Learning in Public",
    x: 21,
    y: 21,
    kicker: "Frontier",
    blurb: "Most of what I know I picked up in the open. Then I route it back into the system.",
    seen: [{ label: "CHIP", href: "#design-lab" }],
  },
];

const RADIOS: AtomNode[] = [CORE, ...NODES];

/**
 * Atom-map hero (from _proto/_atom.html). A radiogroup: the nucleus plus
 * 8 orbiting skill nodes with roving tabindex, arrow-key/Home/End
 * navigation, and an aria-live detail panel — no hover-only tooltips.
 * The float animation only runs under prefers-reduced-motion:
 * no-preference (CSS), and below 560px the orbit becomes a wrapped list.
 */
export default function Hero({ onEnterDashboard }: { onEnterDashboard?: () => void }) {
  const [selected, setSelected] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = useCallback((i: number, focus = true) => {
    setSelected(i);
    if (focus) refs.current[i]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      let next: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (selected + 1) % RADIOS.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        next = (selected - 1 + RADIOS.length) % RADIOS.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = RADIOS.length - 1;
      if (next !== null) {
        e.preventDefault();
        select(next);
      }
    },
    [selected, select]
  );

  const active = RADIOS[selected];
  const activeNode = selected > 0 ? NODES[selected - 1] : null;

  return (
    <section
      className="hero-landing"
      style={{ display: "flex", alignItems: "center", flex: 1, minHeight: 0 }}
    >
      <div className={styles.hero}>
        {/* ── Text + detail panel ── */}
        <div>
          <p className="eyebrow" style={{ marginBottom: "var(--spacing-4)" }}>
            Design Systems · AI · Barcelona
          </p>
          <h1 className={styles.name}>Elleta McDaniel</h1>
          <p className={styles.sub}>
            I build design systems, and the tools that keep them from drifting.
          </p>

          <p className="sr-only" id="atom-hint">
            Areas of work. Select one with the arrow keys or by clicking to see the work behind it.
          </p>

          <div className={styles.panel} aria-live="polite">
            <p className={styles.panelKicker}>{active.kicker}</p>
            <h2 className={styles.panelTitle}>{active.title}</h2>
            <p className={styles.panelBody}>{active.blurb}</p>
            {active.seen.length > 0 && (
              <div className={styles.seen}>
                <span>Seen in:</span>
                {active.seen.map((s) => (
                  <a key={s.label} href={s.href}>
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* CTA row — kept from the previous hero (path into the dashboard) */}
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

        {/* ── Atom map ── */}
        <div className={styles.atom}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className={styles.ring} cx="50" cy="50" r="26" />
            <circle className={styles.ring} cx="50" cy="50" r="40" />
            {activeNode && (
              <line
                className={styles.connector}
                x1="50"
                y1="50"
                x2={activeNode.x}
                y2={activeNode.y}
              />
            )}
          </svg>

          <div
            role="radiogroup"
            aria-labelledby="atom-hint"
            className={styles.nodeGroup}
            onKeyDown={onKeyDown}
          >
            <button
              ref={(el) => {
                refs.current[0] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected === 0}
              aria-current={selected === 0 ? "true" : undefined}
              tabIndex={selected === 0 ? 0 : -1}
              className={styles.nucleus}
              onClick={() => select(0)}
            >
              Design
              <br />
              Systems
            </button>

            {NODES.map((n, i) => (
              <button
                key={n.title}
                ref={(el) => {
                  refs.current[i + 1] = el;
                }}
                type="button"
                role="radio"
                aria-checked={selected === i + 1}
                aria-current={selected === i + 1 ? "true" : undefined}
                tabIndex={selected === i + 1 ? 0 : -1}
                className={`${styles.node} ${styles.float}`}
                style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${i * 0.4}s` }}
                onClick={() => select(i + 1)}
              >
                {n.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
