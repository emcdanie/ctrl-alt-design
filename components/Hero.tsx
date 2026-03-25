"use client";

export default function Hero() {
  return (
    <section
      style={{
        paddingTop: "clamp(96px, 12vh, 140px)",
        paddingBottom: "var(--space-lg)",
        paddingLeft: "var(--space-md)",
        paddingRight: "var(--space-md)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>

        {/* Eyebrow */}
        <p className="eyebrow" style={{ marginBottom: "var(--space-md)" }}>
          Product Designer — Design Systems &amp; AI
        </p>

        {/* Name */}
        <h1 className="heading-display" style={{ margin: "0 0 var(--space-md) 0" }}>
          Elleta McDaniel
        </h1>

        {/* Tagline */}
        <p
          className="body-lg"
          style={{
            fontSize: "18px",
            color: "var(--color-muted)",
            lineHeight: 1.6,
            maxWidth: "520px",
            margin: "0 auto var(--space-md)",
          }}
        >
          I design scalable systems, intuitive workflows, and structured design
          languages that bring clarity to complex digital products.
        </p>

        {/* CTA */}
        <a
          href="#work"
          className="surface-dark"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "999px",
            padding: "14px 28px",
            textDecoration: "none",
            transition: "opacity 200ms ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          View my work ↓
        </a>
      </div>
    </section>
  );
}
