/**
 * Motion System — Design Tokens
 *
 * Single source of truth for all animation durations, easings, distances,
 * and transition presets across the portfolio. Inspired by Vercel/Linear
 * motion principles: purposeful, subtle, performance-first.
 *
 * Usage:
 *   import { duration, easing, transition } from "@/lib/motion";
 *   style={{ transition: transition.default }}
 */

/* ─── Durations ────────────────────────────────────────────────── */

export const duration = {
  /** Micro-interactions: toggles, icon swaps (100ms) */
  instant: 100,
  /** Hover states, button feedback (150ms) */
  fast: 150,
  /** Default transitions: cards, panels (240ms) */
  normal: 240,
  /** Entrances, exits, reveals (350ms) */
  moderate: 350,
  /** Viewport-triggered fade-ins (550ms) */
  entrance: 550,
  /** Hero/page-level transitions (700ms) */
  slow: 700,
} as const;

/** Duration values as CSS strings */
export const durationCSS = {
  instant: `${duration.instant}ms`,
  fast: `${duration.fast}ms`,
  normal: `${duration.normal}ms`,
  moderate: `${duration.moderate}ms`,
  entrance: `${duration.entrance}ms`,
  slow: `${duration.slow}ms`,
} as const;

/* ─── Easings ──────────────────────────────────────────────────── */

export const easing = {
  /** Standard ease — general purpose */
  default: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  /** Decelerate — entrances, things arriving */
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Accelerate — exits, things leaving */
  in: "cubic-bezier(0.55, 0, 1, 0.45)",
  /** Symmetric — toggles, state changes */
  inOut: "cubic-bezier(0.45, 0, 0.55, 1)",
  /** Expressive — menu reveals, overlays (matches OverlayNav) */
  expressive: "cubic-bezier(0.76, 0, 0.24, 1)",
  /** Linear — continuous animations (carousel, spinner) */
  linear: "linear",
} as const;

/* ─── Distances ────────────────────────────────────────────────── */

export const distance = {
  /** Subtle shift — hover lift, small feedback (3px) */
  micro: 3,
  /** Card entrance, content reveal (16px) */
  small: 16,
  /** Section entrance, standard fade-in (24px) */
  medium: 24,
  /** Hero entrance, page-level slide (40px) */
  large: 40,
} as const;

/* ─── Stagger ──────────────────────────────────────────────────── */

export const stagger = {
  /** Fast stagger for small lists (40ms between items) */
  fast: 40,
  /** Default stagger for section content (80ms) */
  default: 80,
  /** Slow stagger for hero sequences (120ms) */
  slow: 120,
} as const;

/* ─── Composite transitions ───────────────────────────────────── */

export const transition = {
  /** Default — card hovers, panel state changes */
  default: `transform ${durationCSS.normal} ${easing.out}, box-shadow ${durationCSS.normal} ${easing.out}`,
  /** Fast — button feedback, toggle states */
  fast: `all ${durationCSS.fast} ${easing.default}`,
  /** Entrance — viewport-triggered fade/slide */
  entrance: (delay = 0) =>
    `opacity ${durationCSS.entrance} ${easing.out} ${delay}ms, transform ${durationCSS.entrance} ${easing.out} ${delay}ms`,
  /** Color — background, border, text color shifts */
  color: `background ${durationCSS.fast} ${easing.default}, border-color ${durationCSS.fast} ${easing.default}, color ${durationCSS.fast} ${easing.default}`,
  /** Shadow — elevation changes */
  shadow: `box-shadow ${durationCSS.normal} ${easing.out}`,
  /** Expand — accordion, collapsible content */
  expand: `max-height ${durationCSS.moderate} ${easing.default}, opacity ${durationCSS.normal} ${easing.default}`,
  /** Scale — image zoom on hover */
  scale: `transform ${durationCSS.slow} ${easing.out}`,
} as const;

/* ─── Reduced motion helper ───────────────────────────────────── */

/**
 * Returns true when the user prefers reduced motion.
 * Safe for SSR (returns false on server).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * React hook-friendly: returns the transition string or "none"
 * based on the user's motion preference.
 */
export function motionSafe(value: string): string {
  if (prefersReducedMotion()) return "none";
  return value;
}
