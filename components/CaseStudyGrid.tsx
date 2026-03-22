"use client";

import Link from "next/link";
import Image from "next/image";
import caseStudies from "@/data/caseStudies";
import FadeIn from "@/components/FadeIn";

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "DESIGN SYSTEMS": { bg: "#2A5FA8", color: "#FFFFFF" },
  "DATA VIZ": { bg: "#6B3FA8", color: "#FFFFFF" },
  "UX STRATEGY": { bg: "#A85F20", color: "#FFFFFF" },
  "PRODUCT UX": { bg: "#206B4A", color: "#FFFFFF" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "#1A1814", color: "#FFFFFF" };
}

export default function CaseStudyGrid() {
  return (
    <section id="work" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="section-label mb-3">— Selected Work</p>
              <h2
                className="font-display font-extrabold text-[#1A1814] leading-tight"
                style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
              >
                Case Studies
              </h2>
              <p
                className="mt-2 max-w-md"
                style={{
                  fontSize: "17px",
                  color: "#6B6560",
                  lineHeight: 1.65,
                  letterSpacing: "0.01em",
                }}
              >
                Long-form project work across design systems, enterprise platforms, and complex product UX.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-5">
          {caseStudies.map((cs, i) => (
            <FadeIn key={cs.slug} delay={i * 70}>
              <Link
                href={cs.href ?? `/case-studies/${cs.slug}`}
                data-cursor="card"
                className="group glass-card flex flex-col md:flex-row md:items-stretch overflow-hidden transition-all duration-300 hover:shadow-[0_12px_48px_rgba(44,24,16,0.1)] hover:-translate-y-0.5 md:min-h-[200px]"
              >
                {/* Media — 16:9, consistent across projects */}
                <div
                  className="relative w-full shrink-0 aspect-video md:w-[min(44%,380px)] md:max-w-[420px]"
                  style={{ background: "#1A1814" }}
                >
                  <Image
                    src={cs.heroImage}
                    alt={cs.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  {cs.heroVideo && (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 z-[1] h-full w-full object-cover"
                    >
                      <source src={cs.heroVideo} type="video/mp4" />
                    </video>
                  )}
                  {/* Light bottom fade for badges */}
                  <div
                    className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/35 via-transparent to-transparent"
                    aria-hidden
                  />
                  {cs.heroVideo && (
                    <div
                      className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center"
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg"
                        aria-hidden
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M5 3.5l9 4.5-9 4.5V3.5z" fill="#1A1814" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <span className="absolute right-3 top-3 z-[4] text-[12px] font-medium text-white/85">
                    {cs.year}
                  </span>
                  {cs.clientLogo && (
                    <div className="absolute left-3 top-3 z-[4] flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white/95 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cs.clientLogo}
                        alt={cs.clientName ?? ""}
                        className="h-[22px] w-[22px] object-contain"
                        onError={(e) => {
                          e.currentTarget.parentElement!.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Editorial column — tags, title, description, CTA */}
                <div className="flex min-h-[180px] flex-1 flex-col justify-center gap-3 px-5 py-6 md:px-8 md:py-7">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
                      style={{
                        background: getCategoryStyle(cs.category).bg,
                        color: getCategoryStyle(cs.category).color,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {cs.category}
                    </span>
                    {cs.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={`${cs.slug}-${tag}`}
                        className="tag"
                        style={{ fontSize: "10px", padding: "0.2rem 0.55rem" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {cs.clientName && (
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8480]"
                      style={{ letterSpacing: "0.08em" }}
                    >
                      {cs.clientName}
                    </p>
                  )}

                  <h3
                    className="font-display text-[clamp(1.25rem,2.5vw,1.5rem)] font-semibold leading-snug text-[#1A1814] tracking-tight"
                  >
                    {cs.title}
                  </h3>

                  <p
                    className="line-clamp-2 text-[15px] leading-relaxed text-[#5C5852]"
                    style={{ lineHeight: 1.65, letterSpacing: "0.01em" }}
                  >
                    {cs.description}
                  </p>

                  <span
                    className="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold transition-colors group-hover:text-[var(--color-accent-espresso)]"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "#1A1814",
                      letterSpacing: "0.02em",
                    }}
                  >
                    View case study
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
