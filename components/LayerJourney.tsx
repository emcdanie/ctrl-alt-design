"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SpecimenCardBody } from "@/components/CaseSpecimen";

/**
 * Beat 02: the layered journey (binding contract _proto/beat2.html).
 * Seven layers, the rail REVERSED (Production top, Figma bottom),
 * the active layer on the dark plate with the offset shadow, the
 * Delivers-up / Receives-down framing, a Layer N of 7 counter, and
 * the shared case-card specimen travelling with what each layer does
 * to it. Previous/Next ride the real BELLA secondary Button; square
 * step dots; every step hash-linkable (#journey-<slug>); keyboard
 * navigable. In-panel titles are GEIST (Unique never inside a card);
 * the beat head on the ground stays Unique. Opens on THE GATE.
 * Reduced motion renders the whole journey as a static annotated
 * sequence. The gate layer's drift value is a data-quote, never
 * painted.
 */

const L = [
  {
    slug: "figma",
    n: "Figma",
    d: "the component library, what you design",
    up: "the design",
    title: "FIGMA",
    sub: "The card as drawn",
    flag: true,
    detail: [
      { t: "component  Card", tone: "mut" },
      { t: "prop  brand: periwinkle", tone: "mut" },
      { t: "description: (empty)", tone: "err" },
    ],
  },
  {
    slug: "readable",
    n: "Readable layer",
    d: "descriptions + tokens with meaning",
    up: "names with meaning",
    title: "READABLE LAYER",
    sub: "The gap gets a name",
    detail: [
      { t: "description written in", tone: "ok" },
      { t: "prop brand → variant", tone: "ok" },
      { t: "radius → --radius-lg", tone: "ok" },
    ],
  },
  {
    slug: "bridge",
    n: "The Bridge",
    d: "Code Connect · MCP",
    up: "a wired pair",
    title: "THE BRIDGE",
    sub: "Figma ⇄ code, values stream across",
    detail: [
      { t: "Figma frame ⇄ code snippet", tone: "mut" },
      { t: "asked in minutes", tone: "mut" },
      { t: "verified by hand", tone: "ok" },
    ],
  },
  {
    slug: "code",
    n: "Storybook / Code",
    d: "the source of truth",
    up: "the shipped component",
    title: "STORYBOOK / CODE",
    sub: "The card as shipped",
    detail: [
      { t: '<Card variant="action" size="lg" />', tone: "ok" },
      { t: "resolves from tokens", tone: "mut" },
    ],
  },
  {
    slug: "agents",
    n: "Agents",
    d: "build with it",
    up: "new work, on-system",
    title: "AGENTS",
    sub: "Built only from what the system exposes",
    detail: [
      { t: "agent composes the card", tone: "mut" },
      { t: "can only use exposed tokens", tone: "mut" },
      { t: "nothing off-palette", tone: "ok" },
    ],
  },
  {
    slug: "gate",
    n: "The Gate",
    d: "audit + evals, nothing ships without review",
    up: "only what passes",
    title: "THE GATE",
    sub: "Audit and evals; nothing ships without review",
    gate: true,
    detail: [
      { t: "auditing tokens…", tone: "mut" },
      { t: "✗ border: #c7c7c7, hardcoded", tone: "err" }, // token-waiver: the depicted drift value, quoted as data
      { t: "→ fixed at source: --color-border-soft", tone: "mut" },
      { t: "✓ now passes", tone: "ok" },
    ],
    note: "Second review… now it passes.",
  },
  {
    slug: "production",
    n: "Production",
    d: "published, and watched",
    up: "the finished product",
    title: "PRODUCTION",
    sub: "Published, no new debt",
    detail: [
      { t: "✓ shipped", tone: "ok" },
      { t: "only what the system approved", tone: "mut" },
    ],
  },
] as const;

