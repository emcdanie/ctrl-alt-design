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
 * Shared editorial two-column hero used by every case study page.
 *
 * Desktop: left (text) | right (media)
 * Mobile:  stacks — title → intro → metadata → media
 *
 * Title scale:  clamp(40px, 5.5vw, 72px) — consistent across all case studies.
 * Media ratio:  16 / 9 — consistent across all case studies.
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
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-6 pb-16 pt-24 md:grid-cols-2 md:gap-16 md:px-8 md:pb-20 md:pt-28">
      {/* ── Left: text ── */}
      <div className="max-w-[580px]">
        <p className="section-label mb-5">{eyebrow}</p>

        <h1 className="mb-6 font-[var(--font-display)] text-[clamp(40px,5.5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-ink)]">
          {title}
        </h1>

        <p className="mb-9 max-w-[560px] text-[clamp(16px,1.5vw,20px)] leading-[1.7] text-[var(--color-muted)]">
          {intro}
        </p>

        <dl className="mb-7 space-y-3.5 border-b border-[var(--color-border-soft)] pb-7">
          {metadata.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <dt className="min-w-[96px] text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                {label}
              </dt>
              <dd className="m-0 max-w-[420px] text-sm leading-[1.65] text-[var(--color-ink)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className={`flex flex-wrap gap-2 ${liveUrl ? "mb-5" : ""}`}>
          {tags.map((tag) => {
            const c = tagColor(tag);

            return (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium leading-[1.5] tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
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

      {/* ── Right: media — always 16:9 ── */}
      <div className="glass-card relative aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-white/60 bg-[#110f12] shadow-[0_18px_50px_rgba(44,24,16,0.12)]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_20%)] pointer-events-none" />
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
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,10,14,0.04)_45%,rgba(12,10,14,0.28)_100%)]" />
          </>
        ) : (
          <>
            <Image
              src={media.src}
              alt={media.alt ?? title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(12,10,14,0.02)_50%,rgba(12,10,14,0.18)_100%)]" />
          </>
        )}
      </div>
    </div>
  );
}