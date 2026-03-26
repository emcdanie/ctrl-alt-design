"use client";

import { useEffect, useState } from "react";

/**
 * Editorial landing hero — full viewport, staggered entrance animations.
 * Clicking "View my work" smooth-scrolls to the dashboard area below.
 *
 * Animation sequence (CSS-driven, no libraries):
 *   0.0s  — curtain line draws
 *   0.3s  — eyebrow fades up
 *   0.6s  — name line 1 slides up
 *   0.8s  — name line 2 slides up
 *   1.2s  — tagline fades in
 *   1.6s  — CTA fades in
 *   2.0s  — scroll hint pulses
 */
export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Slight delay so the page paints first, then animations trigger
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleViewWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="hero-landing"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 var(--space-md)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background accent — soft radial glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184,149,106,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "960px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Thin decorative line */}
        <div
          className={mounted ? "hero-anim-line" : ""}
          style={{
            width: "1px",
            height: mounted ? "60px" : "0",
            background: "var(--color-accent-gold)",
            margin: "0 auto 32px",
            transition: "height 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {/* Eyebrow */}
        <p
          className="eyebrow"
          style={{
            marginBottom: "28px",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
          }}
        >
          Product Designer — Design Systems &amp; AI
        </p>

        {/* Name — split into two lines for editorial stagger */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 0.92,
            margin: "0 0 28px 0",
            color: "var(--color-ink)",
          }}
        >
          <span
            className="hero-name-line"
            style={{
              display: "block",
              fontSize: "clamp(56px, 10vw, 110px)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(40px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
            }}
          >
            Elleta
          </span>
          <span
            className="hero-name-line"
            style={{
              display: "block",
              fontSize: "clamp(56px, 10vw, 110px)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(40px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
            }}
          >
            McDaniel
          </span>
        </h1>

        {/* Editorial tagline */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(18px, 2.5vw, 24px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--color-muted)",
            lineHeight: 1.5,
            maxWidth: "580px",
            margin: "0 auto 40px",
            letterSpacing: "-0.01em",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 0.8s ease 1.2s, transform 0.8s ease 1.2s",
          }}
        >
          Designing clarity for complex digital platforms and scaling teams.
        </p>

        {/* CTA button */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 0.7s ease 1.6s, transform 0.7s ease 1.6s",
          }}
        >
          <a
            href="#work"
            onClick={handleViewWork}
            className="surface-dark"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              borderRadius: "999px",
              padding: "14px 32px",
              textDecoration: "none",
              transition: "opacity 200ms ease, transform 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            View my work
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{ marginTop: "1px" }}
            >
              <path
                d="M8 3v10M4 9l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Scroll indicator — gentle bounce at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: mounted ? 0.4 : 0,
          transition: "opacity 1s ease 2.2s",
          animation: mounted ? "gentleBounce 2s ease-in-out 2.5s infinite" : "none",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M10 4v12M5 11l5 5 5-5"
            stroke="var(--color-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
