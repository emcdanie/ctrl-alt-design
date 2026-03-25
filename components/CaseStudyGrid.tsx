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

interface SectionShellProps {
  id: string;
  children: React.ReactNode;
}

function SectionShell({ id, children }: SectionShellProps) {
  return (
    <section id={id} className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
}

function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end md:mb-14">
      <div>
        <p className="section-label mb-3">{label}</p>
        <h2 className="heading-section">{title}</h2>
        {description && (
          <p className="body-lg mt-3 max-w-xl" style={{ color: "var(--color-muted)" }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default function CaseStudyGrid() {
  return (
    <SectionShell id="work">
      <FadeIn>
        <SectionHeader
          label="— Selected Work"
          title="Case Studies"
          description="Long-form project work across design systems, enterprise platforms, and complex product UX."
        />
      </FadeIn>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
        {caseStudies.map((cs, i) => (
          <FadeIn key={cs.slug} delay={i * 60} className="flex flex-col">
            <Link
              href={cs.href ?? `/case-studies/${cs.slug}`}
              data-cursor="card"
              className="group card-elevated flex h-full flex-col overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(44,24,16,0.1),0_6px_16px_rgba(44,24,16,0.07)]"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#1A1814]">
                <Image
                  src={cs.heroImage}
                  alt={cs.title}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 480px"
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
                <div
                  className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent_52%)]"
                  aria-hidden
                />
                <span className="absolute right-3 top-3 z-[4] rounded-full border border-white/18 bg-black/22 px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-white/90 backdrop-blur-sm">
                  {cs.year}
                </span>
                {cs.clientLogo && (
                  <div className="absolute left-3 top-3 z-[4] flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/45 bg-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cs.clientLogo}
                      alt={cs.clientName ?? ""}
                      className="h-5 w-5 object-contain"
                      onError={(e) => {
                        e.currentTarget.parentElement!.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.12em]"
                    style={{
                      background: getCategoryStyle(cs.category).bg,
                      color: getCategoryStyle(cs.category).color,
                    }}
                  >
                    {cs.category}
                  </span>
                  {cs.tags?.slice(0, 2).map((tag) => (
                    <span key={`${cs.slug}-${tag}`} className="tag px-2.5 py-0.5 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>

                {cs.clientName && (
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A8480]">
                    {cs.clientName}
                  </p>
                )}

                <h3 className="heading-card mt-2.5">
                  {cs.title}
                </h3>

                <p className="body-sm mt-2 line-clamp-2" style={{ color: "var(--color-muted)" }}>
                  {cs.description}
                </p>

                <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.02em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent-espresso)]">
                  View case study
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </SectionShell>
  );
}
