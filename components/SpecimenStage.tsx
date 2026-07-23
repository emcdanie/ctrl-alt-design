"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The case specimen stage: the working specimen floats directly on
 * the page ground (no card chrome around the stage), the stage gains
 * .in on scroll to trigger the CSS-transition draw-ins, and the
 * [data-hl] attribute carries the one highlight recipe for whatever
 * device sits inside (flags, leaders). The Before/On-system toggle
 * and the --demo-* control register are retired (simplification
 * pass, 22 Jul 2026); the stage is static ground only.
 * prefers-reduced-motion renders everything immediately. The flags
 * and leaders themselves belong to the devices inside (CaseSpecimen);
 * the stage is the ground they stand on.
 */
export default function SpecimenStage({
  label = "On system",
  flat = false,
  zone: forcedZone = null,
  children,
}: {
  /** the state tag in the stage corner */
  label?: string;
  /** flat stage: full-width block, tight padding */
  flat?: boolean;
  /** controlled highlight zone (the gate run drives the ring);
      overrides the hover zone while set */
  zone?: string | null;
  /** node, or a function receiving the highlight setter */
  children:
    | React.ReactNode
    | ((setZone: (z: string | null) => void) => React.ReactNode);
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [zone, setZone] = useState<string | null>(null);

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
      <div
        ref={ref}
        className={["spec-stage", flat ? "spec-stage--flat" : "", inView ? "in" : ""]
          .filter(Boolean)
          .join(" ")}
        data-hl={forcedZone ?? zone ?? undefined}
      >
        <span className="spec-stage__tag" aria-hidden="true">{label}</span>
        <div className="spec-stage__demo">
          {typeof children === "function" ? children(setZone) : children}
        </div>
      </div>
    </div>
  );
}
