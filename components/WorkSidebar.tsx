"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "work", label: "Case Studies", icon: "◆" },
  { id: "process", label: "Process", icon: "◇" },
  { id: "design-lab", label: "Ctrl Alt Design", icon: "⬡" },
  { id: "about", label: "About", icon: "○" },
  { id: "experience", label: "Experience", icon: "◎" },
  { id: "learning", label: "Learning", icon: "△" },
  { id: "contact", label: "Contact", icon: "✉" },
];

/**
 * Persistent left sidebar for the dashboard area.
 * Inspired by Carmen's portfolio nav — clean, always present,
 * with active state tracking.
 * Only visible on lg+ screens (1024px).
 */
export default function WorkSidebar() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sidebar once we're past the hero landing
      const dashboardZone = document.querySelector(".dashboard-zone");
      if (dashboardZone) {
        const rect = dashboardZone.getBoundingClientRect();
        setVisible(rect.top < window.innerHeight * 0.5);
      }

      // Determine active section
      let current = "";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) current = item.id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:block"
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        bottom: "0",
        width: "192px",
        zIndex: 40,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: "opacity 450ms ease, transform 450ms ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand mark */}
      <div
        style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid var(--color-border-soft)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--color-ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-page)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          E
        </div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--color-ink)",
            marginTop: "10px",
            lineHeight: 1.2,
          }}
        >
          Elleta McDaniel
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            color: "var(--color-muted)",
            marginTop: "2px",
          }}
        >
          Product Design &amp; Strategy
        </p>
      </div>

      {/* Nav links */}
      <div
        style={{
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          flex: 1,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 14px",
                borderRadius: "10px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--color-ink)" : "var(--color-muted)",
                textDecoration: "none",
                background: isActive
                  ? "rgba(26,24,20,0.06)"
                  : "transparent",
                transition: "all 180ms ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(26,24,20,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  opacity: isActive ? 1 : 0.4,
                  transition: "opacity 180ms ease",
                  width: "14px",
                  textAlign: "center",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </a>
          );
        })}
      </div>

      {/* Footer — build status widget (like Carmen's) */}
      <div
        style={{
          padding: "16px 16px 24px",
          borderTop: "1px solid var(--color-border-soft)",
        }}
      >
        <div
          style={{
            background: "var(--color-ink)",
            borderRadius: "12px",
            padding: "14px",
            color: "var(--color-page)",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            lineHeight: 1.6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80" }} />
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#facc15" }} />
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f87171" }} />
            <span
              style={{
                marginLeft: "auto",
                fontSize: "9px",
                color: "#4ade80",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              ● Live
            </span>
          </div>
          <div style={{ opacity: 0.6 }}>~/portfolio $</div>
          <div>
            <span style={{ color: "#4ade80" }}>v15</span> — deployed
          </div>
          <div style={{ opacity: 0.5 }}>
            improving case studies
          </div>
        </div>
      </div>
    </nav>
  );
}
