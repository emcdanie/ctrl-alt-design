"use client";

import { useEffect, useState } from "react";

/**
 * Compact editorial hero — fits above the carousel in the landing view.
 * CTA triggers the snap transition to the dashboard.
 */
export default function Hero({ onEnterDashboard }: { onEnterDashboard?: () => void }) {
  const [mounted, setMounted] = useState(false);

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

        {/* CTA */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s",
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
        </div>
      </div>
    </section>
  );
}
