"use client";

import FadeIn from "@/components/FadeIn";

/* ── Featured excerpt (shorter, scannable) ──────────────────────── */
const featured = {
  paragraphs: [
    "Straight up: Elleta is awesome. When I met her at a conference, she immediately expressed her desire to dive into substantive design systems work, which stuck with me.",
    "We\u2019ve thrown everything and the kitchen sink at her, and she\u2019s surprised and delighted us with her ability to make things happen while also being thoughtful and thorough. She sweats the details.",
    "She\u2019s now with us on the bleeding edge of AI & design systems, embracing new tools and ways of working. Any team would be lucky to have Elleta join their crew.",
  ],
  name: "Brad Frost",
  role: "Creator of Atomic Design",
  url: "https://bradfrost.com",
  linkedIn:
    "https://www.linkedin.com/in/elletamcdaniel/details/recommendations/",
};

/* ── Supporting quotes ──────────────────────────────────────────── */
const supporting = [
  {
    quote:
      "Elleta consistently brings clarity to complex product problems and builds systems that scale.",
    name: "Product Manager",
    role: "BizAway",
    initials: "PM",
  },
  {
    quote:
      "She approaches design system work with the right mix of rigour and pragmatism \u2014 always grounded in real engineering constraints.",
    name: "Engineering Lead",
    role: "BizAway",
    initials: "EL",
  },
  {
    quote:
      "Her ability to translate messy stakeholder requirements into clear, navigable prototypes was exceptional.",
    name: "ICTS Stakeholder",
    role: "United Nations Office at Geneva",
    initials: "IS",
  },
];

/* ── Supporting card ──────────────────────────────────────────────── */
function SupportingCard({
  quote,
  name,
  role,
  initials,
  delay,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
  delay: number;
}) {
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
        {/* Quote mark */}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            lineHeight: 1,
            color: "var(--color-accent-gold)",
            opacity: 0.6,
            userSelect: "none",
          }}
          aria-hidden
        >
          &ldquo;
        </span>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 400,
            color: "var(--color-ink-soft)",
            lineHeight: 1.7,
            margin: 0,
            flex: 1,
          }}
        >
          {quote}
        </p>

        {/* Attribution */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "auto",
            paddingTop: "12px",
            borderTop: "1px solid var(--color-border-soft)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--color-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--color-ink-muted)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.02em",
            }}
          >
            {initials}
          </div>
          <div>
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
              {name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "var(--color-muted)",
                margin: "1px 0 0",
                lineHeight: 1.4,
              }}
            >
              {role}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ── Section ────────────────────────────────────────────────────── */
export default function TestimonialSection() {
  return (
    <section className="layout-section">
      <div className="layout-container">
        {/* ── Header ─────────────────────────────────────────────── */}
        <FadeIn>
          <div className="layout-header">
            <p className="section-label" style={{ marginBottom: "10px" }}>
              &mdash; Social Proof
            </p>
            <h2 className="heading-section">Trusted by product teams</h2>
          </div>
        </FadeIn>

        {/* ── Featured — Brad Frost ──────────────────────────────── */}
        <FadeIn delay={60}>
          <div
            className="glass-card"
            style={{
              padding: "clamp(32px, 4vw, 48px)",
              maxWidth: "720px",
              margin: "0 auto 48px auto",
              position: "relative",
            }}
          >
            {/* Decorative top accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "clamp(32px, 4vw, 48px)",
                width: "48px",
                height: "3px",
                background:
                  "linear-gradient(90deg, var(--color-accent-gold), transparent)",
                borderRadius: "0 0 2px 2px",
              }}
            />

            {/* Avatar + label row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--color-accent-gold) 0%, #8a6e4a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#1A1814",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.02em",
                }}
              >
                BF
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {featured.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    color: "var(--color-muted)",
                    margin: "2px 0 0",
                    lineHeight: 1.4,
                  }}
                >
                  {featured.role}
                </p>
              </div>
            </div>

            {/* Large quote mark */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "56px",
                lineHeight: 0.8,
                color: "var(--color-accent-gold)",
                opacity: 0.35,
                display: "block",
                marginBottom: "4px",
                userSelect: "none",
              }}
              aria-hidden
            >
              &ldquo;
            </span>

            {/* Excerpt paragraphs — editorial body font, not display */}
            <blockquote style={{ margin: 0 }}>
              {featured.paragraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(18px, 1.8vw, 22px)",
                    fontWeight: 400,
                    color: "var(--color-ink-soft)",
                    lineHeight: 1.75,
                    margin: i === 0 ? 0 : "14px 0 0",
                    maxWidth: "640px",
                  }}
                >
                  {para}
                </p>
              ))}
            </blockquote>

            {/* Read more link */}
            <div style={{ marginTop: "28px" }}>
              <a
                href={featured.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--color-accent-gold)",
                  textDecoration: "none",
                  transition: "opacity 150ms",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Read full recommendation
                <span aria-hidden style={{ fontSize: "14px" }}>
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        </FadeIn>

        {/* ── Supporting cards — 3-column grid ────────────────────── */}
        <div className="layout-grid-3">
          {supporting.map((t, i) => (
            <SupportingCard
              key={t.name + t.role}
              quote={t.quote}
              name={t.name}
              role={t.role}
              initials={t.initials}
              delay={120 + i * 60}
            />
          ))}
        </div>

        {/* View all link */}
        <FadeIn delay={340}>
          <div style={{ marginTop: "28px" }}>
            <a
              href={featured.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--color-muted)",
                textDecoration: "none",
                transition: "color 150ms",
                letterSpacing: "0.02em",
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
