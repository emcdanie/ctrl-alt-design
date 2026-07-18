"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * §8 /design-system: the clickable proof that this site runs on tokens.
 * A keycap specimen whose anatomy zones are real buttons; the readout
 * shows the driving tokens with values read LIVE from computed styles,
 * so the inspector cannot drift from the stylesheet. Re-reads on theme
 * flip. Also embedded chromeless (/design-system/inspector) as Code
 * First case evidence.
 */

const ZONES: {
  id: string;
  label: string;
  drives: string;
  tokens: string[];
}[] = [
  {
    id: "face",
    label: "Face",
    drives: "The filled key face, a two-stop gradient. Fixed in both themes so the white label always clears AA.",
    tokens: ["--key-fill-hi", "--key-fill-lo"],
  },
  {
    id: "label",
    label: "Label",
    drives: "Label colour, and the mono face all UI labels share.",
    tokens: ["--key-face-hi", "--font-mono"],
  },
  {
    id: "radius",
    label: "Radius",
    drives: "Corner rounding, one alias deep: the key radius points at the scale.",
    tokens: ["--btn-key-radius", "--radius-lg"],
  },
  {
    id: "edge",
    label: "Edge and shadow",
    drives: "The down-right plate edge and the resting cast shadow. Pressing the key swaps to the pressed pair.",
    tokens: ["--key-fill-edge", "--shadow-key-resting"],
  },
  {
    id: "size",
    label: "Hit area",
    drives: "Minimum touch target on every interactive control.",
    tokens: ["--spacing-touch-target"],
  },
];

const ALL_TOKENS = ZONES.flatMap((z) => z.tokens);

function isColour(v: string) {
  return /^#|^rgb|^hsl|^oklch|^color\(/.test(v.trim());
}

export default function TokenInspector() {
  const [zone, setZone] = useState("face");
  const [values, setValues] = useState<Record<string, string>>({});

  const read = useCallback(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const t of ALL_TOKENS) next[t] = cs.getPropertyValue(t).trim();
    setValues(next);
  }, []);

  useEffect(() => {
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, [read]);

  const active = ZONES.find((z) => z.id === zone)!;

  return (
    <div className="tok-inspector">
      <div className="tok-inspector__stage">
        <span className="tok-inspector__key" data-zone={zone} aria-hidden="true">
          design
        </span>
        <div className="tok-inspector__zones" role="group" aria-label="Keycap anatomy zones">
          {ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              className="tok-inspector__zone"
              aria-pressed={zone === z.id}
              onClick={() => setZone(z.id)}
              onFocus={() => setZone(z.id)}
              onMouseEnter={() => setZone(z.id)}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tok-inspector__readout" aria-live="polite">
        <p className="tok-inspector__drives">{active.drives}</p>
        <dl className="tok-inspector__tokens">
          {active.tokens.map((t) => (
            <div key={t} className="tok-inspector__row">
              <dt>{t}</dt>
              <dd>
                {isColour(values[t] ?? "") && (
                  <span
                    className="tok-inspector__chip"
                    style={{ background: values[t] }}
                    aria-hidden="true"
                  />
                )}
                {values[t] || "reading"}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
