"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "link" | "media" | "card" | "nav" | "quote" | "text";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    // Skip rAF loop if user prefers reduced motion (cursor still tracks, just no lerp trail)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mouseX = 0, mouseY = 0;
    let bubbleX = 0, bubbleY = 0;
    let rafId: number;

    const dot = dotRef.current;
    const bubble = bubbleRef.current;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
      }
      if (!visible) setVisible(true);

      // Determine hover state
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el) return;

      const isCard = !!el.closest("[data-cursor='card']");
      const isMedia = !!el.closest("[data-cursor='media']");
      const isNav = !!el.closest("[data-cursor='nav']");
      const isQuote = !!el.closest("blockquote");
      const isLink = !!el.closest("a, button, [role='button']");
      const isText = !!el.closest("p, li, span");

      if (isCard) { setState("card"); setLabel("OPEN"); }
      else if (isNav) { setState("nav"); setLabel("MENU"); }
      else if (isMedia) { setState("media"); setLabel("VIEW"); }
      else if (isQuote) { setState("quote"); setLabel(""); }
      else if (isLink) { setState("link"); setLabel(""); }
      else if (isText) { setState("text"); setLabel(""); }
      else { setState("default"); setLabel(""); }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onClick = () => {
      if (!bubble) return;
      bubble.style.transition = "transform 100ms ease, width 100ms ease, height 100ms ease";
      bubble.style.width = "32px";
      bubble.style.height = "32px";
      bubble.style.transform = "translate(-50%, -50%) scale(1)";
      setTimeout(() => {
        if (bubble) {
          bubble.style.width = "";
          bubble.style.height = "";
        }
      }, 150);
    };

    // rAF lerp loop — snap directly when reduced motion is on
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      const t = reducedMotion ? 1 : 0.12;
      bubbleX = lerp(bubbleX, mouseX, t);
      bubbleY = lerp(bubbleY, mouseY, t);
      if (bubble) {
        bubble.style.left = bubbleX + "px";
        bubble.style.top = bubbleY + "px";
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // Size/style based on state
  const bubbleSize = state === "media" || state === "card" ? 80
    : state === "nav" ? 56
    : state === "link" ? 64
    : state === "text" ? 24
    : 40;

  const bubbleFill = state === "link" ? "rgba(26,26,26,0.08)" : "transparent";
  const dotOpacity = (state === "link" || state === "media" || state === "card" || state === "nav") ? 0 : 1;
  const borderStyle = state === "quote" ? "1.5px dashed #1A1A1A" : "1.5px solid #1A1A1A";
  const showLabel = (state === "media" || state === "card" || state === "nav") && label;

  if (typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#1A1A1A",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: visible ? dotOpacity : 0,
          transition: "opacity 200ms ease",
        }}
      />
      {/* Trailing bubble */}
      <div
        ref={bubbleRef}
        style={{
          position: "fixed",
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
          borderRadius: "50%",
          border: borderStyle,
          background: bubbleFill,
          transform: "translate(-50%, -50%)",
          zIndex: 9998,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: "width 200ms ease, height 200ms ease, background 200ms ease, border 200ms ease, opacity 200ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showLabel && (
          <span
            ref={labelRef}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#1A1A1A",
              animation: "fadeInUp 150ms ease forwards",
              userSelect: "none",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </>
  );
}
