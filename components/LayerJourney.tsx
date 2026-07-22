"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Beat 02 (PR 41 amendment 3, item 2): the journey of a component
 * through the layers, Elleta's layered-stepper pattern generalized to
 * BELLA in English. The layer stack runs down the left (keyboard and
 * click navigation, Previous/Next, step dots); the stage on the right
 * shows the Tile at that layer with what the layer DOES to it,
 * animated with CSS transitions only. The component travels and the
 * system acts on it visibly. The step is shareable: each layer keeps
 * a location hash. Reduced motion renders all six layers as a static
 * annotated sequence.
 *
 * The Readable layer's events are the former parity-inspector
 * findings (description written in, brand renamed variant, radius
 * bound to the token); the Gate layer's near-miss gray is honest
 * theatre: a near-miss gray hand-set against the register token
 * (values quoted in the gateLines data below, waived there), the
 * class of drift the eye cannot see.
 */

export const LAYERS = [
  {
    slug: "figma",
    name: "Figma",
    line: "Designed",
    caption: "The Tile as drawn: props visible, description empty. The gap is already here, just invisible.",
  },
  {
    slug: "readable",
    name: "Readable layer",
    line: "Descriptions and tokens with meaning",
    caption: "The description writes itself in, the prop takes the code's name, the radius binds to its token.",
  },
  {
    slug: "bridge",
    name: "The Bridge",
    line: "Code Connect / MCP",
    caption: "The Figma frame and the code answer each other: asked in minutes, verified by hand.",
  },
  {
    slug: "code",
    name: "Code + Storybook",
    line: "Source of truth",
    caption: "The Tile renders as shipped; variant and size resolve from tokens.",
  },
  {
    slug: "gate",
    name: "The Gate",
    line: "Audits; nothing ships without review",
    caption: "The audit runs ON the component. Red first, corrected at source, green on the second review.",
  },
  {
    slug: "production",
    name: "Production",
    line: "No new debt",
    caption: "The Tile ships. Only what the system approves.",
  },
] as const;

