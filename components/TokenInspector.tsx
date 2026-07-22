"use client";

import { useState } from "react";
import TokenAnnotation, { FlagLeaders } from "@/components/TokenAnnotation";

/**
 * §8 /design-system: the clickable proof that this site runs on tokens.
 * A keycap specimen whose anatomy zones are real buttons. Phase 2
 * rebuild (22 Jul, audit section 5): proto slot order INSIDE the card,
 * ONE lane at the top, then the stage, the zones, the caption. The
 * flags are the readout: selecting a zone swaps the lane to that
 * zone's tokens; tokens appear once. Live computed reads + theme
 * re-read live in TokenAnnotation, unchanged. The ring reserves its
 * space IN FLOW: the ringwrap pads one spacing token per side and the
 * ring sits at inset 0 with a concentric radius (no negative insets).
 * Leaders are the in-card SVG, drawn to touch the keycap. Also
 * embedded chromeless (/design-system/inspector) as case evidence.
 */

const ZONES: {
  id: string;
  label: string;
  drives: string;
  flags: readonly string[];
}[] = [
  {
    id: "face",
    label: "Face",
    drives: "The filled key face, a two-stop gradient. Fixed in both themes so the white label always clears AA.",
    flags: ["--key-fill-hi", "--key-fill-lo"],
  },
  {
    id: "label",
    label: "Label",
    drives: "Label colour, and the mono face all UI labels share.",
    flags: ["--key-face-hi", "--font-mono"],
  },
  {
    id: "radius",
    label: "Radius",
    drives: "Corner rounding, one alias deep: the key radius points at the scale.",
    flags: ["--btn-key-radius", "--radius-lg"],
  },
  {
    id: "edge",
    label: "Edge and shadow",
    drives: "The down-right plate edge and the resting cast shadow. Pressing the key swaps to the pressed pair.",
    flags: ["--key-fill-edge", "--shadow-key-resting"],
  },
  {
    id: "size",
    label: "Hit area",
    drives: "Minimum touch target on every interactive control.",
    flags: ["--spacing-touch-target"],
  },
];

export default function TokenInspector() {
  const [zone, setZone] = useState("face");

  const active = ZONES.find((z) => z.id === zone)!;

  return (
    <div className="tok-inspector">
      {/* proto slot order: lane / stage / zones / caption, all inside
          the card; the flags ARE the readout */}
      <TokenAnnotation key={zone} tokens={active.flags} />
      <div className="tok-inspector__stage">
        <FlagLeaders />
        <span className="tok-inspector__ringwrap" data-zone={zone}>
          {/* the measurable trace ring: space reserved in flow by the
              ringwrap padding, ring at inset 0, concentric corners
              (audit:visual asserts the geometry) */}
          <span className="tok-inspector__ring" aria-hidden="true" />
          <span className="tok-inspector__key" aria-hidden="true">
            design
          </span>
        </span>
      </div>
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
