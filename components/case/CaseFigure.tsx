"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Case.module.css";

/* A numbered case figure (Site v3). No Enlarge and no viewer (Elleta,
   4 Oct late: "it covers the picture and isn't needed"): a phone zooms a
   picture with the page's own pinch-zoom, which is never disabled.

   A figure with motion (`replay`) plays once when half of it is in view
   and offers Replay at the end of the caption row (job F); its art reads `useFigurePlay()` and keys
   its animation on `run`. Reduced motion is CSS's job: the art shows its
   finished frame. */

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
  replayBelow = false,
  fold = false,
  children,
  className = "",
}: {
  /** the figure number, "Figure N." */
  n: number;
  caption: ReactNode;
  /** the art has motion: play in view, show Replay */
  replay?: boolean;
  /** Replay under the caption at every width, not in the wide margin (Theming, N6) */
  replayBelow?: boolean;
  /** phones: a tall figure shows its first screen and the rest opens
   *  behind "Show the whole figure" (job O1, 6 Oct 2026); nothing is dropped */
  fold?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const art = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(!replay);
  const [run, setRun] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!replay || playing) return;
    /* phones (job O16, 6 Oct 2026): the figure shows its final frame at
       once, so no reserved animation space sits empty; Replay still plays it */
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 39.99rem)").matches) {
      setPlaying(true);
      return;
    }
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

  return (
    <figure className={`${styles.figBlock} ${className}`.trim()}>
      <div className={styles.figureArt} ref={art} data-replay={replay || undefined} data-fold={fold ? (open ? "open" : "closed") : undefined}>
        {/* Site/Figure stage (417:1706): the grid behind every picture,
            56/64 margins at 1440 and 20 at 390 */}
        <div className={styles.stage}>
          <PlayContext.Provider value={{ playing, run }}>{children}</PlayContext.Provider>
        </div>
      </div>
      {fold ? (
        <div className={`${styles.moreBar} ${styles.moreBarPhone}`}>
          <button type="button" className={styles.toolButton} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Show less" : "Show the whole figure"}
          </button>
        </div>
      ) : null}
      <figcaption className={`${styles.caption} ${styles.col} ${styles.captionRow} ${replayBelow ? styles.captionRowBelow : ""}`.trim()}>
        <span>
          <span className={styles.captionNum}>Figure {n}.</span> {caption}
        </span>
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
      </figcaption>
    </figure>
  );
}

/** restarts its children on Replay (a live exhibit that runs its own loop) */
export function ReplayKey({ children }: { children: ReactNode }) {
  const { run } = useFigurePlay();
  return <div key={run}>{children}</div>;
}
