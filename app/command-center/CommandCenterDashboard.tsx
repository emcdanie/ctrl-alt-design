"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS — Eddie design system, merged with Command Center needs
// Uses CSS custom properties from globals.css where available,
// extends with semantic status colours that Eddie doesn't define.
// ─────────────────────────────────────────────────────────────
const T = {
  // Surfaces — mapped to Eddie
  bg:            "var(--color-page)",          // #f6f1e8
  bgDeep:        "var(--color-surface)",       // #f0ebe3
  bgCard:        "var(--color-glass)",         // rgba(255,255,255,0.68)
  bgCardHover:   "var(--color-glass-strong)",  // rgba(255,255,255,0.82)
  // Accent — Eddie gold
  accent:        "var(--color-accent-gold)",   // #b8956a
  accentLight:   "#c9a87e",                    // lighter tint for gradients
  accentPale:    "rgba(184,149,106,0.15)",     // tinted glass
  accentGlass:   "rgba(184,149,106,0.10)",
  accentBorder:  "rgba(184,149,106,0.22)",
  // Dark accent — Eddie espresso
  espresso:      "var(--color-accent-espresso)", // #2c1810
  // Ink — Eddie typography
  ink:           "var(--color-ink)",            // #1a1a1a
  inkSoft:       "var(--color-ink-soft)",       // #2c2c2c
  inkMuted:      "var(--color-ink-muted)",      // #7a7a7a
  inkFaint:      "var(--color-muted)",          // #6f6a63
  // Borders + shadows — Eddie
  borderSoft:    "var(--color-border-soft)",    // rgba(44,24,16,0.08)
  borderMed:     "var(--color-border-medium)",  // rgba(44,24,16,0.12)
  shadow:        "var(--shadow-soft)",
  shadowMd:      "var(--shadow-layered)",
  // Typography — Eddie fonts
  display:       "var(--font-display)",         // Clash Display
  body:          "var(--font-body)",            // Plus Jakarta Sans
  mono:          "var(--font-chivo-mono), 'Chivo Mono', monospace",
  // Radius — Eddie editorial feel
  radius:        "20px",
  radiusSm:      "10px",
  // Semantic status — not in Eddie, kept for dashboard use
  green:         "#2d7a50",
  greenBg:       "rgba(45,122,80,0.08)",
  greenBorder:   "rgba(45,122,80,0.20)",
  red:           "#a63030",
  redBg:         "rgba(166,48,48,0.08)",
  redBorder:     "rgba(166,48,48,0.20)",
  purple:        "#6b4ea0",
  purpleBg:      "rgba(107,78,160,0.08)",
  purpleBorder:  "rgba(107,78,160,0.20)",
  blue:          "#3066a0",
  blueBg:        "rgba(48,102,160,0.08)",
  blueBorder:    "rgba(48,102,160,0.20)",
} as const;

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
interface Project {
  id: number;
  name: string;
  status: "active" | "blocked" | "complete";
  house: string;
  progress: number;
  priority: string;
  due: string;
  blocked: boolean;
}

interface Quest {
  id: number;
  text: string;
  xp: number;
  done: boolean;
  ref: keyof typeof BADGES;
}

interface Metric {
  label: string;
  value: string;
  sub: string;
  icon: string;
}

interface Alert {
  level: "critical" | "warn" | "info";
  msg: string;
  ref: keyof typeof BADGES;
}

interface SpeakingEvent {
  event: string;
  date: string;
  status: "confirmed" | "pending" | "exploring";
}

