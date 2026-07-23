"use client";

import { useEffect, useRef, useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

/**
 * The case specimen stage: the working specimen floats directly on
 * the page ground (no card chrome around the stage), the stage gains
 * .in on scroll to trigger the CSS-transition draw-ins, and the
 * [data-hl] attribute carries the one highlight recipe for whatever
 * device sits inside (flags, console lines, rails). Hosts the
 * --demo-* register scope and the Before / On-system toggle where a
 * beat needs one (the toggle is the real SegmentedControl).
 * prefers-reduced-motion renders everything immediately. The flags
 * and leaders themselves belong to the devices inside (CaseSpecimen);
 * the stage is the ground they stand on.
 */
export default function SpecimenStage({
  label = "On system",
  hasBefore = false,
  beforeLabel = "Before",
  flat = false,
  beforeStyling = true,
  children,
}: {
  /** the state tag in the stage corner */
  label?: string;
  /** the beat has an honest before state, toggled above the stage */
  hasBefore?: boolean;
  beforeLabel?: string;
  /** flat stage: full-width block, tight padding */
  flat?: boolean;
  /** when false, the before state carries NO component restyling:
      only the children's annotation layer responds */
  beforeStyling?: boolean;
  /** node, or a function receiving the highlight setter and the
      before state */
  children:
    | React.ReactNode
    | ((setZone: (z: string | null) => void, before: boolean) => React.ReactNode);
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
          before && beforeStyling ? "spec-stage--before" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-hl={zone ?? undefined}
      >
        <span className="spec-stage__tag" aria-hidden="true">{before ? beforeLabel : label}</span>
        <div className="spec-stage__demo">
          {typeof children === "function" ? children(setZone, before) : children}
        </div>
      </div>
    </div>
  );
}
