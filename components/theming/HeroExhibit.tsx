"use client";

import { useState, type CSSProperties } from "react";
import Preview from "@/components/theming/Preview";
import { FACE_ORDER, LISTING, THEMES, faceVars, type FaceKey } from "@/components/theming/themes";
import s from "@/components/ThemingCase.module.css";

/* The hero's exhibit (N, Elleta, 6 Oct 2026): one face, user-controlled.
   The pills are real buttons in their own row above it; a click swaps the
   theme, nothing cycles. The back cards are gone. */

export default function HeroExhibit() {
  const [face, setFace] = useState<FaceKey>("night");
  const l = LISTING[face];
  return (
    <div className={s.heroArt}>
      <div className={s.heroPills} role="group" aria-label="Theme">
        {FACE_ORDER.map((k) => (
          <button
            key={k}
            type="button"
            className={s.heroPill}
            style={faceVars(k) as CSSProperties}
            aria-pressed={k === face}
            onClick={() => setFace(k)}
          >
            {k}
          </button>
        ))}
      </div>
      <div className={s.heroFace} role="img" aria-label={`${l.brand} in theme ${face}: ${l.title}, ${l.location}, ${l.price} a month.`}>
        <div aria-hidden="true">
          <Preview theme={THEMES[face]} face={face} bare />
        </div>
      </div>
    </div>
  );
}
