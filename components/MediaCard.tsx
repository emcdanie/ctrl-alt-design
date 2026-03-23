"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * MediaCard
 *
 * Shared card component used across the homepage for:
 *   - Case study projects (type: "project") → links to a page
 *   - Video / exploration cards (type: "video") → triggers onClick
 *
 * Design tokens match the existing site palette (warm creams, glass-card aesthetic).
 *
 * Usage — project card:
 *   <MediaCard
 *     type="project"
 *     title="From Drift to Foundation"
 *     subtitle="BizAway · 2024–2026"
 *     category="DESIGN SYSTEMS"
 *     tags={["Design Systems", "Tokens"]}
 *     imageSrc="/images/bizaway-hero.png"
 *     href="/case-studies/bizaway-design-system"
 *   />
 *
 * Usage — video card:
 *   <MediaCard
 *     type="video"
 *     title="Complex Insurance Forms"
 *     subtitle="Form Design · Exploration"
 *     tags={["Form Design", "Accessibility"]}
 *     imageSrc="/images/thumbnails/HealthForm.png"
 *     onClick={() => openModal(video)}
 *   />
 */

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "DESIGN SYSTEMS": { bg: "#E8F0E8", color: "#2A5A2A" },
  "DATA VIZ": { bg: "#E8EAF0", color: "#2A2F6A" },
  "UX STRATEGY": { bg: "#F0EAE8", color: "#6A2A20" },
  "PRODUCT UX": { bg: "#EDE8F0", color: "#4A2A6A" },
  "AI UX": { bg: "#E8EEF8", color: "#1A3E7A" },
  "FINTECH": { bg: "#F0E8F0", color: "#5A1A5A" },
  "FORM DESIGN": { bg: "#F8EEE0", color: "#7A3A10" },
  "DASHBOARD": { bg: "#E0F0EA", color: "#0A4A30" },
};

interface BaseMediaCardProps {
  title: string;
  subtitle?: string;
  category?: string;
  tags?: string[];
  /** Image src — Next.js Image. Pass a public path like "/images/hero.png". */
  imageSrc?: string;
  /** Gradient fallback when no image is provided, e.g. "linear-gradient(135deg, #0A1628, #1A3A5C)" */
  gradient?: string;
  className?: string;
}

interface ProjectCardProps extends BaseMediaCardProps {
  type: "project";
  href: string;
  onClick?: never;
}

interface VideoCardProps extends BaseMediaCardProps {
  type: "video";
  onClick: () => void;
  href?: never;
}

type MediaCardProps = ProjectCardProps | VideoCardProps;

function CardInner({
  title,
  subtitle,
  category,
  tags,
  imageSrc,
  gradient,
  isVideo,
}: BaseMediaCardProps & { isVideo: boolean }) {
  const [imgFailed, setImgFailed] = useState(false);
  const catStyle = category ? (CATEGORY_COLORS[category] ?? { bg: "#F0EDE8", color: "#5D5852" }) : null;

  return (
    <>
      {/* Media area */}
      <div
        className="relative aspect-video w-full overflow-hidden"
        style={{ background: gradient ?? "#F0EDE8" }}
      >
        {imageSrc && !imgFailed && (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgFailed(true)}
          />
        )}

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.24),transparent_48%)]" />

        {/* Category badge */}
        {catStyle && category && (
          <span
            className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
            style={{ background: catStyle.bg, color: catStyle.color }}
          >
            {category}
          </span>
        )}

        {/* Play button for video cards */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M5 3.5l10 5.5-10 5.5V3.5z" fill="#1A1814" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Text area */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1.5 font-[var(--font-display)] text-[17px] font-bold leading-snug text-[#1A1814]">
          {title}
        </h3>
        {subtitle && (
          <p className="mb-3 flex-1 text-[14px] leading-[1.65] text-[#8A8480]">{subtitle}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/[0.08] bg-white/60 px-2.5 py-1 text-[11px] font-medium text-[#5D5852]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function MediaCard(props: MediaCardProps) {
  const sharedClasses =
    "group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border border-white/60 bg-gradient-to-b from-white/82 to-white/68 shadow-[0_8px_24px_rgba(44,24,16,0.05),0_2px_6px_rgba(44,24,16,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] [backdrop-filter:blur(18px)] [-webkit-backdrop-filter:blur(18px)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(44,24,16,0.09),0_6px_16px_rgba(44,24,16,0.06)]";

  if (props.type === "project") {
    const { href, type: _type, ...rest } = props;
    return (
      <Link href={href} className={`${sharedClasses} no-underline`}>
        <CardInner {...rest} isVideo={false} />
      </Link>
    );
  }

  const { onClick, type: _type, ...rest } = props;
  return (
    <button type="button" onClick={onClick} className={`${sharedClasses} text-left`}>
      <CardInner {...rest} isVideo={true} />
    </button>
  );
}
