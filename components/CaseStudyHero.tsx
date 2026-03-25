import Image from "next/image";
import { tagColor } from "@/lib/tagColor";

interface HeroMedia {
  type: "video" | "image";
  src: string;
  alt?: string;
}

interface CaseStudyHeroProps {
  eyebrow: string;
  title: string;
  intro: string;
  metadata: { label: string; value: string }[];
  tags: string[];
  media: HeroMedia;
  liveUrl?: string;
}

/**
 * Shared editorial case study hero.
 *
 * Layout: text header (left-aligned, single column) → full-width media below.
 * Title scale: clamp(40px, 5.5vw, 72px). Media ratio: 16/9.
 */
export default function CaseStudyHero({
  eyebrow,
  title,
  intro,
  metadata,
  tags,
  media,
  liveUrl,
}: CaseStudyHeroProps) {
  return (
    <div>
      {/* ── Text header ── */}
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-28 md:px-8 md:pb-12 md:pt-36">
        <div className="max-w-[620px]">
          <p className="section-label mb-6">{eyebrow}</p>

          <h1 className="mb-6 font-[var(--font-display)] text-[clamp(40px,5.5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-ink)]">
            {title}
          </h1>

          <p className="mb-10 text-[clamp(16px,1.5vw,19px)] leading-[1.75] text-[var(--color-muted)]">
            {intro}
          </p>

          <dl className="mb-8 space-y-4 border-b border-[var(--color-border-soft)] pb-8">
            {metadata.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5"
              >
                <dt className="min-w-[100px] text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)] opacity-70">
                  {label}
                </dt>
                <dd className="m-0 max-w-[440px] text-[13.5px] leading-[1.7] text-[var(--color-ink)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className={`flex flex-wrap gap-2.5 ${liveUrl ? "mb-6" : ""}`}>
            {tags.map((tag) => {
              const c = tagColor(tag);
              return (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border px-3.5 py-1.5 text-[11px] font-semibold leading-[1.5] tracking-[0.04em] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                  style={{
                    background: c.bg,
                    color: c.color,
                    borderColor: "rgba(44, 24, 16, 0.08)",
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-medium)] bg-white/55 px-4 py-2 text-[13px] font-semibold text-[var(--color-accent-espresso)] shadow-[0_8px_24px_rgba(44,24,16,0.05)] backdrop-blur-md transition hover:bg-white/75"
            >
              <span>Live preview</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Full-width media ── */}
      <div className="mx-auto max-w-[1200px] px-6 pb-16 md:px-8 md:pb-24">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-white/20 bg-[#110f12] shadow-[0_20px_60px_rgba(44,24,16,0.14),0_6px_20px_rgba(44,24,16,0.08)]">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_18%)]" />
          {media.type === "video" ? (
            <>
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={media.src} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(12,10,14,0.04)_45%,rgba(12,10,14,0.28)_100%)]" />
            </>
          ) : (
            <>
              <Image
                src={media.src}
                alt={media.alt ?? title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(12,10,14,0.02)_50%,rgba(12,10,14,0.18)_100%)]" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
