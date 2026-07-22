"use client";

import { useEffect, useRef, useState } from "react";
import { Select } from "@/components/ui/Select";
import { StatusPill } from "@/components/ui/StatusPill";

/**
 * The interactive parity inspector (PR 41 amendment 2, item 4; CHIP
 * display dialect, item 7). Component picker, the Figma side vs the
 * code side flat on the ground, a Run inspection action (the demo
 * register's BLACK primary; the page's ONE btn-key primary stays the
 * contact keycap), the audit console typing findings one by one, each
 * finding click-highlighting the guilty prop on both sides, a shown
 * fix, and a re-run that goes green. Keyboard accessible (findings
 * are real buttons; focus highlights like hover); reduced motion
 * renders each run's end state instantly. Data is honest: the counts
 * are counts of the checks on screen, the drift classes are the real
 * engagement classes (decision 01 copy), the Figma values an
 * illustrative pair, and every row ends in a verb.
 */

const CHECKS = [
  {
    id: "description",
    drifted: true,
    finding: "description empty in Figma; code documents the prop",
    fixedLine: "description present on both sides",
    action: "Add description",
    zone: "description",
  },
  {
    id: "propname",
    drifted: true,
    finding: "prop name mismatch: brand in Figma, variant in code",
    fixedLine: "prop names aligned: variant on both sides",
    action: "Rename prop",
    zone: "propname",
  },
  {
    id: "radius",
    drifted: true,
    finding: "radius set by hand in Figma; code resolves 8px from the token",
    fixedLine: "radius bound to --demo-radius on both sides",
    action: "Bind token",
    zone: "value",
  },
  {
    id: "touch",
    drifted: false,
    finding: "touch target clears 44px on both sides",
    fixedLine: "touch target clears 44px on both sides",
    action: "Keep",
    zone: "button",
  },
  {
    id: "tokens",
    drifted: false,
    finding: "ink and surface resolve from tokens",
    fixedLine: "ink and surface resolve from tokens",
    action: "Keep",
    zone: "value",
  },
] as const;

const FIX_LINES = [
  "+ description written into the Figma component",
  "+ prop renamed: brand becomes variant",
  "+ radius bound to --demo-radius",
];

type Phase = "idle" | "run1" | "fixed" | "run2";

export default function ParityInspector({
  onZone,
}: {
  /** the stage's highlight setter (the one highlight recipe) */
  onZone: (zone: string | null) => void;
}) {
  const [component, setComponent] = useState("tile");
  const [phase, setPhase] = useState<Phase>("idle");
  const [visible, setVisible] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const reveal = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(CHECKS.length);
      return;
    }
    setVisible(0);
    CHECKS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setVisible(i + 1), 450 * (i + 1)));
    });
  };

  const run = () => {
    clearTimers();
    setSelected(null);
    onZone(null);
    setPhase(phase === "fixed" ? "run2" : "run1");
    reveal();
  };

  /* the fix is SHOWN once the first run's findings are all on screen */
  useEffect(() => {
    if (phase === "run1" && visible === CHECKS.length) {
      timers.current.push(setTimeout(() => setPhase("fixed"), 700));
    }
  }, [phase, visible]);

  const afterFix = phase === "run2";
  const running = phase !== "idle";
  const inSync = afterFix ? CHECKS.length : CHECKS.filter((c) => !c.drifted).length;
  const verdict = afterFix ? "In sync" : "Drift";
  const consequence = afterFix
    ? "Nothing behind the code. The pair ships."
    : "Three props behind the code until someone reconciles them.";

  const pick = (zone: string) => {
    const next = selected === zone ? null : zone;
    setSelected(next);
    onZone(next);
  };

  return (
    <div className="pin">
      <div className="pin-controls">
        <Select
          label="Component"
          value={component}
          onChange={setComponent}
          options={[{ value: "tile", label: "Tile" }]}
        />
        <button type="button" className="demo-btn" onClick={run}>
          {phase === "idle" ? "Run inspection" : phase === "fixed" ? "Run it again" : "Re-run"}
        </button>
      </div>

      <div className="spec-split">
        <div className="spec-split__panel">
          <p className="spec-split__head">Figma, the component as designed</p>
          <ul className="spec-props">
            <li className="spec-props__row">
              <span>component</span>
              <span>Tile{afterFix || phase === "fixed" ? "" : " / Brand"}</span>
            </li>
            <li className="spec-props__row" data-part="propname">
              <span>prop</span>
              <span>{afterFix || phase === "fixed" ? "variant: primary" : "brand: periwinkle"}</span>
            </li>
            <li className="spec-props__row" data-part="description">
              <span>description</span>
              <span>{afterFix || phase === "fixed" ? "A compact content tile." : "(empty)"}</span>
            </li>
            <li className="spec-props__row" data-part="value">
              <span>radius</span>
              <span>{afterFix || phase === "fixed" ? "--demo-radius" : "set by hand"}</span>
            </li>
          </ul>
        </div>
        <div className="spec-split__panel">
          <p className="spec-split__head">Code, the component as shipped</p>
          <div className="demo-tile" data-part="value">
            <p className="demo-tile__title">Tile</p>
            <p className="demo-tile__desc" data-part="description">
              A compact content tile. Variant and size resolve from tokens.
            </p>
            <p className="demo-tile__meta" data-part="propname">variant=&quot;primary&quot; size=&quot;md&quot;</p>
            <span data-part="button" style={{ display: "inline-flex" }}>
              <span className="demo-btn" aria-hidden="true">Action</span>
            </span>
          </div>
        </div>
      </div>

      {running && (
        <>
          {/* the parity verdict in one glance: counts, pill, consequence */}
          <div className="pin-bar-row">
            <span className="spec-split__head" style={{ margin: 0 }}>Figma ⇄ code</span>
            <span className="pin-bar" aria-hidden="true">
              <span className="pin-bar__fill" style={{ width: `${(inSync / CHECKS.length) * 100}%` }} />
            </span>
            <span className="ds-swatch__value">{inSync}/{CHECKS.length} in sync</span>
            <StatusPill>{verdict}</StatusPill>
          </div>
          <p className="pin-consequence">{consequence}</p>

          <ul className="pin-findings" aria-label="Inspection findings">
            {CHECKS.map((c, i) => {
              const pass = afterFix || !c.drifted;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={`pin-row${i < visible ? " show" : ""}`}
                    aria-pressed={selected === c.zone}
                    onClick={() => pick(c.zone)}
                    onMouseEnter={() => onZone(c.zone)}
                    onMouseLeave={() => onZone(selected)}
                    onFocus={() => onZone(c.zone)}
                    onBlur={() => onZone(selected)}
                  >
                    <span className="spec-console__word">{pass ? "pass" : "drift"}</span>
                    <span>{afterFix ? c.fixedLine : c.finding}</span>
                    <span className="pin-row__action">{afterFix ? "Keep" : c.action}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {(phase === "fixed" || afterFix) && (
            <p className={`pin-fix${phase === "fixed" || afterFix ? " show" : ""}`}>
              {FIX_LINES.map((l) => (
                <span key={l} style={{ display: "block" }}>{l}</span>
              ))}
            </p>
          )}
        </>
      )}
    </div>
  );
}
