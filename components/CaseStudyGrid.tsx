"use client";

import Link from "next/link";
import Image from "next/image";
import caseStudies from "@/lib/content";
import FadeIn from "@/components/FadeIn";

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "DESIGN SYSTEMS": { bg: "#1E4A8A", color: "#FFFFFF" },
  "DATA VIZ": { bg: "#52308A", color: "#FFFFFF" },
  "UX STRATEGY": { bg: "#7A4510", color: "#FFFFFF" },
  "PRODUCT UX": { bg: "#185438", color: "#FFFFFF" },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: "#1A1814", color: "#FFFFFF" };
}

/* ─── Card sizes — uniform compact grid ───────────────────────── */
type CardSize = "standard";

const ASPECT: Record<CardSize, string> = {
  standard: "aspect-[16/11]",
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
        style={{ maxWidth: "420px" }}
      >
        {/* ── Image area — fixed 16:10 ratio ── */}
        <div className={`relative w-full shrink-0 overflow-hidden ${ASPECT.standard} bg-[#1A1814]`}>
          <Image
            src={cs.thumbnailImage || cs.heroImage}
            alt={cs.title}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
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
        </div>

        {/* ── Content area ── */}
        <div style={{ padding: "16px 20px 20px" }}>
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-[0.1em]"
            style={{
              background: getCategoryStyle(cs.category).bg,
              color: getCategoryStyle(cs.category).color,
              marginBottom: "8px",
            }}
          >
            {cs.category}
          </span>

          <h3
            className="heading-card"
            style={{ fontSize: "16px", marginBottom: "8px" }}
          >
            {cs.title}
          </h3>

          <p
            className="body-sm line-clamp-2"
            style={{ fontSize: "13px", color: "var(--color-muted)", margin: 0 }}
          >
            {cs.description}
          </p>
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
    <div className="layout-header flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
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
    <section id="work" className="layout-section">
      <div className="layout-container">
        <FadeIn>
          <SectionHeader
            label="— Selected Work"
            title="Case Studies"
            description="Long-form project work across design systems, enterprise platforms, and complex product UX."
          />
        </FadeIn>

        <div className="layout-grid-3">
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
