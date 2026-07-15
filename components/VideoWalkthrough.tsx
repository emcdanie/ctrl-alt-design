"use client";

import Link from "next/link";

const GRADIENT = "linear-gradient(135deg, #0A0A1C 0%, #1A1A3A 50%, #080814 100%)";

export default function VideoWalkthrough() {
  return (
    <section className="bg-[var(--color-semantic-background)] layout-section">
      <div className="layout-container">
        {/* Signature color block — the one place the site fully owns
            periwinkle. Everything inside reads in ink (7.9:1 on #A79CE2). */}
        {/* Panel padding tier: --spacing-8 (DESIGN.md) */}
        <div className="feature-panel p-[var(--spacing-8)]">
          <div className="max-w-5xl mx-auto">

        {/* Panel header — text leads, video follows */}
        <div className="max-w-2xl mb-8">
          <p className="section-label mb-3">FEATURED PROJECT</p>
          <h3
            className="font-bold text-[clamp(1.75rem,3vw,2.5rem)] mb-3"
            style={{ fontFamily: "var(--font-display)", lineHeight: 1.08, letterSpacing: "-0.02em" }}
          >
            Guardian — AI-Powered Design System Governance
          </h3>
          <p className="text-[16px] leading-relaxed mb-5" style={{ maxWidth: "56ch" }}>
            A hackathon concept created during the Into Design Systems hackathon exploring how AI could help detect design drift, support accessibility, and maintain consistency between design systems and implementation.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Design Systems", "Hackathon", "AI UX", "Governance"].map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Looping video — clicking opens the Guardian case study */}
        <Link
          href="/case-studies/guardian"
          className="group relative block w-full aspect-video rounded-2xl overflow-hidden shadow-[var(--shadow-lg)] mb-8"
          style={{ background: GRADIENT }}
          aria-label="View Guardian case study"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hackathon-showreel.mp4" type="video/mp4" />
          </video>
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300" style={{ zIndex: 2 }}>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 bg-white/90 text-[#1A1814] font-semibold text-sm px-5 py-3 rounded-full shadow-lg" style={{ fontFamily: "var(--font-body)" }}>
              View Case Study →
            </div>
          </div>
        </Link>

        <Link
          href="/case-studies/guardian"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-sm)",
            fontWeight: "var(--typography-font-weight-medium)",
            color: "var(--ink-on-dark-strong)",
            background: "var(--color-brand-ink)",
            borderRadius: "var(--radius-full)",
            padding: "14px 28px",
            textDecoration: "none",
            transition: "opacity 200ms ease, transform 200ms ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          View Full Case Study →
        </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
