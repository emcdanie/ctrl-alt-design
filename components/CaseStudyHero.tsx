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
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px 24px 64px" }}
    >
      {/* ── Left: text ── */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#8A8A8A",
            marginBottom: "20px",
          }}
        >
          {eyebrow}
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            color: "#1A1A1A",
            margin: "0 0 24px 0",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(16px, 1.5vw, 20px)",
            color: "#555555",
            lineHeight: 1.65,
            maxWidth: "560px",
            marginBottom: "36px",
          }}
        >
          {intro}
        </p>

        {/* Metadata */}
        <dl
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "28px",
            paddingBottom: "28px",
            borderBottom: "1px solid rgba(26,24,20,0.10)",
          }}
        >
          {metadata.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
              <dt
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#AAAAAA",
                  minWidth: "90px",
                  flexShrink: 0,
                }}
              >
                {label}
              </dt>
              <dd
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "#1A1A1A",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: liveUrl ? "20px" : 0 }}>
          {tags.map(tag => {
            const c = tagColor(tag);
            return (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: c.bg,
                  color: c.color,
                  letterSpacing: "0.02em",
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
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#1A1814",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Live preview ↗
          </a>
        )}
      </div>

      {/* ── Right: media — always 16:9 ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: "20px",
          overflow: "hidden",
          background: "#0A0A1C",
          boxShadow: "0 16px 64px rgba(0,0,0,0.18)",
        }}
      >
        {media.type === "video" ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={media.src} type="video/mp4" />
            </video>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.32) 100%)",
              }}
            />
          </>
        ) : (
          <Image
            src={media.src}
            alt={media.alt ?? title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
    </div>
  );
}