const DATA: {
  projects: Project[];
  quests: Quest[];
  metrics: Metric[];
  alerts: Alert[];
  speaking: SpeakingEvent[];
} = {
  projects: [
    { id: 1, name: "Frostbitten Design System",   status: "active",   house: "Atomic",    progress: 78,  priority: "The Iron Throne",  due: "Apr 2",  blocked: false },
    { id: 2, name: "Pattern Lab v4",               status: "active",   house: "Molecular", progress: 45,  priority: "Hand of the King", due: "Apr 18", blocked: false },
    { id: 3, name: "This Is Atomic Design Book 2", status: "blocked",  house: "Organism",  progress: 12,  priority: "The Night King",   due: "TBD",    blocked: true  },
    { id: 4, name: "Smashing Workshop",            status: "complete", house: "Template",  progress: 100, priority: "The Chosen One",   due: "Done",   blocked: false },
    { id: 5, name: "Brad Frost Web Redesign",      status: "active",   house: "Page",      progress: 33,  priority: "Padawan",          due: "May 1",  blocked: false },
  ],
  quests: [
    { id: 1, text: "Review PR from the Unsullied (junior devs)",              xp: 50,  done: false, ref: "GoT"  },
    { id: 2, text: "Write chapter 3 — 'You Shall Not Ship (without tokens)'", xp: 120, done: true,  ref: "HP"   },
    { id: 3, text: "These are not the components you're looking for",          xp: 80,  done: false, ref: "SW"   },
    { id: 4, text: "Winter is coming — Q4 sprint planning",                    xp: 90,  done: false, ref: "GoT"  },
    { id: 5, text: "The Spice must flow — unblock Pattern Lab tokens",         xp: 110, done: true,  ref: "Dune" },
    { id: 6, text: "Deliver the One Design System to rule them all",           xp: 200, done: false, ref: "LOTR" },
  ],
  metrics: [
    { label: "Components Forged",  value: "247",  sub: "in the fires of Mount Figma",      icon: "⚔️" },
    { label: "PRs Survived",       value: "89",   sub: "the Red Wedding of code review",   icon: "🐺" },
    { label: "Talks Given",        value: "34",   sub: "across the Seven Kingdoms",         icon: "👑" },
    { label: "Students Trained",   value: "1.2k", sub: "in the ways of the Design Force",  icon: "🌌" },
  ],
  alerts: [
    { level: "critical", msg: "HODOR: Hold the door on this breaking change — tokens not migrated", ref: "GoT" },
    { level: "warn",     msg: "Dobby has detected a free component with no documentation. Dobby is not pleased.", ref: "HP" },
    { level: "info",     msg: "A new PR has arrived. It is... acceptable. (Your engineers have spoken.)", ref: "SW" },
  ],
  speaking: [
    { event: "Smashing Conf Amsterdam", date: "Jun 2026", status: "confirmed" },
    { event: "CSS Day",                 date: "Jun 2026", status: "pending"   },
    { event: "An Event Apart",          date: "Oct 2026", status: "exploring" },
  ],
};

const BADGES = {
  GoT:  { bg: T.redBg,      border: T.redBorder,     text: "#7f1d1d",  emoji: "🐉" },
  HP:   { bg: T.blueBg,     border: T.blueBorder,    text: T.blue,     emoji: "⚡" },
  SW:   { bg: T.greenBg,    border: T.greenBorder,   text: T.green,    emoji: "🌌" },
  LOTR: { bg: T.accentPale, border: T.accentBorder,  text: T.inkSoft,  emoji: "💍" },
  Dune: { bg: T.accentPale, border: T.accentBorder,  text: T.inkSoft,  emoji: "🏜️" },
} as const;

// ─────────────────────────────────────────────────────────────
// PRIMITIVES — Eddie glass card system
// ─────────────────────────────────────────────────────────────

function Card({
  children,
  style = {},
  hover = false,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
}) {
  const [on, setOn] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setOn(true)}
      onMouseLeave={() => hover && setOn(false)}
      style={{
        background: on
          ? "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.62) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.48) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid rgba(255,255,255,0.55)`,
        borderTop: `1px solid rgba(255,255,255,0.75)`,
        borderRadius: T.radius,
        boxShadow: on
          ? "0 1px 2px rgba(44,24,16,0.04), 0 8px 24px rgba(44,24,16,0.06), 0 24px 56px rgba(44,24,16,0.08), inset 0 1px 0 rgba(255,255,255,0.6)"
          : "0 1px 2px rgba(44,24,16,0.04), 0 8px 24px rgba(44,24,16,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        transform: on ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.24s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: "22px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Label({
  children,
  icon,
  color,
}: {
  children: React.ReactNode;
  icon?: string;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: color || T.inkMuted,
        fontFamily: T.mono,
        marginBottom: 14,
      }}
    >
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  const map = {
    active:   { bg: T.greenBg,   color: T.green,  border: T.greenBorder,  label: "Active" },
    blocked:  { bg: T.redBg,     color: T.red,    border: T.redBorder,    label: "Blocked" },
    complete: { bg: T.purpleBg,  color: T.purple, border: T.purpleBorder, label: "Complete" },
  };
  const s = map[status] || map.active;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        padding: "4px 12px",
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontFamily: T.mono,
      }}
    >
      {s.label}
    </span>
  );
}

