import type { CSSProperties } from "react";

/* Theming case (mock theming-case-study.html, 22 Sep 2026): the theme
 * data the exhibit, the side-by-side strip and the gate read. The hex
 * values ARE the subject of the exhibit: ground and night are BELLA's
 * light and dark primitives, coast and market are demo brands. They are
 * data, drawn as fills, never used as page styling. */

export type Role = "bg" | "panel" | "line" | "border-strong" | "muted" | "ink" | "action" | "on-action" | "accent";
type Ramp = "neutral" | "brand";

export interface Theme {
  name: ThemeKey;
  neutral: string[];
  brand: string[];
  sem: Record<Role, [Ramp, number]>;
  /** the exhibit's wash behind the sheets, on a light and a dark page */
  tint: [string, string];
  /** the picker swatch: page ground and its answer colour */
  swatch: [string, string];
  note: string;
}

export type ThemeKey = "ground" | "night" | "coast" | "market";
export const ORDER: ThemeKey[] = ["ground", "night", "coast", "market"];

const BELLA_SEM = (line: number, strong: number, muted: number, accent: number): Theme["sem"] => ({
  bg: ["neutral", 0],
  panel: ["neutral", 1],
  line: ["neutral", line],
  "border-strong": ["neutral", strong],
  muted: ["neutral", muted],
  ink: ["neutral", 7],
  action: ["neutral", 7],
  "on-action": ["neutral", 0],
  accent: ["brand", accent],
});

/* the ochre ramp, light to dark: step 3 is ochre and step 5 ochre-deep
 * (BELLA's two brand primitives); the other steps are derived between
 * and beyond them for the exhibit, not BELLA tokens */
const OCHRE = ["#fdf6ea", "#f9e8c8", "#f2d08f", "#e8a83e", "#d38f24", "#b97a14", "#8a5a0f", "#5c3c0a"]; // token-waiver: the exhibit's subject

export const THEMES: Record<ThemeKey, Theme> = {
  ground: {
    name: "ground",
    neutral: ["#ffffff", "#f2f2f2", "#e3e3e3", "#8c8c8c", "#6b6b6b", "#515151", "#2a2a2a", "#121212"], // token-waiver: BELLA light primitives, the exhibit's subject
    brand: OCHRE, // BELLA's ochre (item 2, 22 Sep 2026; iris retired)
    sem: BELLA_SEM(2, 3, 5, 3),
    tint: ["#e9e8e4", "#1b1b1b"], // token-waiver: exhibit wash per theme (mock)
    swatch: ["#ffffff", "#121212"], // token-waiver: picker swatch data
    note: "BELLA · light",
  },
  night: {
    name: "night",
    neutral: ["#0d0d0d", "#161616", "#1f1f1f", "#2a2a2a", "#636363", "#8c8c8c", "#b1b1b1", "#ededed"], // token-waiver: BELLA dark primitives, the exhibit's subject
    brand: [...OCHRE].reverse(), // the same ramp, reversed for dark
    sem: BELLA_SEM(3, 4, 6, 4),
    tint: ["#d9d8dd", "#232228"], // token-waiver: exhibit wash per theme (mock)
    swatch: ["#0d0d0d", "#ededed"], // token-waiver: picker swatch data
    note: "BELLA · dark",
  },
  coast: {
    name: "coast",
    neutral: ["#f6f4ef", "#ebe6dc", "#d9d2c3", "#8e8a80", "#6a6a66", "#3f4d57", "#2a3942", "#1d2a33"], // token-waiver: demo brand primitives
    brand: ["#e3f0f4", "#bcd9e3", "#8dbccd", "#f6c9a8", "#3c8aa6", "#2b7390", "#1f5f7a", "#143f52"], // token-waiver: demo brand primitives
    sem: { ...BELLA_SEM(2, 3, 5, 3), action: ["brand", 6] },
    tint: ["#f3dccb", "#2a2320"], // token-waiver: exhibit wash per theme (mock)
    swatch: ["#f6f4ef", "#1f5f7a"], // token-waiver: picker swatch data
    note: "demo brand",
  },
  market: {
    name: "market",
    neutral: ["#ffffff", "#eef6f3", "#d3e6df", "#6b8a80", "#5d766f", "#3f5a53", "#23403a", "#0f2a24"], // token-waiver: demo brand primitives
    brand: ["#e3f5ee", "#cfe8dc", "#9fd3be", "#5fb697", "#239a74", "#0a7a5c", "#07634a", "#044434"], // token-waiver: demo brand primitives
    sem: { ...BELLA_SEM(2, 3, 5, 1), action: ["brand", 5] },
    tint: ["#d7ebe2", "#1b2622"], // token-waiver: exhibit wash per theme (mock)
    swatch: ["#ffffff", "#0a7a5c"], // token-waiver: picker swatch data
    note: "demo brand",
  },
};

