"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";

/* ── Featured quote — two strongest sentences shown by default, the
      full recommendation behind an in-place disclosure ────────────── */
const featured = {
  excerpt:
    "Straight up: Elleta is awesome. Any team would be lucky to have Elleta join their crew.",
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
    role: "***REMOVED***",
    initials: "PM",
  },
  {
    quote:
      "She approaches design system work with the right mix of rigour and pragmatism \u2014 always grounded in real engineering constraints.",
    name: "Engineering Lead",
    role: "***REMOVED***",
    initials: "EL",
  },
  {
    quote:
      "Her ability to translate messy stakeholder requirements into clear, navigable prototypes was exceptional.",
    name: "ICTS Stakeholder",
    role: "A UN agency, Geneva",
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
    <FadeIn delay={delay} distance={4}>
      <div
        className="card-elevated"
        style={{
          padding: "var(--spacing-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-4)",
          height: "100%",
        }}
      >
        {/* Quote mark — soft periwinkle tint */}
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            lineHeight: 1,
            color: "var(--color-semantic-accent)",
            opacity: 0.4,
            userSelect: "none",
          }}
          aria-hidden
        >
          &ldquo;
        </span>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--typography-font-size-sm)",
            fontWeight: "var(--typography-font-weight-regular)",
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
            paddingTop: "var(--spacing-3)",
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
              fontSize: "var(--typography-font-size-tag)",
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
                fontSize: "var(--typography-font-size-tag)",
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
                fontSize: "var(--typography-font-size-tag)",
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
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="layout-section">
      <div className="layout-container">
        {/* ── Header ─────────────────────────────────────────────── */}
        <FadeIn distance={4}>
          <div className="layout-header">
            <p className="section-label" style={{ marginBottom: "10px" }}>
              &mdash; Social Proof
            </p>
            <h2 className="heading-section">Trusted by product teams</h2>
          </div>
        </FadeIn>

        {/* ── Featured — Brad Frost ──────────────────────────────── */}
        <FadeIn delay={60} distance={4}>
          <div
            className="glass-card"
            style={{
              padding: "var(--spacing-8)",
              maxWidth: "720px",
              margin: "0 auto var(--spacing-8) auto",
              position: "relative",
            }}
          >
            {/* Decorative top accent — periwinkle tint, not full strength */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "var(--spacing-8)",
                width: "48px",
                height: "3px",
                background:
                  "linear-gradient(90deg, var(--color-semantic-accent-border), transparent)",
                borderRadius: "0 0 2px 2px",
              }}
            />

            {/* Avatar + label row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "var(--spacing-5)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  /* soft periwinkle tint; ink initials stay AAA on it */
                  background: "var(--color-semantic-accent-subtle)",
                  border: "1px solid var(--color-semantic-accent-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "var(--typography-font-size-base)",
                  fontWeight: "var(--typography-font-weight-bold)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "var(--typography-letter-spacing-tight)",
                }}
              >
                BF
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--typography-font-size-sm)",
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
                    fontSize: "var(--typography-font-size-tag)",
                    color: "var(--color-muted)",
                    margin: "2px 0 0",
                    lineHeight: 1.4,
                  }}
                >
                  {featured.role}
                </p>
              </div>
            </div>

            {/* Quote mark — soft periwinkle tint */}
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--typography-font-size-4xl)",
                lineHeight: 0.8,
                color: "var(--color-semantic-accent)",
                opacity: 0.25,
                display: "block",
                marginBottom: "var(--spacing-1)",
                userSelect: "none",
              }}
              aria-hidden
            >
              &ldquo;
            </span>

            {/* Excerpt — two sentences by default; the full recommendation
                expands in place so no content leaves the page */}
            <blockquote style={{ margin: 0 }}>
              {(expanded ? featured.paragraphs : [featured.excerpt]).map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "18px",
                    fontWeight: "var(--typography-font-weight-regular)",
                    color: "var(--color-ink-soft)",
                    lineHeight: 1.65,
                    margin: i === 0 ? 0 : "12px 0 0",
                    maxWidth: "640px",
                  }}
                >
                  {para}
                </p>
              ))}
            </blockquote>

            {/* Disclosure — full quote stays on the page */}
            <div style={{ marginTop: "var(--spacing-5)" }}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpanded((e) => !e)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--typography-font-size-tag)",
                  fontWeight: "var(--typography-font-weight-medium)",
                  /* iris accent as TEXT — periwinkle stays fill-only */
                  color: "var(--color-accent-ink)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  transition: "opacity 150ms",
                  letterSpacing: "0.02em",
                  minHeight: "var(--spacing-touch-target)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {expanded ? "Show less" : "Read full recommendation"}
                <span aria-hidden style={{ fontSize: "var(--typography-font-size-sm)" }}>
                  {expanded ? "↑" : "↓"}
                </span>
              </button>
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
        <FadeIn delay={340} distance={4}>
          <div style={{ marginTop: "28px" }}>
            <a
              href={featured.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: "var(--typography-font-weight-medium)",
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
