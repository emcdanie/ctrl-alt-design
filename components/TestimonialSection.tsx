"use client";

import FadeIn from "@/components/FadeIn";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const featuredTestimonial = {
  quote:
    "Straight up: Elleta is awesome. When I met her at a conference, she immediately expressed her desire to dive into substantive design systems work, which stuck with me.\n\nSo when we had the opportunity to bring passionate people into our design systems\u2013centric fold, I immediately reached out to her. What a great decision!\n\nWe\u2019ve thrown everything and the kitchen sink at her, and she\u2019s surprised and delighted us with her ability to Make Things Happen while also being thoughtful and thorough. She sweats the details.\n\nShe\u2019s now with us on the bleeding edge of AI & design systems, embracing new tools and ways of working. It\u2019s been such a joy to see her build her confidence and embrace her true designer superpowers.\n\nBut above all, she\u2019s a fantastic, kind, caring, and funny person, which is why we love keeping her around! Any team would be lucky to have Elleta join their crew.",
  name: "Brad Frost",
  role: "Creator of Atomic Design",
  url: "https://bradfrost.com",
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Elleta consistently brings clarity to complex product problems and builds systems that scale.",
    name: "Product Manager",
    role: "BizAway",
  },
  {
    quote:
      "She approaches design system work with the right mix of rigour and pragmatism \u2014 always grounded in real engineering constraints.",
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
            &mdash; {t.name}
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
            <p className="section-label mb-3">&mdash; Social Proof</p>
            <h2 className="heading-section">Trusted by product teams</h2>
          </div>
        </FadeIn>

        {/* Featured testimonial — Brad Frost */}
        <FadeIn delay={60}>
          <div
            className="glass-card mb-8"
            style={{ padding: "32px 28px", maxWidth: "800px" }}
          >
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
              {/* Avatar */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #b8956a 0%, #8a6e4a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#1A1814",
                  fontFamily: "var(--font-display)",
                }}
              >
                BF
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Quote */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "var(--color-ink)",
                    lineHeight: 1.65,
                    marginBottom: "20px",
                  }}
                >
                  {featuredTestimonial.quote.split("\n\n").map((para, i) => (
                    <p key={i} style={{ margin: i === 0 ? 0 : "12px 0 0" }}>
                      {i === 0 ? "\u201c" : ""}
                      {para}
                      {i === featuredTestimonial.quote.split("\n\n").length - 1
                        ? "\u201d"
                        : ""}
                    </p>
                  ))}
                </div>

                {/* Attribution */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div>
                    <a
                      href={featuredTestimonial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        textDecoration: "none",
                      }}
                    >
                      {featuredTestimonial.name} ↗
                    </a>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        color: "var(--color-muted)",
                        margin: "2px 0 0",
                      }}
                    >
                      {featuredTestimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Supporting testimonials */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name + t.role} t={t} delay={(i + 1) * 60} />
          ))}
        </div>

        <FadeIn delay={300}>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-muted)";
              }}
            >
              View all recommendations &rarr;
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
