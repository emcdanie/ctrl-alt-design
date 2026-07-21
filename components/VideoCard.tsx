"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { StatusPill } from "@/components/ui/StatusPill";

/**
 * Lab video card, on the ONE Card system (button variant: opens the
 * video modal). Cover media with the token scrim; play affordance over
 * the media; eyebrow / title / one-liner / tags in the body.
 */
export default function VideoCard({
  title,
  subtitle,
  tags,
  gradient,
  videoSrc,
  thumbnailSrc,
  maturity,
  onClick,
}: {
  title: string;
  subtitle: string;
  tags: string[];
  gradient: string;
  videoSrc?: string;
  thumbnailSrc?: string;
  /** honest maturity chip (Elleta, 21 Jul; taxonomy in DESIGN.md) */
  maturity: string;
  onClick: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Card
      onClick={onClick}
      className="h-full"
      ariaLabel={`Play video: ${title}`}
      media={
        <span style={{ display: "block", position: "absolute", inset: 0, background: gradient }}>
          {videoSrc && (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {!videoSrc && thumbnailSrc && !imgFailed && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailSrc} alt="" loading="lazy" onError={() => setImgFailed(true)} />
          )}
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border border-[color:var(--color-alpha-glass-48)] bg-[color:var(--color-alpha-glass-82)] shadow-[var(--shadow-card-elevated)] backdrop-blur-md"
            >
              <Icon name="Play" size="md" style={{ color: "var(--ink-on-paper)" }} />
            </span>
          </span>
        </span>
      }
    >
      {/* the old hardcoded "Exploration" eyebrow is now the honest
          maturity StatusPill from the data (21 Jul) */}
      <span><StatusPill>{maturity}</StatusPill></span>
      {/* the ONE content-card title recipe (conformance, 21 Jul) */}
      <h3 className="heading-item" style={{ margin: 0 }}>
        {title}
      </h3>
      <p
        className="flex-1 text-[length:var(--typography-font-size-base)] leading-[1.72] text-[color:var(--color-ink-muted)]"
        style={{ margin: 0 }}
      >
        {subtitle}
      </p>
      <span className="flex flex-wrap items-center gap-2">
        {tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </span>
    </Card>
  );
}
