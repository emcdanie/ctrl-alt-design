import { readFileSync } from "node:fs";
import { join } from "node:path";

/* The audit count, DERIVED (2026-07-27, spec system-page-redesign).
 *
 * The number was typed into four surfaces and had gone stale in all of
 * them: the page intro, the status card and the gate section all said
 * "thirteen" and the maturity map said "a 13-audit gate" while the gate
 * actually ran fifteen. A number that lives in four places drifts in
 * four places. It now comes from the ONE source of truth, the gate
 * script in package.json, so adding an audit moves every surface.
 *
 * Server-only: called from the page (a server component) and passed
 * down as a prop. */

export function auditNames(): string[] {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
  const gate: string = pkg.scripts?.gate ?? "";
  return [...new Set([...gate.matchAll(/audit:[a-z]+/g)].map((m) => m[0]))];
}

export function auditCount(): number {
  return auditNames().length;
}

/* Spelled out for prose, so a sentence reads as a sentence. Falls back
 * to the digits past the range we would ever plausibly reach. */
const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];

export function spellCount(n: number): string {
  return WORDS[n] ?? String(n);
}
