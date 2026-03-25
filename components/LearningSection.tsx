"use client";

import FadeIn from "@/components/FadeIn";
import VinylPlayer from "@/components/VinylPlayer";

const cards = [
  {
    title: "Podcasts",
    description:
      "I regularly listen to design and product podcasts exploring systems thinking, AI tools, and modern product workflows.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        {/* Headphones */}
        <path d="M5 16v-4a9 9 0 0118 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="15" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="15" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Conferences & Learning",
    description:
      "Continuous learning is central to my practice. I regularly attend design workshops and conferences including Smashing Magazine's Smart Interface Design Patterns and Into Design Systems.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        {/* Open book */}
        <path d="M14 6C14 6 9 4 4 6v16c5-2 10 0 10 0s5-2 10 0V6c-5-2-10 0-10 0z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="14" y1="6" x2="14" y2="22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function LearningSection() {
  return (
    <section id="learning" className="py-20 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <FadeIn>
          <div className="mb-12">
            <p className="section-label mb-3">— Outside the Work</p>
            <h2 className="heading-section">Learning &amp; Inspiration</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Vinyl player replaces the old static music card */}
          <FadeIn delay={0}>
            <VinylPlayer />
          </FadeIn>

          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={(i + 1) * 80}>
              <div
                className="card-elevated card-interactive"
                style={{
                  padding: "24px",
                  height: "100%",
                  cursor: "default",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(26,24,20,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    color: "#1A1814",
                  }}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="heading-item mb-2.5">{card.title}</h3>

                {/* Description */}
                <p className="body-base m-0" style={{ color: "var(--color-muted)" }}>
                  {card.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
