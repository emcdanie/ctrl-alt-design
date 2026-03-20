"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const menuItems = [
  { num: "01", label: "Work", href: "#work" },
  { num: "02", label: "Guardian", href: "/case-study/guardian" },
  { num: "03", label: "Experience", href: "#experience" },
  { num: "04", label: "Get in Touch", href: "#contact" },
];

export default function OverlayNav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [triggerHovered, setTriggerHovered] = useState(false);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <>
      {/* Fixed bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9995,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 32px",
          pointerEvents: "none",
        }}
      >
        {/* E Monogram — always visible */}
        <Link
          href="/"
          style={{ pointerEvents: "auto" }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#1A1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <text
                x="3" y="14"
                fontFamily="'Clash Display', system-ui, sans-serif"
                fontWeight="700"
                fontSize="16"
                fill="white"
              >E</text>
            </svg>
          </div>
        </Link>

        {/* Trigger — + / hamburger / × */}
        <button
          data-cursor="nav"
          onClick={() => setOpen(o => !o)}
          onMouseEnter={() => setTriggerHovered(true)}
          onMouseLeave={() => setTriggerHovered(false)}
          style={{
            pointerEvents: "auto",
            background: "none",
            border: "none",
            padding: "8px",
            cursor: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            position: "relative",
          }}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {/* Line 1 */}
          <span style={{
            display: "block",
            width: triggerHovered && !open ? "24px" : "20px",
            height: "2px",
            background: "#1A1A1A",
            borderRadius: "1px",
            position: "absolute",
            transition: "all 200ms ease",
            transform: open
              ? "rotate(45deg) translate(0, 0)"
              : triggerHovered
              ? "translateY(-4px)"
              : "translateY(-4px)",
          }} />
          {/* Line 2 — middle, only visible on hamburger */}
          <span style={{
            display: "block",
            width: "24px",
            height: "2px",
            background: "#1A1A1A",
            borderRadius: "1px",
            position: "absolute",
            transition: "all 180ms ease",
            opacity: open ? 0 : triggerHovered ? 1 : 0,
          }} />
          {/* Line 3 */}
          <span style={{
            display: "block",
            width: triggerHovered && !open ? "24px" : "20px",
            height: "2px",
            background: "#1A1A1A",
            borderRadius: "1px",
            position: "absolute",
            transition: "all 200ms ease",
            transform: open
              ? "rotate(-45deg) translate(0, 0)"
              : triggerHovered
              ? "translateY(4px)"
              : "translateY(4px)",
          }} />
        </button>
      </div>

      {/* Full-screen overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9990,
          background: "#FFFFFF",
          clipPath: open ? "inset(0% 0 0% 0)" : "inset(100% 0 0% 0)",
          transition: "clip-path 280ms cubic-bezier(0.76, 0, 0.24, 1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          overflow: "hidden",
        }}
      >
        {/* Ghost watermark */}
        <div style={{
          position: "absolute",
          right: "-40px",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(120px, 18vw, 240px)",
          fontWeight: 700,
          color: "#F0EFEB",
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}>
          EM
        </div>

        {/* Menu items */}
        <nav style={{ position: "relative", zIndex: 1 }}>
          {menuItems.map((item) => {
            const isHovered = hovered === item.num;
            const anyHovered = hovered !== null;
            const dimmed = anyHovered && !isHovered;

            return (
              <div
                key={item.num}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0",
                  marginBottom: "4px",
                  lineHeight: 1.05,
                }}
                onMouseEnter={() => setHovered(item.num)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Number */}
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  color: "#8A8A8A",
                  marginRight: "40px",
                  minWidth: "60px",
                  transition: "color 120ms ease",
                  userSelect: "none",
                }}>
                  ( _{item.num} )
                </span>

                {/* Link */}
                {item.href.startsWith("#") ? (
                  <button
                    onClick={() => handleNavClick(item.href)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(52px, 8vw, 96px)",
                      fontWeight: 400,
                      color: dimmed ? "#CCCCCC" : "#1A1A1A",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "none",
                      lineHeight: 1.05,
                      transition: "color 120ms ease",
                      letterSpacing: "-0.01em",
                      textAlign: "left",
                    }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(52px, 8vw, 96px)",
                      fontWeight: 400,
                      color: dimmed ? "#CCCCCC" : "#1A1A1A",
                      textDecoration: "none",
                      lineHeight: 1.05,
                      transition: "color 120ms ease",
                      letterSpacing: "-0.01em",
                      display: "block",
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom contact */}
        <div style={{
          position: "absolute",
          bottom: "80px",
          left: "80px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <a
            href="mailto:elletamc@gmail.com"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              color: "#8A8A8A",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1A1A1A")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8A8A8A")}
          >
            elletamc@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/elleta-mcdaniel"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "#8A8A8A",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1A1A1A")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8A8A8A")}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
