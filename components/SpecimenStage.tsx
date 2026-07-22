"use client";

import { useEffect, useRef, useState } from "react";
import TokenAnnotation, { FlagLeaders, type StageFlag } from "@/components/TokenAnnotation";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

/**
 * The case specimen stage (PR 41 amendment, Elleta 22 Jul 2026;
 * contract _proto/annotated-specimen-proto.html). A WORKING component
 * floats directly on the page ground: no card, no frame; density
 * from composition. The stage hosts the one annotation implementation
 * in stage mode: leaders draw in on scroll (IntersectionObserver +
 * stroke-dash, CSS transitions only), flags enter staggered, each
 * leader anchors to the computed geometry of the part its token
 * drives, and hovering or focusing a flag highlights that exact part
 * of the live component (keyboard parity included). Where a case has
 * an honest before state, the Before / On-system toggle (the
 * existing SegmentedControl, single-select with ARIA state) shows
 * the real mess and hides the annotations. prefers-reduced-motion
 * renders everything immediately.
 *
 * The specimen inside wears the scoped --demo-* register (Elleta's
 * ruling, recorded in DESIGN.md): the specimen reads as "a product",
 * the annotation layer stays BELLA iris on both themes.
 */
export default function SpecimenStage({
  label = "On system",
  flags,
  anchors,
  hasBefore = false,
  beforeLabel = "Before",
  flat = false,
  children,
}: {
  /** the state tag in the stage corner */
  label?: string;
  /** corner flags; omit for stages whose interaction lives in the
      children (the readiness console drives its own highlights) */
  flags?: readonly StageFlag[];
  /** token -> selector of the [data-part] element it drives */
  anchors?: Record<string, string>;
  /** the case has an honest before state (amendment item 4) */
  hasBefore?: boolean;
  beforeLabel?: string;
  /** flat stage: full-width block, tight padding (consoles and
      inspectors; the reserved zone law still applies to any flags) */
  flat?: boolean;
  /** node, or a function receiving the highlight setter so children
      (console lines) can drive the same highlight recipe */
  children: React.ReactNode | ((setZone: (z: string | null) => void) => React.ReactNode);
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [state, setState] = useState("on");
  const [zone, setZone] = useState<string | null>(null);
  const before = state === "before";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="spec-wrap">
      {hasBefore && (
        <SegmentedControl
          label="Specimen state"
          options={[
            { value: "on", label: "On system" },
            { value: "before", label: beforeLabel },
          ]}
          value={state}
          onChange={setState}
        />
      )}
      <div
        ref={ref}
        className={[
          "spec-stage",
          flat ? "spec-stage--flat" : "",
          inView ? "in" : "",
          before ? "spec-stage--before" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-hl={zone ?? undefined}
      >
        <span className="spec-stage__tag" aria-hidden="true">{before ? beforeLabel : label}</span>
        {!before && flags && anchors && (
          <>
            <FlagLeaders anchors={anchors} />
            <TokenAnnotation tokens={[]} stageFlags={flags} scoped onZone={setZone} />
          </>
        )}
        <div className="spec-stage__demo">
          {typeof children === "function" ? children(setZone) : children}
        </div>
      </div>
    </div>
  );
}