export const val = (t: Theme, role: Role) => {
  const [ramp, i] = t.sem[role];
  return t[ramp][i];
};

/* tier 3: the component slots and the role each one reads */
export const COMPONENT_SLOTS: [string, Role][] = [
  ["button.background", "action"],
  ["button.label", "on-action"],
  ["card.border", "line"],
  ["card.surface", "bg"],
  ["image.well", "panel"],
  ["tag.fill", "accent"],
  ["text.meta", "muted"],
  ["input.border", "border-strong"],
];
export const SEMANTIC_ROWS: Role[] = ["bg", "panel", "line", "muted", "ink", "action", "accent"];
export const JSON_ROLES: Role[] = ["bg", "panel", "line", "muted", "ink", "action", "on-action", "accent"];

/* the preview reads nine custom properties, one per role */
export function themeVars(t: Theme): CSSProperties {
  return {
    "--t-bg": val(t, "bg"),
    "--t-panel": val(t, "panel"),
    "--t-ink": val(t, "ink"),
    "--t-muted": val(t, "muted"),
    "--t-line": val(t, "line"),
    "--t-action": val(t, "action"),
    "--t-on-action": val(t, "on-action"),
    "--t-accent": val(t, "accent"),
    "--t-border": val(t, "border-strong"),
  } as CSSProperties;
}

/* WCAG 2 contrast */
const lum = (h: string) => {
  const c = (h.match(/\w\w/g) ?? []).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a: string, b: string) => {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

export type Grade = { label: string; tone: "aaa" | "aa" | "no" };
export const grade = (r: number, control: boolean, large = false): Grade => {
  if (control) return r >= 3 ? { label: "≥ 3:1", tone: "aaa" } : { label: "fails", tone: "no" };
  if (r >= 7) return { label: "AAA", tone: "aaa" };
  if (r >= 4.5) return { label: "AA", tone: "aa" };
  if (large && r >= 3) return { label: "AA large", tone: "aa" };
  return { label: "fails", tone: "no" };
};

/* the gate's four pairs: text on its worst ground, the button label, the control border */
export const gateRows = (t: Theme) =>
  [
    { label: "body text", fg: val(t, "ink"), bg: val(t, "bg"), control: false },
    { label: "muted text", fg: val(t, "muted"), bg: val(t, "panel"), control: false },
    { label: "button label", fg: val(t, "on-action"), bg: val(t, "action"), control: false },
    { label: "input border", fg: val(t, "border-strong"), bg: val(t, "bg"), control: true },
  ].map((row) => {
    const r = ratio(row.fg, row.bg);
    return { ...row, ratio: r, grade: grade(r, row.control) };
  });

/* log scale, 1 to 21 */
export const gatePct = (v: number) => (Math.log(Math.max(v, 1)) / Math.log(21)) * 100;

/* "One name, two answers": the names a component asks for */
export const ASKS: { name: string; light: string; lightHex: string; dark: string; darkHex: string }[] = [
  { name: "background", light: "{color.light.bg}", lightHex: "#ffffff", dark: "{color.dark.bg}", darkHex: "#0d0d0d" }, // token-waiver: the hex IS the answer shown
  { name: "text-primary", light: "{color.light.ink}", lightHex: "#121212", dark: "{color.dark.ink}", darkHex: "#ededed" }, // token-waiver: the hex IS the answer shown
  { name: "text-muted", light: "{color.light.muted}", lightHex: "#515151", dark: "{color.dark.muted}", darkHex: "#b1b1b1" }, // token-waiver: the hex IS the answer shown
  { name: "surface-card", light: "{color.light.panel}", lightHex: "#f2f2f2", dark: "{color.dark.surface}", darkHex: "#161616" }, // token-waiver: the hex IS the answer shown
  { name: "focus-ring", light: "{color.brand.ochre-deep}", lightHex: "#b97a14", dark: "{color.brand.ochre}", darkHex: "#e8a83e" }, // token-waiver: the hex IS the answer shown
];
