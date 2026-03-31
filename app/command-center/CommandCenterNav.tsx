"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/command-center", label: "Dashboard", icon: "⚡" },
  { href: "/command-center/map", label: "System Map", icon: "🗺️" },
] as const;

export function CommandCenterNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 52,
        background:
          "linear-gradient(180deg, rgba(246,241,232,0.92) 0%, rgba(246,241,232,0.82) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(44,24,16,0.06)",
        fontFamily: `var(--font-body), "Plus Jakarta Sans", system-ui, sans-serif`,
      }}
    >
      {/* Brand */}
      <Link
        href="/command-center"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <span
          style={{
            fontFamily: `var(--font-display), "Clash Display", system-ui, sans-serif`,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-ink, #1a1a1a)",
          }}
        >
          Command Center
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-ink-muted, #7a7a7a)",
            fontFamily: `var(--font-chivo-mono), "Chivo Mono", monospace`,
            background: "rgba(44,24,16,0.04)",
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          Brad Frost
        </span>
      </Link>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive
                  ? "var(--color-ink, #1a1a1a)"
                  : "var(--color-ink-muted, #7a7a7a)",
                background: isActive
                  ? "rgba(255,255,255,0.7)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(255,255,255,0.6)"
                  : "1px solid transparent",
                boxShadow: isActive
                  ? "0 1px 4px rgba(44,24,16,0.04)"
                  : "none",
                textDecoration: "none",
                transition: "all 0.15s ease",
                fontFamily: `var(--font-body), "Plus Jakarta Sans", system-ui, sans-serif`,
              }}
            >
              <span style={{ fontSize: 14 }}>{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Back to portfolio */}
      <Link
        href="/"
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "var(--color-muted, #6f6a63)",
          textDecoration: "none",
          fontFamily: `var(--font-body), "Plus Jakarta Sans", system-ui, sans-serif`,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Portfolio
      </Link>
    </nav>
  );
}
