"use client";

import FadeIn from "@/components/FadeIn";

const cards = [
  {
    title: "Vinyl & Music",
    description:
      "I collect vinyl and often design while listening to instrumental or ambient music. Creating the right atmosphere helps me focus deeply when solving complex interface problems.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        {/* Vinyl record */}
        <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        <line x1="14" y1="7" x2="14" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
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
    <section id="learning" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <FadeIn>
          <p className="section-label mb-3">— Outside the Work</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 400,
              color: "#1A1814",
              lineHeight: 1.1,
              marginBottom: "40px",
            }}
          >
            Learning & Inspiration
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 80}>
              <div
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid rgba(26,24,20,0.08)",
                  background: "#F8F7F4",
                  height: "100%",
                  transition: "background 220ms ease, box-shadow 220ms ease, transform 220ms ease",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#FFFFFF";
                  el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.09)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#F8F7F4";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
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
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#1A1814",
                    lineHeight: 1.25,
                    marginBottom: "10px",
                  }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    color: "#6A6460",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
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
