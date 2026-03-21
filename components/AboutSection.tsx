"use client";

const collaborationCards = [
  {
    title: "I push back respectfully",
    description: "If I think a brief is solving the wrong problem, I'll say so — with evidence, not just instinct. I'd rather surface a challenge early than deliver the wrong thing on time.",
  },
  {
    title: "I get obsessed with solving complex problems",
    description: "Ambiguity doesn't slow me down — it focuses me. I thrive in systems with competing constraints, unclear requirements, and high stakes.",
  },
  {
    title: "I ask for early feedback",
    description: "I share rough work early and often. A scrappy concept that starts a conversation is worth more than a polished direction no one saw coming.",
  },
  {
    title: "I advocate for both users and the business",
    description: "Good design solves for both. I don't treat business goals as a compromise — I treat them as part of the design problem.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* ── Left column ── */}
          <div>
            {/* Profile photo */}
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              overflow: "hidden",
              marginBottom: "24px",
              background: "#D8D4CC",
              border: "3px solid rgba(26,24,20,0.08)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/profile.jpg"
                alt="Elleta"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { (e.currentTarget.parentElement as HTMLElement).style.background = "#C8C4BC"; e.currentTarget.style.display = "none"; }}
              />
            </div>

            <p className="section-label mb-3">— About</p>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: "#1A1814",
                lineHeight: 1.1,
                marginBottom: "24px",
              }}
            >
              Hey, I'm Elleta
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "520px" }}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: "#4A4640", lineHeight: 1.75 }}>
                I'm a product designer who works at the intersection of systems thinking and interaction design. I care about building things that are coherent, scalable, and genuinely useful — not just polished.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: "#4A4640", lineHeight: 1.75 }}>
                Most of my recent work has been in B2B SaaS — design systems, complex data interfaces, and multi-role platforms where the user journey is rarely linear and the stakes are high.
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: "#4A4640", lineHeight: 1.75 }}>
                I'm at my best when I'm working on hard problems with people who care about getting them right.
              </p>
            </div>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/elleta"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "32px",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#1A1814",
                textDecoration: "none",
                border: "1px solid rgba(26,24,20,0.2)",
                borderRadius: "999px",
                padding: "10px 20px",
                transition: "background 150ms ease, border-color 150ms ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#1A1814";
                e.currentTarget.style.color = "#EDE8DF";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#1A1814";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Connect on LinkedIn
            </a>
          </div>

          {/* ── Right column ── */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(24px, 3vw, 32px)",
                fontWeight: 700,
                color: "#1A1814",
                lineHeight: 1.1,
                marginBottom: "24px",
              }}
            >
              Working with me
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {collaborationCards.map((card) => (
                <div
                  key={card.title}
                  style={{
                    padding: "20px 24px",
                    borderRadius: "14px",
                    border: "1px solid rgba(26,24,20,0.08)",
                    background: "#F8F7F4",
                    cursor: "default",
                    transition: "background 200ms ease, box-shadow 200ms ease, transform 200ms ease",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "#FFFFFF";
                    el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.background = "#F8F7F4";
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <h4 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1A1814",
                    marginBottom: "6px",
                    lineHeight: 1.3,
                  }}>
                    {card.title}
                  </h4>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "#6A6460",
                    lineHeight: 1.65,
                    margin: 0,
                  }}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
