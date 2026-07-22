"use client";

import { useState } from "react";
import TokenAnnotation, { type FlagSpec } from "@/components/TokenAnnotation";

/**
 * §8 /design-system: the clickable proof that this site runs on tokens.
 * A keycap specimen whose anatomy zones are real buttons. Inspector
 * refinements (Elleta, 22 Jul): the right-hand readout list is gone,
 * the FLAGS are the readout — selecting a zone swaps the visible flags
 * to that zone's tokens (contained lanes above and below the keycap,
 * leader ticks per the containment law). Live computed reads + theme
 * re-read live in TokenAnnotation, unchanged. The measurable ring
 * element keeps ONE equal offset from the keycap edge on all sides
 * (token offset, concentric radius; asserted in audit:visual). Also
 * embedded chromeless (/design-system/inspector) as case evidence.
 */

const ZONES: {
  id: string;
  label: string;
  drives: string;
  flags: readonly FlagSpec[];
}[] = [
  {
    id: "face",
    label: "Face",
    drives: "The filled key face, a two-stop gradient. Fixed in both themes so the white label always clears AA.",
    flags: [
      { token: "--key-fill-hi", kind: "color", at: "top" },
      { token: "--key-fill-lo", kind: "color", at: "bottom" },
    ],
  },
  {
    id: "label",
    label: "Label",
    drives: "Label colour, and the mono face all UI labels share.",
    flags: [
      { token: "--key-face-hi", kind: "color", at: "top" },
      { token: "--font-mono", kind: "font", at: "bottom" },
    ],
  },
  {
    id: "radius",
    label: "Radius",
    drives: "Corner rounding, one alias deep: the key radius points at the scale.",
    flags: [
      { token: "--btn-key-radius", kind: "radius", at: "top-left" },
      { token: "--radius-lg", kind: "radius", at: "bottom-left" },
    ],
  },
  {
    id: "edge",
    label: "Edge and shadow",
    drives: "The down-right plate edge and the resting cast shadow. Pressing the key swaps to the pressed pair.",
    flags: [
      { token: "--key-fill-edge", kind: "color", at: "top" },
      { token: "--shadow-key-resting", kind: "shadow", at: "bottom" },
    ],
  },
  {
    id: "size",
    label: "Hit area",
    drives: "Minimum touch target on every interactive control.",
    flags: [{ token: "--spacing-touch-target", kind: "size", at: "top" }],
  },
];

export default function TokenInspector() {
  const [zone, setZone] = useState("face");

  const active = ZONES.find((z) => z.id === zone)!;

  return (
    <div className="tok-inspector">
      {/* the flags ARE the readout (22 Jul): top lane, keycap, bottom
          lane, zone chips, the zone's caption sentence */}
      <TokenAnnotation key={`${zone}-top`} tokens={active.flags} variant="flags" lane="top" />
      <div className="tok-inspector__stage">
        <span className="tok-inspector__key" data-zone={zone} aria-hidden="true">
          design
          {/* the measurable trace ring: one token offset per side,
              concentric corners (audit:visual asserts the geometry) */}
          <span className="tok-inspector__ring" aria-hidden="true" />
        </span>
      </div>
      <TokenAnnotation key={`${zone}-bottom`} tokens={active.flags} variant="flags" lane="bottom" />
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
      <p className="tok-inspector__drives">{active.drives}</p>
    </div>
  );
}
