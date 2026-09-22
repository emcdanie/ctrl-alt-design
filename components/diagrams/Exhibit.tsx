"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

/**
 * Exhibit (Geist refresh, 22 Sep 2026): the frame every case-study
 * diagram sits in. A grey panel, the drawing, a Mono caption, and a
 * replay button. The drawing plays ONCE when half of it is in view
 * (`is-playing` on the figure), then holds still; replay restarts it.
 * Under reduced motion the figure gets `is-final` instead: the finished
 * frame, no replay button. Diagrams key their CSS off those two classes
 * and draw their own inline SVG (marked data-bella-diagram): 1px ink
 * strokes, colour in the chip fills only, Mono labels at 13px.
 */
export default function Exhibit({
  caption,
  replayLabel,
  className = "",
  onPlay,
  children,
}: {
  caption?: ReactNode;
  /** accessible name of the replay button, e.g. "Replay the rollout animation" */
  replayLabel?: string;
  className?: string;
  /** called each time the drawing (re)starts, for JS-driven diagrams */
  onPlay?: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [played, setPlayed] = useState<"idle" | "playing">("idle");
  const state = reduce ? "final" : played;
  const [run, setRun] = useState(0);

  const play = useCallback(() => {
    setPlayed("idle");
    /* two frames, so removing and re-adding the class restarts CSS animations */
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPlayed("playing");
        setRun((r) => r + 1);
      }),
    );
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play, reduce]);

  useEffect(() => {
    if (run > 0) onPlay?.();
  }, [run, onPlay]);

  return (
    <figure
      ref={ref}
      className={["exhibit", state === "playing" ? "is-playing" : "", state === "final" ? "is-final" : "", className]
        .filter(Boolean)
        .join(" ")}
      data-run={run}
    >
      {replayLabel && state !== "final" ? (
        <button type="button" className="exhibit__replay" onClick={play} aria-label={replayLabel}>
          replay
        </button>
      ) : null}
      {children}
      {caption ? <figcaption className="exhibit__caption">{caption}</figcaption> : null}
    </figure>
  );
}
