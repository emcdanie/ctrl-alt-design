/**
 * VideoSection
 *
 * Renders a responsive 16:9 video embed (Loom, YouTube, Vimeo, or any iframe src).
 * Accepts an optional label, heading, and description above the player.
 *
 * Usage in a case study page:
 *   <VideoSection
 *     embedUrl="https://www.loom.com/embed/abc123"
 *     label="WALKTHROUGH"
 *     heading="Watch the Design Walkthrough"
 *   />
 */

interface VideoSectionProps {
  embedUrl: string;
  /** Small uppercase label above the heading */
  label?: string;
  heading?: string;
  description?: string;
  /** Override the iframe title for accessibility. Defaults to heading or "Video walkthrough". */
  iframeTitle?: string;
  className?: string;
}

export default function VideoSection({
  embedUrl,
  label,
  heading,
  description,
  iframeTitle,
  className = "",
}: VideoSectionProps) {
  const title = iframeTitle ?? heading ?? "Video walkthrough";

  return (
    <div className={`w-full ${className}`.trim()}>
      {/* Optional text header */}
      {(label || heading || description) && (
        <div className="mb-7">
          {label && (
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted,#8A8A8A)]">
              {label}
            </p>
          )}
          {heading && (
            <h2
              className="font-[var(--font-display)] font-normal leading-[1.2] text-[var(--color-ink,#1A1A1A)]"
              style={{ fontSize: "clamp(24px,3.2vw,36px)" }}
            >
              {heading}
            </h2>
          )}
          {description && (
            <p className="mt-3 text-[15px] leading-[1.75] text-[var(--color-muted,#5D5852)]">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Responsive 16:9 container */}
      <div className="relative w-full overflow-hidden rounded-[20px] border border-black/[0.08] bg-[#0d0d0d] shadow-[0_18px_48px_rgba(0,0,0,0.12)]" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-none"
        />
      </div>
    </div>
  );
}
