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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={cs.href ?? `/case-studies/${cs.slug}`}
              data-cursor="card"
              className="group rounded-2xl overflow-hidden block bg-white/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ border: "1px solid rgba(26,24,20,0.07)" }}
            >
              {/* ── Thumbnail — enforced 16:9 ── */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  overflow: "hidden",
                  background: "#2A2420",
                }}
              >
                {/* Base image */}
                <Image
                  src={cs.heroImage}
                  alt={cs.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />

                {/* Video layer — covers image when loaded */}
                {cs.heroVideo && (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
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

                {/* Dark overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: "rgba(0,0,0,0.22)", zIndex: 2 }}
                />

                {/* Play icon — shown for video cards */}
                {cs.heroVideo && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ zIndex: 3 }}
                  >
                    <div style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.85)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M5 3.5l9 4.5-9 4.5V3.5z" fill="#1A1814" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Year badge */}
                <span
                  className="absolute top-3 right-3 text-[13px] font-medium text-white/70"
                  style={{ zIndex: 4 }}
                >
                  {cs.year}
                </span>
              </div>

              {/* ── Content: tags → title → description ── */}
              <div className="p-5 flex flex-col gap-2">
                {/* Project tags */}
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

                {/* Title */}
                <h3
                  className="line-clamp-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "#1A1A1A",
                    lineHeight: 1.25,
                  }}
                >
                  {cs.title}
                </h3>

                {/* Description */}
                <p
                  className="line-clamp-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "#666666",
                    lineHeight: 1.6,
                  }}
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
