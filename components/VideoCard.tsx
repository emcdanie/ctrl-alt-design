"use client";

import { useState } from "react";

interface VideoCardProps {
  title: string;
  subtitle: string;
  tags: string[];
  gradient: string;
  embedUrl: string;
  videoSrc?: string;
  thumbnailSrc?: string;
  onClick: () => void;
}

export default function VideoCard({
  title,
  subtitle,
  tags,
  gradient,
  videoSrc,
  thumbnailSrc,
  onClick,
}: VideoCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-black/6 bg-white/[0.68] shadow-[0_12px_30px_rgba(44,24,16,0.05),0_2px_8px_rgba(44,24,16,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(44,24,16,0.1),0_8px_18px_rgba(44,24,16,0.06)]"
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden" style={{ background: gradient }}>
        {videoSrc && (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}

        {!videoSrc && thumbnailSrc && !imgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailSrc}
            alt={title}
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}

        {!videoSrc && (!thumbnailSrc || imgFailed) && (
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "url(data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E)",
              backgroundSize: "160px",
            }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_28%)]" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/82 shadow-[0_18px_42px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 3.5l10 5.5-10 5.5V3.5z" fill="#1A1814" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="section-label mb-3">EXPLORATION</p>
        <h3 className="font-display mb-2 text-[20px] font-bold leading-snug text-[#1A1814]">
          {title}
        </h3>
        <p className="mb-4 flex-1 text-[15px] leading-[1.72] text-[#8A8480]">
          {subtitle}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}