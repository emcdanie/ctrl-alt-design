"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "./Case.module.css";

/* A numbered case figure (Site v3, Figma Site/Figure button 323:138).
   Every figure has Enlarge, top-right: a full-screen viewer at the
   figure's full width, with the page's own pinch-zoom and a pan inside
   the frame, the caption pinned at the foot. Close and Esc return focus
   to Enlarge (the native dialog does both). Page zoom is never disabled.

   A figure with motion (`replay`) plays once when half of it is in view
   and offers Replay beside Enlarge; its art reads `useFigurePlay()` and
   keys its animation on `run`. Reduced motion is CSS's job: the art
   shows its finished frame. */

const PlayContext = createContext<{ playing: boolean; run: number }>({ playing: true, run: 0 });

/** for figure art with motion: `playing` turns on once in view, `run`
 *  bumps on Replay so the art can restart its animation by key */
export function useFigurePlay() {
  return useContext(PlayContext);
}

export default function CaseFigure({
  n,
  caption,
  replay = false,
  inset = false,
  phoneTop,
  children,
  className = "",
}: {
  /** the figure number, "Figure N." */
  n: number;
  caption: ReactNode;
  /** the art has motion: play in view, show Replay */
  replay?: boolean;
  /** the tools sit 16 in from the corner (the motion figures) */
  inset?: boolean;
  /** at 390 the tools sit below the picture's top label (the cover) */
  phoneTop?: "label";
  children: ReactNode;
  className?: string;
}) {
  const art = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(!replay);
  const [run, setRun] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!replay || playing) return;
    const el = art.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setPlaying(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlaying(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [replay, playing]);

  const show = () => {
    setOpen(true);
    requestAnimationFrame(() => dialog.current?.showModal());
  };

  return (
    <figure className={`${styles.figBlock} ${className}`.trim()}>
      <div className={styles.figureArt} ref={art}>
        <PlayContext.Provider value={{ playing, run }}>{children}</PlayContext.Provider>
        <div className={styles.figureTools} data-inset={inset || undefined} data-phone-top={phoneTop}>
          <button type="button" className={styles.toolButton} data-icon onClick={show} aria-haspopup="dialog">
            <Icon name="Enlarge" />
            <span className="sr-only">Enlarge Figure {n}</span>
          </button>
          {replay ? (
            <button
              type="button"
              className={styles.toolButton}
              onClick={() => {
                setPlaying(true);
                setRun((r) => r + 1);
              }}
            >
              Replay<span className="sr-only"> Figure {n}</span>
            </button>
          ) : null}
        </div>
      </div>
      <figcaption className={`${styles.caption} ${styles.col}`}>
        <span className={styles.captionNum}>Figure {n}.</span> {caption}
      </figcaption>
      {open ? (
        <dialog
          ref={dialog}
          className={styles.viewer}
          aria-label={`Figure ${n}, enlarged`}
          onClose={() => setOpen(false)}
        >
          <div className={styles.viewerInner}>
            <div className={styles.viewerStage}>
              <div className={styles.viewerArt} data-viewer>
                <PlayContext.Provider value={{ playing: true, run }}>{children}</PlayContext.Provider>
              </div>
            </div>
            <div className={styles.viewerCaption}>
              <p>
                <span className={styles.captionNum}>Figure {n}.</span> {caption}
              </p>
            </div>
          </div>
          <button type="button" className={`${styles.toolButton} ${styles.viewerClose}`} data-icon onClick={() => dialog.current?.close()}>
            <Icon name="Xmark" />
            <span className="sr-only">Close Figure {n}</span>
          </button>
        </dialog>
      ) : null}
    </figure>
  );
}
