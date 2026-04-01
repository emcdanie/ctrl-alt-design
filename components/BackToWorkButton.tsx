"use client";

import Link from "next/link";

export default function BackToWorkButton() {
  return (
    <Link
      href="/#work"
      className="fixed left-5 z-[40] inline-flex items-center gap-2 rounded-full bg-[#1A1814] px-4 py-2.5 text-[13px] font-semibold tracking-[0.02em] text-[#EDE8DF] shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:opacity-100 sm:left-6"
      style={{
        top: "calc(var(--header-height) + 24px)",
        fontFamily: "var(--font-body)",
        opacity: 0.9,
      }}
    >
      &larr; Back to Work
    </Link>
  );
}
