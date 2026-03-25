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

/* ─── Bento card sizes ─────────────────────────────────────────── */
type CardSize = "featured" | "medium" | "wide";

/** Determines card layout based on position in the grid */
function getCardSize(index: number, total: number): CardSize {
  if (index === 0) return "featured";
  if (index === total - 1 && total > 3) return "wide";
  return "medium";
}

const ASPECT: Record<CardSize, string> = {
  featured: "aspect-[16/8]",
  medium: "aspect-[16/10]",
  wide: "aspect-[21/8]",
};

/* ─── Bento Card ───────────────────────────────────────────────── */

interface BentoCardProps {
  cs: (typeof caseStudies)[number];
  size: CardSize;
  delay: number;
}

function BentoCard({ cs, size, delay }: BentoCardProps) {
  const isFeatured = size === "featured";
  const isWide = size === "wide";

  return (
    <FadeIn
      delay={delay}
      className={
        isFeatured
          ? "col-span-1 sm:col-span-2"
          : isWide
            ? "col-span-1 sm:col-span-2"
            : "col-span-1"
      }
    >
      <Link
        href={cs.href ?? `/case-studies/${cs.slug}`}
        data-cursor="card"
        className="bento-card group relative flex flex-col overflow-hidden"
      >
        {/* ── Image area ── */}
        <div className={`relative w-full shrink-0 overflow-hidden ${ASPECT[size]} bg-[#1A1814]`}>
          <Image
            src={cs.heroImage}
            alt={cs.title}
            fill
            loading={isFeatured ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes={
              isFeatured
                ? "(max-width: 768px) 100vw, 1200px"
                : isWide
                  ? "(max-width: 768px) 100vw, 1200px"
                  : "(max-width: 640px) 100vw, 600px"
            }
          />
          {cs.heroVideo && (
            <video
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="absolute inset-0 z-[1] h-full w-full object-cover"
            >
              <source src={cs.heroVideo} type="video/mp4" />
            </video>
          )}

          {/* Gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background: isFeatured
                ? "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 40%, transparent 70%)"
                : "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)",
            }}
            aria-hidden
          />

          {/* Year badge */}
          <span className="absolute right-4 top-4 z-[4] rounded-full border border-white/18 bg-black/25 px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] text-white/90 backdrop-blur-sm">
            {cs.year}
          </span>

          {/* Client logo */}
          {cs.clientLogo && (
            <div className="absolute left-4 top-4 z-[4] flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/45 bg-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.clientLogo}
                alt={cs.clientName ?? ""}
                className="h-5 w-5 object-contain"
                onError={(e) => { e.currentTarget.parentElement!.style.display = "none"; }}
              />
            </div>
          )}

          {/* ── Overlay content (featured cards show title on image) ── */}
          {isFeatured && (
            <div className="absolute bottom-0 left-0 right-0 z-[3] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
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
                  <span key={`${cs.slug}-${tag}`} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
              {cs.clientName && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60 mb-1.5">
                  {cs.clientName}
                </p>
              )}
              <h3
                className="font-[family-name:var(--font-display)] font-bold text-white leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
              >
                {cs.title}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-white/75 max-w-[560px] line-clamp-2">
                {cs.description}
              </p>
            </div>
          )}
        </div>

        {/* ── Content area (non-featured cards) ── */}
        {!isFeatured && (
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
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
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A8480] mb-1">
                {cs.clientName}
              </p>
            )}

            <h3 className="heading-card">
              {cs.title}
            </h3>

            <p className="body-sm mt-2 line-clamp-2" style={{ color: "var(--color-muted)" }}>
              {cs.description}
            </p>
          </div>
        )}
      </Link>
    </FadeIn>
  );
}

/* ─── Grid ─────────────────────────────────────────────────────── */

export { SectionHeader };

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
    <section id="work" className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeader
            label="— Selected Work"
            title="Case Studies"
            description="Long-form project work across design systems, enterprise platforms, and complex product UX."
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {caseStudies.map((cs, i) => (
            <BentoCard
              key={cs.slug}
              cs={cs}
              size={getCardSize(i, caseStudies.length)}
              delay={i * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
