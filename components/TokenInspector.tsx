"use client";

import { useState } from "react";
import TokenAnnotation from "@/components/TokenAnnotation";

/**
 * §8 /design-system: the clickable proof that this site runs on tokens.
 * A keycap specimen whose anatomy zones are real buttons; the readout
 * is the SHARED TokenAnnotation (alwaysOpen), so the inspector and the
 * specimen annotations are one implementation. Also embedded chromeless
 * (/design-system/inspector) as Code First case evidence.
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

export default function TokenInspector() {
  const [zone, setZone] = useState("face");

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

      <div className="tok-inspector__readout">
        <TokenAnnotation tokens={active.tokens} note={active.drives} alwaysOpen />
      </div>
    </div>
  );
}
