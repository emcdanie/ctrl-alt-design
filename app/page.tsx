"use client";

import { useCallback } from "react";
import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import { WORK_ITEMS } from "@/lib/workLibrary";

/* ONE dashboard home (IA consolidation, 2026-07-16): the bubble board,
 * the current-focus piece, and the labeled path into the library.
 * Everything else lives on its own route — /work, /about, /point-of-view,
 * /contact, /case-studies/*. */
export default function Home() {
  const featured = WORK_ITEMS.find((i) => i.featured);

  const scrollToFeatured = useCallback(() => {
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main id="main-content">
      <OverlayNav />

      <Hero onEnterDashboard={scrollToFeatured} />

      {/* ── Current focus ── */}
      {featured && (
        <section id="featured" className="layout-section">
          <div className="layout-container">
            <header className="layout-header">
              <p className="eyebrow" style={{ marginBottom: "var(--spacing-4)" }}>
                — Current focus
              </p>
              <h2 style={{ fontSize: "var(--font-section-title)", lineHeight: 1.05 }}>
                {featured.title}
              </h2>
            </header>

            {/* Interim featured block — becomes the image-led CaseCard in the
                one-card consolidation step */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-4)",
                maxWidth: "65ch",
              }}
            >
              <p className="body-base" style={{ fontSize: "var(--font-body-size)" }}>
                {featured.impact}. {featured.ingredients.join(". ")}.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-3)" }}>
                <Link href={featured.href} className="btn-key btn-key--primary">
                  See the Design Lab <span aria-hidden="true">→</span>
                </Link>
                <Link href="/work" className="btn-key">
                  Browse the library <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
