"use client";

import Link from "next/link";
import { social } from "@/lib/social";

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
    <section id="about" className="layout-section">
      <div className="layout-container">

        <div className="glass-card p-7 md:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

          {/* ── Left column ── */}
          <div>
            {/* Profile photo + eyebrow row */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                background: "#D8D4CC",
                border: "2.5px solid rgba(26,24,20,0.08)",
                boxShadow: "0 2px 8px rgba(44,24,16,0.06)",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/thumbnails/Me.jpeg"
                  alt="Elleta"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.currentTarget.parentElement as HTMLElement).style.background = "#C8C4CC"; e.currentTarget.style.display = "none"; }}
                />
              </div>
              <p className="section-label" style={{ margin: 0 }}>— About</p>
            </div>

            <h2 className="heading-section" style={{ marginBottom: "16px" }}>
              Hey, I&apos;m Elleta
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "520px" }}>
              <p className="body-lg" style={{ margin: 0 }}>
                I&apos;m a product designer who works at the intersection of systems thinking and interaction design. I care about building things that are coherent, scalable, and genuinely useful — not just polished.
              </p>
              <p className="body-lg" style={{ margin: 0 }}>
                Most of my recent work has been in B2B SaaS — design systems, complex data interfaces, and multi-role platforms where the user journey is rarely linear and the stakes are high.
              </p>
              <p className="body-lg" style={{ margin: 0 }}>
                I&apos;m at my best when I&apos;m working on hard problems with people who care about getting them right.
              </p>
            </div>

            {/* CTA row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "24px" }}>
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1A1814",
                  textDecoration: "none",
                  border: "1px solid rgba(26,24,20,0.18)",
                  borderRadius: "999px",
                  padding: "9px 18px",
                  transition: "background 150ms ease, border-color 150ms ease, color 150ms ease",
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Connect on LinkedIn
              </a>

              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1A1814",
                  textDecoration: "none",
                  border: "1px solid rgba(26,24,20,0.18)",
                  borderRadius: "999px",
                  padding: "9px 18px",
                  transition: "background 150ms ease, border-color 150ms ease, color 150ms ease",
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Explore my full profile →
              </Link>
            </div>
          </div>

          {/* ── Right column ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "24px", borderRadius: "2px", background: "rgba(26,24,20,0.15)" }} />
              <h3 className="heading-subsection" style={{ margin: 0 }}>
                Working with me
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {collaborationCards.map((card) => (
                <div
                  key={card.title}
                  className="card-elevated"
                  style={{
                    padding: "18px 22px",
                    cursor: "default",
                    transition: "box-shadow 200ms ease, transform 200ms ease",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "0 8px 28px rgba(44,24,16,0.09), 0 2px 8px rgba(44,24,16,0.05)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <h4 className="heading-item" style={{ marginBottom: "4px" }}>
                    {card.title}
                  </h4>
                  <p className="body-base" style={{ margin: 0 }}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
        </div>{/* /glass-card */}
      </div>
    </section>
  );
}
