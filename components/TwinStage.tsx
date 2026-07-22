"use client";

import SpecimenStage from "@/components/SpecimenStage";

/**
 * Beat 01 (PR 41 amendment 3, item 1): the demo matches the words.
 * Two IDENTICAL-looking buttons, same pixels (audit:visual asserts
 * their rendered geometry and colours are equal). The left is
 * labelled from Figma, the right from code. The Before / On-system
 * toggle changes ONLY the annotation layer: Before shows the
 * mismatched names and raw values flagged in the recorded drift
 * status colour; On system shows both sides carrying the same names
 * and token bindings. The buttons themselves never change; the eye
 * sees no difference, the labels tell the truth.
 */

const SIDES = [
  {
    id: "figma",
    source: "Figma",
    beforeName: "Primary / Large",
    beforeFlags: ["radius 8px, hand-set", "hex #101114, hand-set"], // token-waiver: the depicted raw values, quoted as data
    onName: "variant: action / size: lg",
    onFlags: ["radius --demo-radius", "fill --demo-primary"],
  },
  {
    id: "code",
    source: "Storybook",
    beforeName: "variant: action / size: lg",
    beforeFlags: ["radius --demo-radius", "fill --demo-primary"],
    onName: "variant: action / size: lg",
    onFlags: ["radius --demo-radius", "fill --demo-primary"],
  },
] as const;

export default function TwinStage() {
  return (
    <SpecimenStage hasBefore beforeStyling={false} label="On system">
      {(_setZone, before) => (
        <div className="twin">
          {SIDES.map((s) => {
            const name = before ? s.beforeName : s.onName;
            const flags = before ? s.beforeFlags : s.onFlags;
            /* in the before state only the FIGMA side is the drifted
               record; code was already the source of truth */
            const drifted = before && s.id === "figma";
            return (
              <div key={s.id} className="twin__side">
                <p className="spec-split__head" style={{ margin: 0 }}>{s.source}</p>
                <span className={`ds-flag${drifted ? " ds-flag--drift" : ""}`}>
                  <span className="ds-flag__value">{name}</span>
                </span>
                <button type="button" className="demo-btn" data-twin={s.id}>
                  Book demo
                </button>
                <span className="twin__flags">
                  {flags.map((f) => (
                    <span key={f} className={`ds-flag${drifted ? " ds-flag--drift" : ""}`}>
                      <span className="ds-flag__token">{f}</span>
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </SpecimenStage>
  );
}
