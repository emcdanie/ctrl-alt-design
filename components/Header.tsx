"use client";

import { useEffect, useState, useRef } from "react";

interface HeaderProps {
  onResumeClick: () => void;
}

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Design Lab", href: "#design-lab" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Header({ onResumeClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Hide on scroll down, show on scroll up
      if (y > 80 && y > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-in-out"
      style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div
        className={`flex w-full items-center justify-between border-b px-5 backdrop-blur-xl transition-all duration-300 sm:px-8 ${
          scrolled
            ? "border-[#1A1814]/8 bg-[#F6F1E8]/88 py-2.5 shadow-[0_1px_12px_rgba(26,24,20,0.06)]"
            : "border-[#1A1814]/5 bg-[#F6F1E8]/60 py-3.5 shadow-none"
        }`}
        style={{ borderTop: "1px solid rgba(255,255,255,0.6)" }}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-[15px] font-semibold tracking-[-0.02em] text-[#1A1814] transition-opacity hover:opacity-70"
        >
          Elleta McDaniel
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="border-none bg-transparent p-0 text-[13px] tracking-[-0.01em] text-[#5D544A]/80 transition-colors hover:text-[#1A1814]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onResumeClick}
          className="rounded-full border border-[#1A1814]/10 bg-[#1A1814] px-4 py-2 text-[13px] font-medium text-[#F6F1E8] shadow-[0_4px_12px_rgba(26,24,20,0.12)] transition-all duration-200 hover:-translate-y-px hover:opacity-90"
        >
          Resume
        </button>
      </div>
    </header>
  );
}
