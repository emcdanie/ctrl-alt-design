"use client";

import { useEffect, useState } from "react";

/**
 * Compact editorial hero — fits above the carousel in the landing view.
 * CTA triggers the snap transition to the dashboard.
 */
export default function Hero({ onEnterDashboard }: { onEnterDashboard?: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="hero-landing"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 var(--space-md)",
        position: "relative",
        overflow: "hidden",
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,149,106,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: "1100px", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <p
          className="eyebrow"
          style={{
            marginBottom: "20px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s",
          }}
        >
          Product Designer — Design Systems &amp; AI
        </p>

        {/* Name — single responsive headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(52px, 7vw, 120px)",
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            margin: "0 0 24px 0",
            color: "var(--color-ink)",
            whiteSpace: "nowrap",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
          }}
        >
          Elleta McDaniel
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(16px, 2.2vw, 22px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--color-muted)",
            lineHeight: 1.5,
            maxWidth: "520px",
            margin: "0 auto 28px",
            letterSpacing: "-0.01em",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
          }}
        >
          Designing clarity for complex digital platforms and scaling teams.
        </p>

        {/* CTA row */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <button
            onClick={() => onEnterDashboard?.()}
            className="surface-dark"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "999px",
              padding: "14px 32px",
              border: "none",
              textDecoration: "none",
              transition: "opacity 200ms ease, transform 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Come see what I&apos;ve been building
            <span style={{ fontSize: "16px", lineHeight: 1 }}>→</span>
          </button>

          {/* Share button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShareOpen((o) => !o)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 500,
                borderRadius: "999px",
                padding: "13px 24px",
                border: "1px solid rgba(26,24,20,0.12)",
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(8px)",
                color: "var(--color-ink)",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.6)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 8V13C4 13.5523 4.44772 14 5 14H11C11.5523 14 12 13.5523 12 13V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M8 2V10M5.5 4.5L8 2L10.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share Portfolio
            </button>

            {/* Share panel */}
            {shareOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(26,24,20,0.1)",
                  borderRadius: "14px",
                  padding: "8px",
                  boxShadow: "0 8px 32px rgba(26,24,20,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  minWidth: "180px",
                  zIndex: 20,
                }}
              >
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "none",
                    background: "transparent",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--color-ink)",
                    cursor: "pointer",
                    transition: "background 150ms",
                    textAlign: "left",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(26,24,20,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--color-ink)",
                    textDecoration: "none",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(26,24,20,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Share on LinkedIn
                </a>
                <a
                  href={`mailto:?subject=Check out this portfolio&body=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "var(--color-ink)",
                    textDecoration: "none",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(26,24,20,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Share via Email
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
