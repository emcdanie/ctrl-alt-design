"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CaseBeat from "@/components/CaseBeat";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

/**
 * Beat 01, "the audit": the recreated client surface as an INTERACTIVE
 * embed (supersedes the static ds-audit-buttons ScaledFrame). The visual
 * is the standalone artifact public/demos/case-study-visuals/
 * drift-specimen.html, embedded LIVE at the beat column's real width (an
 * auto-height iframe, not downscaled). The artifact carries its own
 * foreign palette (steel / crimson / green, deliberately NO iris) so it
 * reads as the CLIENT's product; only these PAGE controls wear BELLA iris.
 *
 * The page drives the artifact by postMessage: reveal (draw the callouts +
 * leaders), mode (Before / On system), theme (mirrors the site), and
 * reduced-motion. The artifact posts its content height back so the iframe
 * sizes to it responsively (resize + toggle + theme flip all redraw).
 */

const ART_ORIGIN = "drift-specimen";
const SRC = "/demos/case-study-visuals/drift-specimen.html?embed=1";

export default function DriftAuditBeat({
  index,
  kicker,
  headline,
  keyline,
  id,
  body,
  caption,
  footExtra,
}: {
  index: string;
  kicker: string;
  headline: string;
  keyline?: string;
  id: string;
  body: React.ReactNode;
  caption: string;
  footExtra?: React.ReactNode;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<"before" | "system">("before");
  const [height, setHeight] = useState(560);

  const post = useCallback((msg: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage({ target: ART_ORIGIN, ...msg }, "*");
  }, []);

  const currentTheme = () => document.documentElement.getAttribute("data-theme") || "light";
  const currentMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduce" : "full";

  /* push the full state to the artifact (on ready / load) */
  const syncAll = useCallback(
    (r: boolean, m: string) => {
      post({ type: "set", theme: currentTheme(), motion: currentMotion(), mode: m, reveal: r });
    },
    [post],
  );

  /* receive height + ready from the artifact */
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== ART_ORIGIN) return;
      if (d.type === "height" && typeof d.px === "number") setHeight(Math.max(320, d.px));
      if (d.type === "ready") syncAll(revealed, mode);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [syncAll, revealed, mode]);

  /* mirror the site theme into the artifact */
  useEffect(() => {
    const obs = new MutationObserver(() => post({ type: "set", theme: currentTheme() }));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [post]);

  /* drive reveal + mode */
  useEffect(() => {
    post({ type: "set", reveal: revealed, mode });
  }, [revealed, mode, post]);

  return (
    <CaseBeat
      index={index}
      kicker={kicker}
      headline={headline}
      keyline={keyline}
      id={id}
      body={body}
      control={
        <div className="drift-audit-controls">
          <Button variant="primary" onClick={() => setRevealed((v) => !v)}>
            {revealed ? "Reset" : "Reveal the drift"}
          </Button>
          <SegmentedControl
            label="Surface state"
            value={mode}
            onChange={(v) => setMode(v === "system" ? "system" : "before")}
            options={[
              { value: "before", label: "Before" },
              { value: "system", label: "On system" },
            ]}
          />
        </div>
      }
      visual={
        <iframe
          ref={iframeRef}
          src={SRC}
          title="Recreated client surface: five UI parts in Before and On system states, with an audit annotation layer"
          onLoad={() => syncAll(revealed, mode)}
          scrolling="no"
          style={{
            width: "100%",
            height: `${height}px`,
            border: "none",
            display: "block",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            background: "transparent",
          }}
        />
      }
      foot={
        <>
          <p className="cs2-kicker-row" style={{ margin: 0 }}>{caption}</p>
          {footExtra}
        </>
      }
    />
  );
}
