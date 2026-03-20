"use client";

import Link from "next/link";
import Image from "next/image";
import caseStudies from "@/data/caseStudies";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group rounded-2xl overflow-hidden block bg-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
            >
              {/* Thumbnail */}
              <div className="aspect-[16/10] relative overflow-hidden bg-[#2A2420]">
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
                {/* z-index 2: dark overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(0,0,0,0.4)", zIndex: 2 }}
                />
                {/* z-index 3: category pill + year */}
                <span className="absolute bottom-3 left-4 text-[13px] font-semibold tracking-widest px-2.5 py-1 rounded-full bg-white/15 text-white backdrop-blur-sm" style={{ zIndex: 3 }}>
                  {cs.category}
                </span>
                <span className="absolute top-3 right-3 text-[13px] font-medium text-white/70" style={{ zIndex: 3 }}>
                  {cs.year}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display font-bold text-[#1A1814] mb-2 leading-snug" style={{ fontSize: "20px" }}>
                  {cs.title}
                </h3>
                <p className="leading-relaxed mb-4 line-clamp-2" style={{ fontSize: "15px", color: "#8A8480" }}>
                  {cs.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cs.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