function Detail({ lines, animate }: { lines: readonly { t: string; tone: string }[]; animate: boolean }) {
  return (
    <div className="jn-detail">
      {lines.map((l, i) => (
        <span
          key={l.t}
          className={`jn-detail__line jn-detail__line--${l.tone}${animate ? " jn-reveal" : ""}`}
          style={animate ? { transitionDelay: `${0.2 + i * 0.35}s` } : undefined}
        >
          {l.t}
        </span>
      ))}
    </div>
  );
}

function Panel({ i, animate }: { i: number; animate: boolean }) {
  const l = L[i];
  const [go, setGo] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    setGo(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)));
    return () => cancelAnimationFrame(raf);
  }, [i, animate]);

  return (
    <div className={`jn-panel${go ? " go" : ""}`}>
      <p className="jn-kickerband">
        <span className="jn-kickerband__tag">Delivers ↑</span> {l.up}
      </p>
      <p className="jn-where">Layer {i + 1} of 7 · the card is here</p>
      <p className="jn-paneltitle">{l.title}</p>
      <p className="jn-sub">{l.sub}</p>
      <div className="jn-stagebox">
        <div className={`jn-mini${"flag" in l && l.flag ? " jn-mini--flagged" : ""}`}>
          <SpecimenCardBody />
        </div>
        <div>
          <Detail lines={l.detail} animate={animate} />
          {"note" in l && l.note && <p className="jn-note">{l.note}</p>}
        </div>
      </div>
      <p className="jn-kickerband jn-recv">
        <span className="jn-kickerband__tag">Receives ↓</span>{" "}
        {i === 0 ? "nothing, this is the origin" : "everything built below, by human or agent"}
      </p>
    </div>
  );
}

export default function LayerJourney() {
  /* opens on THE GATE, the money shot (proto) */
  const [step, setStep] = useState(5);
  const [reduced, setReduced] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const m = window.location.hash.match(/^#journey-([a-z]+)/);
    if (m) {
      const i = L.findIndex((x) => x.slug === m[1]);
      if (i >= 0) setStep(i);
    }
  }, []);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(L.length - 1, i));
    setStep(next);
    window.history.replaceState(null, "", `#journey-${L[next].slug}`);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    /* the rail is reversed: ArrowUp climbs toward Production */
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      go(step + 1);
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(step - 1);
    }
  };

  if (reduced) {
    /* the whole journey as a static annotated sequence */
    return (
      <div className="jn jn--static">
        {L.map((l, i) => (
          <div key={l.slug} className="jn-staticrow" id={`journey-${l.slug}`}>
            <div>
              <p className="ds-section__kicker" style={{ margin: 0 }}>
                Layer {i + 1} of 7 · {l.n}
              </p>
              <p className="ds-section__note" style={{ margin: 0 }}>{l.sub}</p>
            </div>
            <Panel i={i} animate={false} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="jn">
      {/* the rail, REVERSED: Production top, Figma bottom */}
      <div className="jn-rail" ref={railRef} onKeyDown={onKey}>
        {[...L].reverse().map((l) => {
          const i = L.indexOf(l);
          return (
            <button
              key={l.slug}
              type="button"
              className="jn-layer"
              aria-current={i === step ? "true" : undefined}
              onClick={() => go(i)}
            >
              <span className="jn-layer__n">{l.n}</span>
              <span className="jn-layer__d">{l.d}</span>
            </button>
          );
        })}
      </div>
      <div className="jn-right" id={`journey-${L[step].slug}`}>
        <Panel i={step} animate />
        <div className="jn-nav">
          <Button variant="secondary" onClick={() => go(step - 1)} ariaLabel="Previous layer">
            ‹ Previous
          </Button>
          <span className="jn-dots" aria-hidden="true">
            {L.map((l, i) => (
              <i key={l.slug} className={`jn-dot${i === step ? " on" : ""}`} />
            ))}
          </span>
          <Button variant="secondary" onClick={() => go(step + 1)} ariaLabel="Next layer">
            Next ›
          </Button>
        </div>
      </div>
    </div>
  );
}
