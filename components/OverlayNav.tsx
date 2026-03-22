"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const menuItems = [
  { num: "01", label: "Work", href: "#work" },
  { num: "02", label: "Guardian", href: "/case-studies/guardian" },
  { num: "03", label: "Experience", href: "#experience" },
  { num: "04", label: "Get in Touch", href: "#contact" },
];

export default function OverlayNav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [triggerHovered, setTriggerHovered] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (href: string) => {
    setOpen(false);

    if (href.startsWith("#")) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[9995] px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-[24px] border border-[#1A1814]/10 bg-[#F6F1E8]/72 px-3 py-3 shadow-[0_18px_48px_rgba(26,24,20,0.08)] backdrop-blur-xl sm:px-4">
          <Link
            href="/"
            className="pointer-events-auto"
            onClick={() => setOpen(false)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1A1814]/10 bg-[#1A1814] text-white shadow-[0_10px_24px_rgba(26,24,20,0.18)] transition-all duration-200 hover:scale-[0.98] hover:opacity-85">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <text
                  x="3"
                  y="14"
                  fontFamily="'Clash Display', system-ui, sans-serif"
                  fontWeight="700"
                  fontSize="16"
                  fill="white"
                >
                  E
                </text>
              </svg>
            </div>
          </Link>

          <button
            data-cursor="nav"
            onClick={() => setOpen((o) => !o)}
            onMouseEnter={() => setTriggerHovered(true)}
            onMouseLeave={() => setTriggerHovered(false)}
            className="pointer-events-auto relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1A1814]/10 bg-white/45 text-[#1A1814] shadow-[0_10px_30px_rgba(26,24,20,0.08)] transition-all duration-200 hover:bg-white/60"
            style={{ cursor: "none" }}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className="absolute block h-[2px] rounded-full bg-current transition-all duration-200 ease-out"
              style={{
                width: triggerHovered && !open ? "24px" : "20px",
                transform: open ? "rotate(45deg)" : "translateY(-4px)",
              }}
            />
            <span
              className="absolute block h-[2px] w-6 rounded-full bg-current transition-all duration-200 ease-out"
              style={{
                opacity: open ? 0 : triggerHovered ? 1 : 0,
              }}
            />
            <span
              className="absolute block h-[2px] rounded-full bg-current transition-all duration-200 ease-out"
              style={{
                width: triggerHovered && !open ? "24px" : "20px",
                transform: open ? "rotate(-45deg)" : "translateY(4px)",
              }}
            />
          </button>
        </div>
      </div>

      <div
        className="fixed inset-0 z-[9990] overflow-hidden bg-[#F6F1E8]/98 text-[#1A1814] transition-[clip-path] duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{
          clipPath: open ? "inset(0% 0 0% 0)" : "inset(100% 0 0% 0)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(215,197,166,0.22),transparent_34%)]" />
        <div className="absolute left-6 right-6 top-6 h-px bg-[#1A1814]/8 sm:left-8 sm:right-8" />

        <div className="relative flex h-full flex-col justify-between px-6 pb-8 pt-28 sm:px-8 sm:pb-10 sm:pt-32 lg:px-16 lg:pb-14 lg:pt-36">
          <div
            className="pointer-events-none absolute right-[-16px] top-1/2 -translate-y-1/2 select-none font-[family:var(--font-display)] text-[clamp(120px,18vw,240px)] font-bold leading-none tracking-[-0.04em] text-[#E9E1D3]"
            aria-hidden="true"
          >
            EM
          </div>

          <nav className="relative z-10 max-w-5xl">
            {menuItems.map((item) => {
              const isHovered = hovered === item.num;
              const anyHovered = hovered !== null;
              const dimmed = anyHovered && !isHovered;

              const sharedClasses =
                "font-[family:var(--font-display)] text-[clamp(42px,8vw,96px)] font-normal leading-[1.02] tracking-[-0.02em] transition-colors duration-150";
              const colorClass = dimmed ? "text-[#9E9588]" : "text-[#1A1814]";

              return (
                <div
                  key={item.num}
                  className="group flex items-start gap-4 border-b border-[#1A1814]/8 py-4 sm:gap-6 sm:py-5 lg:gap-10"
                  onMouseEnter={() => setHovered(item.num)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="mt-2 min-w-14 font-[family:var(--font-body)] text-[11px] uppercase tracking-[0.24em] text-[#8B8276] sm:min-w-20">
                    (_{item.num})
                  </span>

                  {item.href.startsWith("#") ? (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`${sharedClasses} ${colorClass} bg-transparent p-0 text-left hover:text-[#5E554A]`}
                      style={{ cursor: "none" }}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`${sharedClasses} ${colorClass} block hover:text-[#5E554A]`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="relative z-10 mt-12 flex flex-col gap-3 sm:mt-16">
            <a
              href="mailto:elletamc@gmail.com"
              className="w-fit font-[family:var(--font-body)] text-sm text-[#7C7367] transition-colors duration-150 hover:text-[#1A1814]"
            >
              elletamc@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/elleta-mcdaniel"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit font-[family:var(--font-body)] text-xs uppercase tracking-[0.18em] text-[#7C7367] transition-colors duration-150 hover:text-[#1A1814]"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}