"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function BackToWorkButton() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
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

  return (
    <Link
      href="/#work"
      className="fixed left-5 z-[40] inline-flex items-center gap-2 rounded-full bg-[#1A1814] px-4 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-[#EDE8DF] shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all duration-300 hover:opacity-100 sm:left-6"
      style={{
        top: "calc(var(--header-height) + 12px)",
        fontFamily: "var(--font-body)",
        opacity: 0.9,
        transform: hidden ? "translateY(-140px)" : "translateY(0)",
      }}
    >
      ← Back to Work
    </Link>
  );
}
