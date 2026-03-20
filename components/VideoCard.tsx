"use client";

import { useState } from "react";

interface VideoCardProps {
  title: string;
  subtitle: string;
  tags: string[];
  gradient: string;
  embedUrl: string;
  videoSrc?: string;      // looping preview clip
  thumbnailSrc?: string;  // static image fallback
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
      className="rounded-2xl overflow-hidden bg-white/60 flex flex-col cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
      onClick={onClick}
    >
      {/* Thumbnail / video */}
      <div
        className="relative w-full aspect-video overflow-hidden"
        style={{ background: gradient }}
      >
        {/* Looping video preview — highest priority */}
        {videoSrc && (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Static image fallback (only if no videoSrc) */}
        {!videoSrc && thumbnailSrc && !imgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailSrc}
            alt={title}
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Gradient noise texture (when no video and no image) */}
        {!videoSrc && (!thumbnailSrc || imgFailed) && (
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "160px",
            }}
          />
        )}

        {/* Play button — always on top */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 3.5l10 5.5-10 5.5V3.5z" fill="#1A1814" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="section-label mb-3">EXPLORATION</p>
        <h3 className="font-display font-bold text-[#1A1814] mb-2 leading-snug" style={{ fontSize: "20px" }}>
          {title}
        </h3>
        <p className="leading-relaxed mb-4 flex-1" style={{ fontSize: "15px", color: "#8A8480" }}>
          {subtitle}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