function Bar({ value, status }: { value: number; status: Project["status"] }) {
  const colour =
    status === "blocked"
      ? T.red
      : status === "complete"
        ? T.purple
        : "#b8956a"; // Eddie gold, hardcoded for gradient
  const colourEnd =
    status === "blocked"
      ? "#d06060"
      : status === "complete"
        ? "#a78bfa"
        : "#c9a87e";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 999,
          background: T.bgDeep,
          border: `1px solid ${T.accentBorder}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${colour}, ${colourEnd})`,
            borderRadius: 999,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: T.inkMuted,
          fontFamily: T.mono,
          minWidth: 36,
          textAlign: "right",
        }}
      >
        {value}%
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN — CommandCenterDashboard
// ─────────────────────────────────────────────────────────────
export function CommandCenterDashboard() {
  const [tasks, setTasks] = useState<Quest[]>(DATA.quests);
  const [activeHouse, setActiveHouse] = useState("All");

  const toggle = (id: number) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const houses = ["All", "Atomic", "Molecular", "Organism", "Template", "Page"];
  const filtered =
    activeHouse === "All"
      ? DATA.projects
      : DATA.projects.filter((p) => p.house === activeHouse);
  const totalXP = tasks.filter((t) => t.done).reduce((s, t) => s + t.xp, 0);
  const xpPct = Math.min((totalXP / 500) * 100, 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse at 15% 0%, rgba(248,240,220,0.6) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 100%, rgba(237,232,208,0.5) 0%, transparent 55%),
          var(--color-page)
        `,
        color: T.ink,
        fontFamily: T.body,
      }}
    >
      {/* Grain overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          opacity: 0.45,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1240,
          margin: "0 auto",
          padding: "36px 28px",
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 20,
            borderBottom: `1px solid ${T.borderSoft}`,
            paddingBottom: 28,
            marginBottom: 36,
          }}
        >
          <div>
            <div
              className="eyebrow"
              style={{
                fontFamily: T.mono,
                color: T.inkMuted,
                marginBottom: 10,
              }}
            >
              ⚡ Ctrl+Alt+Design Presents
            </div>
            <h1
              style={{
                fontFamily: T.display,
                fontSize: "clamp(38px, 6vw, 62px)",
                fontWeight: 700,
                margin: 0,
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                color: T.ink,
              }}
            >
              The Command Center
            </h1>
            <p
              style={{
                margin: "14px 0 0",
                color: T.inkMuted,
                fontSize: 16,
                fontStyle: "italic",
                lineHeight: 1.6,
                fontFamily: T.body,
              }}
            >
              &ldquo;One design system to rule them all, one system to find
              them.&rdquo; — Brad Frost, probably
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                color: T.inkFaint,
                fontFamily: T.mono,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Last Raven Received
            </div>
            <div
              style={{
                fontSize: 15,
                color: T.inkSoft,
                fontFamily: T.mono,
                fontWeight: 600,
              }}
            >
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div
              style={{
                marginTop: 12,
                background: T.greenBg,
                border: `1px solid ${T.greenBorder}`,
                borderRadius: T.radiusSm,
                padding: "6px 16px",
                fontSize: 11,
                fontWeight: 600,
                color: T.green,
                fontFamily: T.mono,
                letterSpacing: "0.08em",
              }}
            >
              ● THE FORCE IS STRONG TODAY
            </div>
          </div>
        </div>

        {/* ── METRICS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {DATA.metrics.map((m, i) => (
            <Card key={i} hover>
              <div style={{ fontSize: 34, marginBottom: 10 }}>{m.icon}</div>
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 700,
                  color: T.accent,
                  lineHeight: 1,
                  fontFamily: T.display,
                  letterSpacing: "-0.02em",
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: T.ink,
                  marginTop: 8,
                  fontFamily: T.body,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: T.inkMuted,
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                {m.sub}
              </div>
            </Card>
          ))}
        </div>

        {/* ── ALERTS ── */}
        <div style={{ marginBottom: 32 }}>
          <Label icon="🐦">
            Ravens from the Three-Eyed Raven (System Alerts)
          </Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DATA.alerts.map((a, i) => {
              const s = {
                critical: {
                  bg: T.redBg,
                  border: T.redBorder,
                  dot: T.red,
                  text: "#7f1d1d",
                },
                warn: {
                  bg: T.accentPale,
                  border: T.accentBorder,
                  dot: "#b8956a",
                  text: T.inkSoft,
                },
                info: {
                  bg: T.blueBg,
                  border: T.blueBorder,
                  dot: T.blue,
                  text: T.blue,
                },
              }[a.level];
              return (
                <div
                  key={i}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: T.radiusSm,
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: s.dot,
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 15,
                      color: s.text,
                      flex: 1,
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    {a.msg}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: T.inkMuted,
                      fontFamily: T.mono,
                      letterSpacing: "0.08em",
                      flexShrink: 0,
                      paddingTop: 2,
                    }}
                  >
                    {BADGES[a.ref]?.emoji} {a.ref}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* Projects */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Label icon="👑">The Seven Kingdoms of Projects</Label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {houses.map((h) => {
                  const on = activeHouse === h;
                  return (
                    <button
                      key={h}
                      onClick={() => setActiveHouse(h)}
                      style={{
                        background: on
                          ? T.accentGlass
                          : "rgba(255,255,255,0.55)",
                        border: `1px solid ${on ? T.accentBorder : T.borderSoft}`,
                        color: on ? "#b8956a" : T.inkMuted,
                        padding: "5px 14px",
                        borderRadius: T.radiusSm,
                        fontSize: 12,
                        fontWeight: on ? 600 : 500,
                        cursor: "pointer",
                        fontFamily: T.mono,
                        letterSpacing: "0.06em",
                        transition: "all 0.18s",
                      }}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {filtered.map((p) => (
                <Card
                  key={p.id}
                  hover
                  style={{
                    borderColor: p.blocked
                      ? T.redBorder
                      : p.status === "complete"
                        ? T.purpleBorder
                        : undefined,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 16,
                      marginBottom: 4,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: T.ink,
                          marginBottom: 6,
                          lineHeight: 1.3,
                          fontFamily: T.body,
                        }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="tag"
                          style={{
                            fontSize: 11,
                            fontFamily: T.mono,
                            padding: "2px 10px",
                          }}
                        >
                          House {p.house}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: T.inkMuted,
                            fontStyle: "italic",
                          }}
                        >
                          ⚔️ {p.priority}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 6,
                        flexShrink: 0,
                      }}
                    >
                      <StatusPill status={p.status} />
                      <span
                        style={{
                          fontSize: 13,
                          color: T.inkFaint,
                          fontFamily: T.mono,
                        }}
                      >
                        Due: {p.due}
                      </span>
                    </div>
                  </div>
                  <Bar value={p.progress} status={p.status} />
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* XP */}
            <Card
              style={{
                background: T.purpleBg,
                border: `1px solid ${T.purpleBorder}`,
                textAlign: "center",
              }}
            >
              <Label icon="🧙" color={T.purple}>
                Wizard Level
              </Label>
              <div
                style={{
                  fontSize: 54,
                  fontWeight: 700,
                  color: T.purple,
                  lineHeight: 1,
                  fontFamily: T.display,
                  letterSpacing: "-0.02em",
                }}
              >
                {totalXP}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: T.inkMuted,
                  marginTop: 8,
                  fontStyle: "italic",
                }}
              >
                XP earned today, Harry
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 7,
                  background: T.bgDeep,
                  border: `1px solid ${T.purpleBorder}`,
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${xpPct}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${T.purple}, #a78bfa)`,
                    borderRadius: 999,
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.inkMuted,
                  marginTop: 8,
                  fontFamily: T.mono,
                }}
              >
                {totalXP} / 500 XP to Level Up
              </div>
            </Card>

            {/* Speaking */}
            <Card>
              <Label icon="🚀">Hyperspace Jumps (Speaking)</Label>
              {DATA.speaking.map((s, i) => {
                const b = {
                  confirmed: {
                    bg: T.greenBg,
                    border: T.greenBorder,
                    color: T.green,
                    label: "Confirmed",
                  },
                  pending: {
                    bg: T.accentPale,
                    border: T.accentBorder,
                    color: "#b8956a",
                    label: "Pending",
                  },
                  exploring: {
                    bg: T.bgDeep,
                    border: T.accentBorder,
                    color: T.inkMuted,
                    label: "Scouting",
                  },
                }[s.status];
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBottom:
                        i < DATA.speaking.length - 1 ? 14 : 0,
                      marginBottom:
                        i < DATA.speaking.length - 1 ? 14 : 0,
                      borderBottom:
                        i < DATA.speaking.length - 1
                          ? `1px solid ${T.borderSoft}`
                          : "none",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: T.ink,
                        }}
                      >
                        {s.event}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: T.inkMuted,
                          fontFamily: T.mono,
                          marginTop: 2,
                        }}
                      >
                        {s.date}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: b.bg,
                        color: b.color,
                        border: `1px solid ${b.border}`,
                        fontFamily: T.mono,
                        letterSpacing: "0.05em",
                        flexShrink: 0,
                      }}
                    >
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>

        {/* ── QUEST LOG ── */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Label icon="📜">Today&apos;s Quest Log</Label>
            <div
              style={{ fontSize: 14, color: T.inkMuted, fontFamily: T.mono }}
            >
              {tasks.filter((t) => t.done).length}/{tasks.length} quests
              completed
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: 12,
            }}
          >
            {tasks.map((t) => {
              const badge = BADGES[t.ref] || BADGES.GoT;
              return (
                <div
                  key={t.id}
                  onClick={() => toggle(t.id)}
                  style={{
                    background: t.done
                      ? "rgba(255,253,247,0.35)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.48) 100%)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${t.done ? T.accentBorder : "rgba(255,255,255,0.55)"}`,
                    borderRadius: T.radius,
                    boxShadow: t.done
                      ? "none"
                      : "0 1px 2px rgba(44,24,16,0.04), 0 4px 16px rgba(44,24,16,0.04)",
                    padding: "16px 18px",
                    cursor: "pointer",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    opacity: t.done ? 0.6 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      flexShrink: 0,
                      marginTop: 2,
                      background: t.done
                        ? T.greenBg
                        : "rgba(255,255,255,0.7)",
                      border: `2px solid ${t.done ? T.greenBorder : T.accentBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      color: T.green,
                      fontWeight: 900,
                      transition: "all 0.2s",
                    }}
                  >
                    {t.done ? "✓" : ""}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        lineHeight: 1.5,
                        color: t.done ? T.inkFaint : T.ink,
                        textDecoration: t.done ? "line-through" : "none",
                      }}
                    >
                      {t.text}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 4,
                          background: badge.bg,
                          color: badge.text,
                          border: `1px solid ${badge.border}`,
                          fontFamily: T.mono,
                          fontWeight: 600,
                        }}
                      >
                        {badge.emoji} {t.ref}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: T.accent,
                          fontFamily: T.mono,
                          fontWeight: 600,
                        }}
                      >
                        +{t.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${T.borderSoft}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: T.inkFaint,
              fontFamily: T.mono,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Ctrl+Alt+Design Studio — Built with the Force, Atomic Design &
            Too Much Coffee
          </p>
          <p
            style={{
              fontSize: 13,
              color: T.inkFaint,
              fontStyle: "italic",
              marginTop: 6,
            }}
          >
            &ldquo;Not all those who wander are lost. Some are just looking for
            their design tokens.&rdquo; — Tolkien, probably
          </p>
        </div>
      </div>
    </div>
  );
}
