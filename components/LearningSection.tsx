"use client";

import FadeIn from "@/components/FadeIn";
import VinylPlayer from "@/components/VinylPlayer";

const podcasts = [
  {
    title: "Honest UX Talks",
    by: "Wix Studio",
    href: "https://podcasts.apple.com/es/podcast/honest-ux-talks-by-wix-studio/id1547832809?l=en-GB",
  },
  {
    title: "Patterns Podcast",
    by: "Design Patterns",
    href: "https://podcasts.apple.com/es/podcast/patterns-podcast/id1491843793?l=en-GB",
  },
  {
    title: "On Purpose",
    by: "Jay Shetty",
    href: "https://podcasts.apple.com/es/podcast/on-purpose-with-jay-shetty/id1450994021?l=en-GB",
  },
];

export default function LearningSection() {
  return (
    <section id="learning" className="layout-section">
      <div className="layout-container">

        <FadeIn>
          <div className="layout-header">
            <p className="section-label mb-3">— Outside the Work</p>
            <h2 className="heading-section">Learning &amp; Inspiration</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch" style={{ gap: "var(--grid-gap)" }}>
          {/* Vinyl player */}
          <FadeIn delay={0} className="h-full">
            <VinylPlayer />
          </FadeIn>

          {/* Podcasts */}
          <FadeIn delay={80} className="h-full">
            <div
              className="card-elevated card-interactive"
              style={{
                padding: "var(--spacing-6)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(26,24,20,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "var(--spacing-4)",
                  color: "var(--color-ink)",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                  <path d="M5 16v-4a9 9 0 0118 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="3" y="15" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="20" y="15" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>

              <h3 className="heading-item mb-2.5">Podcasts</h3>
              <p className="body-base" style={{ color: "var(--color-muted)", marginBottom: "var(--spacing-4)" }}>
                Design thinking, systems, and personal growth — what I listen to between projects.
              </p>

              {/* Body grows to fill — Rule 2 (.body { flex: 1 }) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)", flex: 1 }}>
                {podcasts.map((pod) => (
                  <a
                    key={pod.title}
                    href={pod.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--spacing-2)",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "rgba(26,24,20,0.04)",
                      textDecoration: "none",
                      transition: "background 150ms",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(26,24,20,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(26,24,20,0.04)"; }}
                  >
                    <div>
                      <p style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--typography-font-size-sm)",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        margin: 0,
                        lineHeight: 1.3,
                      }}>
                        {pod.title}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--typography-font-size-tag)",
                        color: "var(--color-muted)",
                        margin: "2px 0 0",
                      }}>
                        {pod.by}
                      </p>
                    </div>
                    <span style={{ fontSize: "var(--typography-font-size-tag)", color: "var(--color-muted)", flexShrink: 0 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
