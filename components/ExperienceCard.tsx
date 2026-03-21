"use client";

import Link from "next/link";
import LogoContainer from "@/components/LogoContainer";

function BoldLead({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ fontWeight: 700, color: "#1A1814" }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  highlights: string[];
  logoSrc?: string;
  logoBg?: string;
  caseStudySlug?: string;
  caseStudyLabel?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ExperienceCard({
  title,
  company,
  period,
  isCurrent,
  highlights,
  logoSrc,
  logoBg,
  caseStudySlug,
  caseStudyLabel,
  isOpen,
  onToggle,
}: ExperienceCardProps) {
  return (
    <div
      style={{
        borderRadius: "16px",
        border: "1px solid rgba(26,24,20,0.10)",
        background: isOpen ? "#FFFFFF" : "#F8F7F4",
        boxShadow: isOpen ? "0 4px 24px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        overflow: "hidden",
        transition: "background 200ms ease, box-shadow 200ms ease",
      }}
      onMouseEnter={e => {
        if (!isOpen) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
          (e.currentTarget as HTMLDivElement).style.background = "#FAFAF8";
        }
      }}
      onMouseLeave={e => {
        if (!isOpen) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
          (e.currentTarget as HTMLDivElement).style.background = "#F8F7F4";
        }
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          cursor: "pointer",
          background: "none",
          border: "none",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
          <LogoContainer src={logoSrc} alt={company} bg={logoBg} size={44} />

          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1A1814",
                  lineHeight: 1.3,
                }}
              >
                {title}
              </span>
              {isCurrent && (
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    background: "#1A1A1A",
                    borderRadius: "999px",
                    padding: "2px 8px",
                  }}
                >
                  NOW
                </span>
              )}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "#8A8480",
                marginTop: "2px",
              }}
            >
              {company} · {period}
            </div>
          </div>
        </div>

        {/* Chevron */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 250ms ease",
            color: "#8A8480",
          }}
          aria-hidden="true"
        >
          <path
            d="M4.5 7l4.5 4.5L13.5 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ padding: "0 24px 28px", borderTop: "1px solid rgba(26,24,20,0.06)" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px" }}>
            {highlights.map((h, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  color: "#4A4640",
                  lineHeight: 1.75,
                  display: "flex",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#CCCCCC", flexShrink: 0, marginTop: "1px" }}>—</span>
                <span>
                  <BoldLead text={h} />
                </span>
              </li>
            ))}
          </ul>

          {caseStudySlug && (
            <Link
              href={`/${caseStudySlug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "20px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1A1814",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                opacity: 0.6,
                transition: "opacity 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
            >
              {caseStudyLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
