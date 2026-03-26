"use client";

import { useEffect, useState, useCallback, useRef } from "react";

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
 * Sidebar navigation — lives inside the dashboard view (flex child, not fixed).
 * Tracks active section by observing scroll position of .dashboard-panel.
 * Nav clicks scroll only the dashboard-panel, not the snap-shell.
 * Visible on lg+ screens only (CSS handles display).
 */
export default function WorkSidebar() {
  const [active, setActive] = useState("work");
  const panelRef = useRef<Element | null>(null);

  /* ── Resolve the scroll container once ── */
  useEffect(() => {
    panelRef.current = document.querySelector(".dashboard-panel");
  }, []);

  /* ── Active section tracking ── */
  const handleScroll = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const panelRect = panel.getBoundingClientRect();
    // Threshold: 1/3 from the top of the panel
    const threshold = panelRect.top + panelRect.height * 0.33;

    let current = NAV_ITEMS[0].id;
    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) current = item.id;
      }
    }
    setActive(current);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => panel.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── Nav click → scroll the panel, not the snap-shell ── */
  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    const panel = panelRef.current;
    const el = document.getElementById(sectionId);
    if (!panel || !el) return;

    // Calculate offset of element relative to the panel's scroll position
    const panelTop = panel.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const scrollOffset = panel.scrollTop + (elTop - panelTop);

    panel.scrollTo({ top: scrollOffset, behavior: "smooth" });
  };

  return (
    <aside className="dashboard-sidebar" aria-label="Section navigation">
      {/* Brand — name only, no logo (header already has it) */}
      <div className="sidebar-brand">
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--color-ink)",
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
            marginTop: "3px",
          }}
        >
          Product Design &amp; Strategy
        </p>
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
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
                background: isActive ? "rgba(26,24,20,0.06)" : "transparent",
                transition: "all 180ms ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(26,24,20,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
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
      </nav>

      {/* Terminal widget */}
      <div className="sidebar-footer">
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
          <div><span style={{ color: "#4ade80" }}>v15</span> — deployed</div>
          <div style={{ opacity: 0.5 }}>improving case studies</div>
        </div>
      </div>
    </aside>
  );
}