/** the Tile at one layer; `state` drives what the layer has done */
function TileAt({ layer, animate }: { layer: number; animate: boolean }) {
  const [go, setGo] = useState(!animate);
  useEffect(() => {
    if (!animate) return;
    setGo(false);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)));
    return () => cancelAnimationFrame(raf);
  }, [layer, animate]);

  const readable = layer >= 1;
  const gateFixed = layer >= 5;

  /* the Gate layer's own sequence: red finding, correction, pass */
  const gateLines = [
    "auditing tokens on Tile",
    "TOKEN FAIL border #C7C7C7 hand-set; the token resolves #D7D8DC", // token-waiver: depicted drift line, data not paint
    "corrected at source: border bound to --demo-border",
    "second review: tokens PASS",
  ];

  return (
    <div className={`jn-scene${go ? " go" : ""}`}>
      {layer === 2 ? (
        /* the Bridge: frame and code connect, values streaming */
        <div className="jn-bridge">
          <div className="jn-bridge__panel">
            <p className="spec-split__head" style={{ margin: 0 }}>Figma frame</p>
            <ul className="spec-props">
              <li className="spec-props__row"><span>variant</span><span>primary</span></li>
              <li className="spec-props__row"><span>radius</span><span>--demo-radius</span></li>
            </ul>
          </div>
          <div className="jn-bridge__stream" aria-hidden="true">
            <span className="jn-chip">variant</span>
            <span className="jn-chip">--demo-radius</span>
            <span className="jn-chip">description</span>
          </div>
          <div className="jn-bridge__panel">
            <p className="spec-split__head" style={{ margin: 0 }}>Code answer</p>
            <pre className="jn-code">{`<Tile variant="primary"\n  size="md" />`}</pre>
          </div>
        </div>
      ) : (
        <div className="jn-tilewrap">
          <div className={`demo-tile${layer === 4 && !gateFixed ? " jn-tile--flagged" : ""}`} data-part="value">
            <p className="demo-tile__title">Tile</p>
            {readable ? (
              <p className="demo-tile__desc jn-reveal">A compact content tile. Variant and size resolve from tokens.</p>
            ) : (
              <p className="demo-tile__desc">
                <span className="ds-flag ds-flag--drift"><span className="ds-flag__token">description: (empty)</span></span>
              </p>
            )}
            <p className="demo-tile__meta jn-reveal">
              {readable ? 'variant="primary" size="md"' : "brand: periwinkle"}
            </p>
            <span style={{ display: "inline-flex" }}>
              <span className="demo-btn" aria-hidden="true">Action</span>
            </span>
          </div>
          {layer === 4 && (
            <div className="jn-gatelines" role="log" aria-label="The gate acting on the Tile">
              {gateLines.map((l, i) => (
                <span key={l} className={`gr-line jn-gateline${go ? " show" : ""}${i === 1 ? " gr-line--fail" : ""}`} style={{ transitionDelay: go ? `${0.5 + i * 0.9}s` : "0s" }}>
                  {l}
                </span>
              ))}
            </div>
          )}
          {layer === 5 && (
            <p className="jn-shipline jn-reveal">Shipped. Only what the system approves.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function LayerJourney() {
  const [step, setStep] = useState(0);
  const [reduced, setReduced] = useState(false);
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    /* shareable step: read the hash once (e.g. #journey-gate) */
    const m = window.location.hash.match(/^#journey-([a-z]+)/);
    if (m) {
      const i = LAYERS.findIndex((l) => l.slug === m[1]);
      if (i >= 0) setStep(i);
    }
  }, []);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(LAYERS.length - 1, i));
    setStep(next);
    /* keep the layer linkable without scrolling the page */
    window.history.replaceState(null, "", `#journey-${LAYERS[next].slug}`);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(step + 1);
      (railRef.current?.children[Math.min(step + 1, LAYERS.length - 1)]?.firstElementChild as HTMLElement)?.focus();
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(step - 1);
      (railRef.current?.children[Math.max(step - 1, 0)]?.firstElementChild as HTMLElement)?.focus();
    }
  };

  /* reduced motion: the whole journey as a static annotated sequence */
  if (reduced) {
    return (
      <div className="jn jn--static">
        {LAYERS.map((l, i) => (
          <div key={l.slug} className="jn-staticrow" id={`journey-${l.slug}`}>
            <div>
              <p className="ds-section__kicker" style={{ margin: 0 }}>{String(i + 1).padStart(2, "0")} · {l.name}</p>
              <p className="ds-section__note" style={{ margin: 0 }}>{l.caption}</p>
            </div>
            <TileAt layer={i} animate={false} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="jn">
      <div className="jn-rail">
        <ul ref={railRef} className="jn-rail__list" onKeyDown={onKey} aria-label="The layers">
          {LAYERS.map((l, i) => (
            <li key={l.slug}>
              <button
                type="button"
                className="jn-rail__item"
                aria-current={i === step ? "step" : undefined}
                onClick={() => go(i)}
              >
                <span className="jn-rail__name">{l.name}</span>
                <span className="jn-rail__line">{l.line}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="jn-nav">
          <Button variant="secondary" onClick={() => go(step - 1)} ariaLabel="Previous layer">
            Previous
          </Button>
          <span className="jn-dots" aria-hidden="true">
            {LAYERS.map((l, i) => (
              <span key={l.slug} className={`jn-dot${i === step ? " on" : ""}`} />
            ))}
          </span>
          <Button variant="secondary" onClick={() => go(step + 1)} ariaLabel="Next layer">
            Next
          </Button>
        </div>
      </div>
      <div className="jn-stage" id={`journey-${LAYERS[step].slug}`}>
        <TileAt layer={step} animate />
        <p className="ds-section__note jn-caption" aria-live="polite">{LAYERS[step].caption}</p>
      </div>
    </div>
  );
}
