"use client";

import FadeIn from "@/components/FadeIn";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Elleta consistently brings clarity to complex product problems and builds systems that scale.",
    name: "Product Manager",
    role: "BizAway",
  },
  {
    quote:
      "She approaches design system work with the right mix of rigour and pragmatism — always grounded in real engineering constraints.",
    name: "Engineering Lead",
    role: "BizAway",
  },
  {
    quote:
      "Her ability to translate messy stakeholder requirements into clear, navigable prototypes was exceptional.",
    name: "ICTS Stakeholder",
    role: "United Nations Office at Geneva",
  },
];

function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  return (
    <FadeIn delay={delay}>
      <div
        className="card-elevated"
        style={{
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--color-ink)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          &ldquo;{t.quote}&rdquo;
        </p>
        <div style={{ marginTop: "auto" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--color-ink)",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            — {t.name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--color-muted)",
              margin: "2px 0 0",
            }}
          >
            {t.role}
          </p>
        </div>
      </div>
    </FadeIn>
  );
}

export default function TestimonialSection() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-10">
            <p className="section-label mb-3">— Social Proof</p>
            <h2 className="heading-section">Trusted by product teams</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name + t.role} t={t} delay={i * 60} />
          ))}
        </div>

        <FadeIn delay={200}>
          <div style={{ marginTop: "24px" }}>
            <a
              href="https://www.linkedin.com/in/elletamcdaniel/details/recommendations/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--color-muted)",
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-ink)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-muted)"; }}
            >
              View all recommendations →
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
