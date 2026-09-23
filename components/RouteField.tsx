"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { routeSeed, SECTION_FIELDS } from "@/lib/patternSeed";

/* The page's pattern fields (PatternField brief, 22 Sep 2026). The seed
   comes from the pathname (lib/patternSeed). The hero field sits
   at the top of the page; each later top-level section gets one quieter
   field behind its heading (seed = route seed + section index). None in
   the nav or footer: both sit outside main. The art is BELLA's pattern,
   served as a static SVG from /pattern/ (app/pattern/[file]/route.ts). */

export default function RouteField() {
  const seed = routeSeed(usePathname() ?? "/");

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main:not(.embed-page) .l-section")].filter(
      (s) => !s.parentElement?.closest(".l-section"),
    );
    const fielded = sections.slice(1, 1 + SECTION_FIELDS);
    fielded.forEach((s, i) => {
      s.style.setProperty("--section-field", `url(/pattern/${seed + i + 1}-quiet.svg)`);
      s.dataset.field = "";
    });
    return () =>
      fielded.forEach((s) => {
        s.style.removeProperty("--section-field");
        delete s.dataset.field;
      });
  }, [seed]);

  return (
    <div
      className="hero-field"
      aria-hidden="true"
      style={{ "--hero-field": `url(/pattern/${seed}.svg)` } as React.CSSProperties}
    />
  );
}
