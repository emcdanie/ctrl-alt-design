"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const NAV_ITEMS = [
  { id: "work", label: "Case Studies" },
  { id: "process", label: "Process" },
  { id: "design-lab", label: "Ctrl Alt Design" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "learning", label: "Learning" },
  { id: "contact", label: "Contact" },
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
    // Defer the initial sync to the next frame so the setActive() call
    // doesn't run synchronously inside the effect body (cascading render).
    // Picks up any pre-scrolled position (e.g. browser back/forward).
    const rafId = requestAnimationFrame(handleScroll);
    return () => {
      cancelAnimationFrame(rafId);
      panel.removeEventListener("scroll", handleScroll);
    };
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
            fontSize: "var(--typography-font-size-sm)",
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
            fontSize: "var(--typography-font-size-tag)",
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
              aria-current={isActive ? "true" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "var(--spacing-touch-target)",
                padding: "0 14px 0 11px",
                /* reserved accent slot — iris bar on active, no layout shift */
                borderLeft: isActive
                  ? "3px solid var(--color-accent-ink)"
                  : "3px solid transparent",
                borderRadius: "0 10px 10px 0",
                fontFamily: "var(--font-body)",
                /* §5 ramp: 15 is off-ramp, base step keeps the a11y bump */
                fontSize: "var(--typography-font-size-base)",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--color-ink)" : "var(--color-ink-soft)",
                textDecoration: "none",
                background: isActive ? "rgba(26,24,20,0.06)" : "transparent",
                transition: "background 180ms ease, color 180ms ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(26,24,20,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* one consistent marker: outline dot, fills iris on active */}
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: isActive ? "var(--color-accent-ink)" : "transparent",
                  border: isActive
                    ? "1.5px solid var(--color-accent-ink)"
                    : "1.5px solid var(--color-ink-soft)",
                  transition: "background 180ms ease, border-color 180ms ease",
                }}
              />
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
            borderRadius: "var(--radius-lg)",
            padding: "14px",
            color: "var(--color-page)",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "var(--typography-font-size-tag)",
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
                fontSize: "var(--typography-font-size-tag)",
                color: "#4ade80",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "var(--typography-letter-spacing-wide)",
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
