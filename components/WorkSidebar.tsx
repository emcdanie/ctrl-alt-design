"use client";

import { useEffect, useState } from "react";

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
 * Floating left sidebar for the work dashboard area.
 * Appears once the user scrolls past the hero.
 * Cream-toned, glass-surfaced, calm and editorial.
 * Only visible on lg+ screens (1024px).
 */
export default function WorkSidebar() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sidebar once work section is near viewport
      const workSection = document.getElementById("work");
      if (workSection) {
        const rect = workSection.getBoundingClientRect();
        setVisible(rect.top < window.innerHeight * 0.8);
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
        left: "max(24px, calc((100vw - 1400px) / 2 - 40px))",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 40,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 350ms ease",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.68) 100%)",
          border: "1px solid rgba(255,255,255,0.72)",
          borderRadius: "18px",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 4px 24px rgba(44,24,16,0.06), 0 1px 4px rgba(44,24,16,0.03), inset 0 1px 0 rgba(255,255,255,0.8)",
          padding: "16px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          minWidth: "160px",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                display: "block",
                padding: "8px 14px",
                borderRadius: "10px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--color-ink)" : "var(--color-muted)",
                textDecoration: "none",
                background: isActive ? "rgba(26,24,20,0.05)" : "transparent",
                transition: "all 150ms ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(26,24,20,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
