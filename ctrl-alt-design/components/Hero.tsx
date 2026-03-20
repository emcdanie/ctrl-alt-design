"use client";

export default function Hero() {
  return (
    <section style={{ paddingTop: "120px", paddingBottom: "40px", paddingLeft: "24px", paddingRight: "24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>

        {/* Eyebrow */}
        <p className="eyebrow" style={{ marginBottom: "24px" }}>
          Product Designer — Design Systems &amp; AI
        </p>

        {/* Name */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(64px, 9vw, 96px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            color: "#1A1A1A",
            margin: "0 0 32px 0",
          }}
        >
          Elleta McDaniel
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "18px",
            fontWeight: 400,
            color: "#666666",
            lineHeight: 1.6,
            maxWidth: "520px",
            margin: "0 auto 32px",
          }}
        >
          I design scalable systems, intuitive workflows, and structured design
          languages that bring clarity to complex digital products.
        </p>

        {/* CTA */}
        <a
          href="#work"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 500,
            color: "#FFFFFF",
            background: "#1A1A1A",
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
