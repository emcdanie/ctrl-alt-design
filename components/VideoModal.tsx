"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  /* Focus management — capture opener, focus the dialog, restore on close */
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeBtnRef.current?.focus();
    } else {
      openerRef.current?.focus();
      openerRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        className="relative w-full max-w-[900px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute -top-9 right-0 flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-[length:var(--typography-font-size-tag)] font-medium tracking-wide cursor-pointer"
        >
          Close
          <Icon name="Xmark" size="sm" />
        </button>

        {/* Video — standard 16:9 */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-black"
          style={{ paddingTop: "56.25%", height: 0 }}
        >
          <iframe
            src={src}
            title={title}
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
          <h3 id="video-modal-title" className="font-display font-bold text-white text-[length:var(--font-card-title)] mb-2 leading-snug">
            {title}
          </h3>
          <p className="text-white/55 text-[length:var(--typography-font-size-base)] leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[length:var(--typography-font-size-tag)] text-white/50 border border-white/15 px-2.5 py-1 rounded-full"
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
