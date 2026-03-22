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
      <div className="mx-auto max-w-5xl">{children}</div>
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
        <h2
          className="font-display font-extrabold leading-tight text-[#1A1814]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-3 max-w-xl text-[16px] leading-[1.72] text-[#6B6560] md:text-[17px]"
            style={{ letterSpacing: "0.01em" }}
          >
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

      <div className="flex flex-col gap-6 md:gap-7">
        {caseStudies.map((cs, i) => (
          <FadeIn key={cs.slug} delay={i * 70}>
            <Link
              href={cs.href ?? `/case-studies/${cs.slug}`}
              data-cursor="card"
              className="group glass-card flex flex-col overflow-hidden rounded-[24px] border border-black/6 bg-white/[0.72] shadow-[0_10px_30px_rgba(44,24,16,0.05),0_2px_8px_rgba(44,24,16,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(44,24,16,0.09),0_8px_18px_rgba(44,24,16,0.06)] md:min-h-[220px] md:flex-row md:items-stretch"
            >
              <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#1A1814] md:w-[min(45%,390px)] md:max-w-[420px]">
                <Image
                  src={cs.heroImage}
                  alt={cs.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  sizes="(max-width: 768px) 100vw, 390px"
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
                  className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_top,rgba(0,0,0,0.34),transparent_46%),linear-gradient(to_right,rgba(0,0,0,0.16),transparent_45%)]"
                  aria-hidden
                />
                {cs.heroVideo && (
                  <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/82 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md"
                      aria-hidden
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5 3.5l9 4.5-9 4.5V3.5z" fill="#1A1814" />
                      </svg>
                    </div>
                  </div>
                )}
                <span className="absolute right-4 top-4 z-[4] rounded-full border border-white/18 bg-black/20 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-white/92 backdrop-blur-sm">
                  {cs.year}
                </span>
                {cs.clientLogo && (
                  <div className="absolute left-4 top-4 z-[4] flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/45 bg-white/92 shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cs.clientLogo}
                      alt={cs.clientName ?? ""}
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        e.currentTarget.parentElement!.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex min-h-[180px] flex-1 flex-col justify-center px-5 py-6 md:px-8 md:py-8">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className="rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.14em] shadow-sm"
                    style={{
                      background: getCategoryStyle(cs.category).bg,
                      color: getCategoryStyle(cs.category).color,
                    }}
                  >
                    {cs.category}
                  </span>
                  {cs.tags?.slice(0, 3).map((tag) => (
                    <span key={`${cs.slug}-${tag}`} className="tag px-2.5 py-1 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>

                {cs.clientName && (
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A8480]">
                    {cs.clientName}
                  </p>
                )}

                <h3 className="mt-3 font-display text-[clamp(1.3rem,2.5vw,1.65rem)] font-semibold leading-[1.18] tracking-tight text-[#1A1814]">
                  {cs.title}
                </h3>

                <p
                  className="mt-3 line-clamp-2 max-w-2xl text-[15px] leading-[1.72] text-[#5C5852]"
                  style={{ letterSpacing: "0.01em" }}
                >
                  {cs.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold tracking-[0.02em] text-[#1A1814] transition-colors group-hover:text-[var(--color-accent-espresso)]">
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