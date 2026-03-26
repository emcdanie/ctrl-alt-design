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

/* ─── Card sizes — uniform compact grid ───────────────────────── */
type CardSize = "standard";

const ASPECT: Record<CardSize, string> = {
  standard: "aspect-[16/10]",
};

/* ─── Bento Card ───────────────────────────────────────────────── */

interface CardProps {
  cs: (typeof caseStudies)[number];
  delay: number;
}

function CompactCard({ cs, delay }: CardProps) {
  return (
    <FadeIn delay={delay} className="col-span-1">
      <Link
        href={cs.href ?? `/case-studies/${cs.slug}`}
        data-cursor="card"
        className="bento-card group relative flex flex-col overflow-hidden"
      >
        {/* ── Image area ── */}
        <div className={`relative w-full shrink-0 overflow-hidden ${ASPECT.standard} bg-[#1A1814]`}>
          <Image
            src={cs.heroImage}
            alt={cs.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
          {cs.heroVideo && (
            <video
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              className="absolute inset-0 z-1 h-full w-full object-cover"
            >
              <source src={cs.heroVideo} type="video/mp4" />
            </video>
          )}

          {/* Gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-2"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)",
            }}
            aria-hidden
          />

          {/* Year badge */}
          <span className="absolute right-3 top-3 z-4 rounded-full border border-white/18 bg-black/25 px-2 py-0.5 text-[9px] font-semibold tracking-widest text-white/90 backdrop-blur-sm">
            {cs.year}
          </span>

          {/* Client logo */}
          {cs.clientLogo && (
            <div className="absolute left-3 top-3 z-4 flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/45 bg-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.clientLogo}
                alt={cs.clientName ?? ""}
                className="h-4 w-4 object-contain"
                onError={(e) => { e.currentTarget.parentElement!.style.display = "none"; }}
              />
            </div>
          )}
        </div>

        {/* ── Content area ── */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-[0.12em]"
              style={{
                background: getCategoryStyle(cs.category).bg,
                color: getCategoryStyle(cs.category).color,
              }}
            >
              {cs.category}
            </span>
          </div>

          {cs.clientName && (
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#8A8480] mb-0.5">
              {cs.clientName}
            </p>
          )}

          <h3 className="heading-card text-[16px]">
            {cs.title}
          </h3>

          <p className="body-sm mt-1.5 line-clamp-2 text-[13px]" style={{ color: "var(--color-muted)" }}>
            {cs.description}
          </p>

          <span className="mt-auto pt-4 text-[12px] font-medium text-[var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Peek inside →
          </span>
        </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {caseStudies.map((cs, i) => (
            <CompactCard
              key={cs.slug}
              cs={cs}
              delay={i * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
