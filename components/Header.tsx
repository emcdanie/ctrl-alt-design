"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-300 ease-in-out ${
        scrolled ? "px-4 pt-2 sm:px-6 sm:pt-2.5" : "px-4 pt-4 sm:px-6 sm:pt-5"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-[24px] border px-4 shadow-[0_18px_44px_rgba(26,24,20,0.06)] backdrop-blur-xl transition-all duration-300 sm:px-5 ${
          scrolled
            ? "border-[#1A1814]/12 bg-[#F6F1E8]/92 py-2"
            : "border-[#1A1814]/8 bg-[#F6F1E8]/72 py-3.5"
        }`}
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
              className="border-none bg-transparent p-0 text-[14px] tracking-[-0.01em] text-[#5D544A] transition-colors hover:text-[#1A1814]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onResumeClick}
          className="rounded-full border border-[#1A1814]/10 bg-[#1A1814] px-4 py-2 text-[13px] font-medium text-[#F6F1E8] shadow-[0_10px_24px_rgba(26,24,20,0.16)] transition-all duration-200 hover:-translate-y-px hover:opacity-90"
        >
          Resume
        </button>
      </div>
    </header>
  );
}
