"use client";

import Link from "next/link";
import Image from "next/image";
import caseStudies from "@/data/caseStudies";

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "DESIGN SYSTEMS": { bg: "#2A5FA8", color: "#FFFFFF" },
  "DATA VIZ":       { bg: "#6B3FA8", color: "#FFFFFF" },
  "UX STRATEGY":    { bg: "#A85F20", color: "#FFFFFF" },
  "PRODUCT UX":     { bg: "#206B4A", color: "#FFFFFF" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "#1A1814", color: "#FFFFFF" };
}

export default function CaseStudyGrid() {
  return (
    <section id="work" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
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

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={cs.href ?? `/case-studies/${cs.slug}`}
              data-cursor="card"
              className="group rounded-2xl overflow-hidden block bg-white/60 transition-all duration-300 hover:scale-[1.02] h-full"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden bg-[#2A2420]">
                {/* z-index 0: always-visible image fallback */}
                <Image
                  src={cs.heroImage}
                  alt={cs.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  style={{ zIndex: 0 }}
                />
                {/* z-index 1: video on top — hides itself on error so image shows through */}
                {cs.heroVideo && (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={cs.heroVideo}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
                  />
                )}
                {/* z-index 2.5: play icon for video thumbnails */}
                {cs.heroVideo && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ zIndex: 3 }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.88)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.22)",
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <path d="M6 4l8 5-8 5V4z" fill="#1A1814" />
                      </svg>
                    </div>
                  </div>
                )}
                {/* z-index 2: dark overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(0,0,0,0.4)", zIndex: 2 }}
                />
                {/* z-index 3: year + client logo */}
                {/* Year */}
                <span className="absolute top-3 right-3 text-[13px] font-medium text-white/70" style={{ zIndex: 3 }}>
                  {cs.year}
                </span>
                {/* Client logo — top left */}
                {cs.clientLogo && (
                  <div
                    className="absolute top-3 left-3 flex items-center gap-2"
                    style={{ zIndex: 3 }}
                  >
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.95)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cs.clientLogo}
                        alt={cs.clientName ?? ""}
                        style={{ width: "22px", height: "22px", objectFit: "contain" }}
                        onError={(e) => { e.currentTarget.parentElement!.style.display = "none"; }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col h-[220px]">
                {/* Project tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className="text-[11px] font-bold tracking-widest px-3 py-1 rounded-full"
                    style={{ background: getCategoryStyle(cs.category).bg, color: getCategoryStyle(cs.category).color, letterSpacing: "0.1em" }}
                  >
                    {cs.category}
                  </span>
                  {cs.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={`${cs.slug}-${tag}`}
                      className="tag"
                      style={{ fontSize: "10px", padding: "0.2rem 0.55rem" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  className="line-clamp-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 400,
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    lineHeight: 1.2,
                  }}
                >
                  {cs.title}
                </h3>
                <p
                  className="line-clamp-3"
                  style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "#666666", lineHeight: 1.6, marginTop: "auto" }}
                >
                  {cs.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
