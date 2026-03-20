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
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#EDE8DF]/90 backdrop-blur-md border-b border-[#1A1814]/8"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="text-[15px] font-semibold text-[#1A1814] tracking-tight hover:opacity-70 transition-opacity"
        >
          Elleta McDaniel
        </a>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-[15px] text-[#4A4640] hover:text-[#1A1814] transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Resume CTA */}
        <button
          onClick={onResumeClick}
          className="bg-[#1A1814] text-[#EDE8DF] text-[14px] font-medium px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
        >
          Resume
        </button>
      </div>
    </header>
  );
}
