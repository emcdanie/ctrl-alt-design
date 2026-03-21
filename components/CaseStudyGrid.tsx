"use client";

import Link from "next/link";
import Image from "next/image";
import caseStudies from "@/data/caseStudies";
import FadeIn from "@/components/FadeIn";

// Tag pill colours (below thumbnail)
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "DESIGN SYSTEMS": { bg: "#2A5FA8", color: "#FFFFFF" },
  "DATA VIZ":       { bg: "#6B3FA8", color: "#FFFFFF" },
  "UX STRATEGY":    { bg: "#A85F20", color: "#FFFFFF" },
  "PRODUCT UX":     { bg: "#206B4A", color: "#FFFFFF" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "#1A1814", color: "#FFFFFF" };
}

// Designed-cover colour themes — gradient from transparent → rich dark tint
// layered over the thumbnail image/video to create branded covers
const COVER_THEMES: Record<string, { gradient: string; accent: string }> = {
  "DESIGN SYSTEMS": {
    gradient: "linear-gradient(to top, rgba(10,22,40,0.96) 0%, rgba(10,22,40,0.55) 45%, transparent 100%)",
    accent: "#2A5FA8",
  },
  "DATA VIZ": {
    gradient: "linear-gradient(to top, rgba(30,10,40,0.96) 0%, rgba(30,10,40,0.55) 45%, transparent 100%)",
    accent: "#6B3FA8",
  },
  "UX STRATEGY": {
    gradient: "linear-gradient(to top, rgba(40,20,10,0.96) 0%, rgba(40,20,10,0.55) 45%, transparent 100%)",
    accent: "#A85F20",
  },
  "PRODUCT UX": {
    gradient: "linear-gradient(to top, rgba(10,30,20,0.96) 0%, rgba(10,30,20,0.55) 45%, transparent 100%)",
    accent: "#206B4A",
  },
};

function getCoverTheme(category: string) {
  return COVER_THEMES[category] ?? {
    gradient: "linear-gradient(to top, rgba(26,24,20,0.96) 0%, rgba(26,24,20,0.55) 45%, transparent 100%)",
    accent: "#1A1814",
  };
}

export default function CaseStudyGrid() {
  return (
    <section id="work" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-label mb-3">— Selected Work</p>
              <h2 className="font-display font-extrabold text-[#1A1814] leading-tight" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
                Case Studies
              </h2>
              <p className="mt-2 max-w-sm" style={{ fontSize: "16px", color: "#8A8480", lineHeight: "1.6" }}>
                Long-form project work across design systems, enterprise platforms, and complex product UX.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {caseStudies.map((cs, i) => {
            const coverTheme = getCoverTheme(cs.category);
            return (
              <FadeIn key={cs.slug} delay={i * 60}>
                <Link
                  href={cs.href ?? `/case-studies/${cs.slug}`}
                  data-cursor="card"
                  className="group rounded-2xl overflow-hidden block bg-white/60"
                  style={{
                    border: "1px solid rgba(26,24,20,0.07)",
                    transition: "box-shadow 280ms ease, transform 280ms ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.13)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* ── Thumbnail — 16:9 designed cover ── */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      overflow: "hidden",
                      background: "#1A1814",
                    }}
                  >
                    {/* Base image */}
                    <Image
                      src={cs.heroImage}
                      alt={cs.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />

                    {/* Video layer */}
                    {cs.heroVideo && (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={e => { e.currentTarget.style.display = "none"; }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          zIndex: 1,
                        }}
                      >
                        <source src={cs.heroVideo} type="video/mp4" />
                      </video>
                    )}

                    {/* ── Designed cover: colour-themed gradient ── */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: coverTheme.gradient,
                        zIndex: 2,
                        transition: "opacity 280ms ease",
                      }}
                    />

                    {/* ── Cover text: title + subtitle ── */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "16px 18px 18px",
                        zIndex: 3,
                      }}
                    >
                      {/* Category accent line */}
                      <div
                        style={{
                          width: "24px",
                          height: "2px",
                          background: coverTheme.accent,
                          borderRadius: "2px",
                          marginBottom: "8px",
                          opacity: 0.9,
                        }}
                      />
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(15px, 2vw, 19px)",
                          fontWeight: 700,
                          color: "#FFFFFF",
                          lineHeight: 1.2,
                          marginBottom: "4px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {cs.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          color: "rgba(255,255,255,0.65)",
                          lineHeight: 1.4,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {cs.description}
                      </p>
                    </div>

                    {/* Play icon for video cards */}
                    {cs.heroVideo && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ zIndex: 4 }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.88)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M5 3.5l9 4.5-9 4.5V3.5z" fill="#1A1814" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Year badge */}
                    <span
                      className="absolute top-3 right-3 text-[12px] font-medium text-white/60"
                      style={{ zIndex: 5 }}
                    >
                      {cs.year}
                    </span>
                  </div>

                  {/* ── Card content: tags → description ── */}
                  <div className="p-5 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="text-[11px] font-bold px-3 py-1 rounded-full"
                        style={{
                          background: getCategoryStyle(cs.category).bg,
                          color: getCategoryStyle(cs.category).color,
                          letterSpacing: "0.1em",
                        }}
                      >
                        {cs.category}
                      </span>
                      {cs.tags?.slice(0, 2).map(tag => (
                        <span
                          key={`${cs.slug}-${tag}`}
                          className="tag"
                          style={{ fontSize: "10px", padding: "0.2rem 0.55rem" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p
                      className="line-clamp-2"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: "#666666",
                        lineHeight: 1.6,
                        marginTop: "2px",
                      }}
                    >
                      {cs.description}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
