"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* The one reveal (polish pass, 19 Sep 2026): marks `.reveal` elements and
   the children of `.reveal-group` as revealed the first time they enter
   the viewport (threshold .15, bottom margin -5%), once. The hiding
   itself is CSS under html.js-reveal, which a pre-paint script sets, so
   without JS nothing is ever hidden. Runs again on each route change. */
export default function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal:not(.is-revealed), .reveal-group > :not(.is-revealed)");
    if (!items.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
