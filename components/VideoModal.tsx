"use client";

import { useEffect } from "react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedUrl: string;
  title: string;
  description: string;
  tags: string[];
}

export default function VideoModal({
  isOpen,
  onClose,
  embedUrl,
  title,
  description,
  tags,
}: VideoModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Append Loom params to hide player chrome
  const src = `${embedUrl}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(10, 9, 8, 0.92)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[900px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-9 right-0 flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-[13px] font-medium tracking-wide cursor-pointer"
        >
          Close
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Video — standard 16:9 */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-black"
          style={{ paddingTop: "56.25%", height: 0 }}
        >
          <iframe
            src={src}
            frameBorder="0"
            allowFullScreen
            allow="fullscreen"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>

        {/* Info */}
        <div className="mt-6">
          <h3 className="font-display font-bold text-white text-[1.2rem] mb-2 leading-snug">
            {title}
          </h3>
          <p className="text-white/55 text-[14px] leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[13px] text-white/50 border border-white/15 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
