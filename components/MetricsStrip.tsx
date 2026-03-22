"use client";

import { useState } from "react";
import Link from "next/link";

interface MetricItem {
  stat: string;
  label: string;
  hover: { text: string; href?: string }[];
}

const metrics: MetricItem[] = [
  {
    stat: "3+",
    label: "YEARS EXPERIENCE",
    hover: [
      { text: "BizAway — UX/UI Designer", href: "/case-studies/design-system-transformation" },
      { text: "Brad Frost Web — Product Designer", href: "/case-studies/brad-frost" },
      { text: "UNOG — Dashboard Prototype", href: "/case-studies/un-operational-dashboard" },
    ],
  },
  {
    stat: "2",
    label: "DESIGN SYSTEMS BUILT",
    hover: [
      { text: "BizAway Design System", href: "/case-studies/design-system-transformation" },
      { text: "Brad Frost Atomic System", href: "/case-studies/brad-frost" },
    ],
  },
  {
    stat: "B2B",
    label: "PRIMARY DOMAIN",
    hover: [
      { text: "BizAway travel platform", href: "/case-studies/design-system-transformation" },
      { text: "UNOG operational dashboard", href: "/case-studies/un-operational-dashboard" },
      { text: "Guardian concept", href: "/case-studies/guardian" },
    ],
  },
  {
    stat: "BCN",
    label: "BASED IN",
    hover: [
      { text: "Open to full-time remote roles", href: undefined },
      { text: "Select freelance projects", href: "#contact" },
    ],
  },
];

function MetricCard({ item }: { item: MetricItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        flex: 1,
        minWidth: 0,
        padding: expanded ? "20px" : "20px",
        background: expanded ? "#F5F4F1" : "transparent",
        borderRadius: "12px",
        transition: "background 220ms ease",
        textAlign: "center",
      }}
    >
      {/* Large stat */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "52px",
          fontWeight: 700,
          color: "#1A1A1A",
          lineHeight: 1,
        }}
      >
        {item.stat}
      </div>

      {/* Label */}
      <div
        className="eyebrow"
        style={{ marginTop: "8px", marginBottom: expanded ? "16px" : "0" }}
      >
        {item.label}
      </div>

      {/* Hover content */}
      <div
        style={{
          maxHeight: expanded ? "200px" : "0",
          overflow: "hidden",
          transition: "max-height 220ms ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
          {item.hover.map((h, i) =>
            h.href ? (
              <Link
                key={i}
                href={h.href}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "#1A1A1A",
                  textDecoration: "underline",
                  textDecorationColor: "transparent",
                  transition: "text-decoration-color 150ms ease",
                  lineHeight: 1.5,
                }}
                onMouseEnter={e => (e.currentTarget.style.textDecorationColor = "#1A1A1A")}
                onMouseLeave={e => (e.currentTarget.style.textDecorationColor = "transparent")}
              >
                {h.text}
              </Link>
            ) : (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "#666666",
                  lineHeight: 1.5,
                }}
              >
                {h.text}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function MetricsStrip() {
  return (
    <section style={{ padding: "48px 24px" }}>
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          gap: "8px",
        }}
        className="metrics-strip"
      >
        {metrics.map((item) => (
          <MetricCard key={item.stat} item={item} />
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .metrics-strip {
            flex-wrap: wrap;
          }
          .metrics-strip > * {
            flex: 1 1 calc(50% - 4px);
          }
        }
      `}</style>
    </section>
  );
}
