"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Beat 01 "the audit" visual: the recreated client surface (drift
 * specimen) embedded live at the beat column's real width, NOT
 * downscaled. The standalone artifact
 * public/demos/case-study-visuals/drift-specimen.html renders already
 * revealed and carries its OWN Before / On system toggle plus its foreign
 * palette (steel / crimson / green, deliberately no iris on the surface).
 *
 * This component is a thin bridge: an auto-height iframe (sized to the
 * content the artifact reports) that mirrors the SITE theme into the
 * artifact by postMessage, so the transparent specimen reads AA on the
 * beat ground in both light and dark. No controls live here.
 */
const ART = "drift-specimen";
const SRC = "/demos/case-study-visuals/drift-specimen.html?embed=1";

export default function DriftSpecimenEmbed() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(520);

  const postTheme = useCallback(() => {
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    iframeRef.current?.contentWindow?.postMessage({ target: ART, type: "theme", theme }, "*");
  }, []);

  /* receive height + ready */
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== ART) return;
      if (d.type === "height" && typeof d.px === "number") setHeight(Math.max(320, d.px));
      if (d.type === "ready") postTheme();
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [postTheme]);

  /* mirror the site theme into the artifact */
  useEffect(() => {
    const obs = new MutationObserver(postTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [postTheme]);

  return (
    <iframe
      ref={iframeRef}
      src={SRC}
      title="Recreated client surface: five UI parts in Before and On system states, with an audit annotation layer"
      onLoad={postTheme}
      scrolling="no"
      style={{
        width: "100%",
        height: `${height}px`,
        border: "none",
        display: "block",
        background: "transparent",
      }}
    />
  );
}
