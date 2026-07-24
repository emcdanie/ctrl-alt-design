"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * THE interactive-case-artifact embed (one implementation, used by the
 * From Drift beats: the drift specimen (beat 01) and the cascade pipeline
 * (beat 02)). Each artifact is a standalone HTML file under
 * public/demos/case-study-visuals/ that renders live at the beat column's
 * real width (NOT downscaled) and carries its own foreign palette.
 *
 * This is a thin bridge: an auto-height iframe (sized to the content the
 * artifact reports over postMessage) that mirrors the SITE theme into the
 * artifact so its transparent surface reads AA on the beat ground in both
 * light and dark. `channel` is the artifact's message id (its `source` on
 * the way out, our `target` on the way in), so multiple embeds don't cross
 * wires.
 */
export default function CaseArtifactEmbed({
  src,
  title,
  channel,
  minHeight = 520,
}: {
  src: string;
  title: string;
  channel: string;
  minHeight?: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(minHeight);

  const postTheme = useCallback(() => {
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    iframeRef.current?.contentWindow?.postMessage({ target: channel, type: "theme", theme }, "*");
  }, [channel]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || d.source !== channel) return;
      if (d.type === "height" && typeof d.px === "number") setHeight(Math.max(320, d.px));
      if (d.type === "ready") postTheme();
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [channel, postTheme]);

  useEffect(() => {
    const obs = new MutationObserver(postTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, [postTheme]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title}
      onLoad={postTheme}
      scrolling="no"
      style={{ width: "100%", height: `${height}px`, border: "none", display: "block", background: "transparent" }}
    />
  );
}
